import { uniqBy } from 'lodash';
import { unRefSchema } from '../util/schema-util';
export type ObjectData = any;
export type ObjectDataList = ObjectData[];
export type RelatedObjectTable = Record<string, ObjectData[]>;

export type ObjectDataTuple = [ObjectData, RelatedObjectTable];

const loadObjectTree = (getModelApi: any, getSchema: any) =>
  async function loadSubobjectTree(
    id: string,
    modelName: string,
    alreadyLoaded: Record<string, any> = {}
  ): Promise<ObjectDataTuple> {
    // load schema for modelName
    // Load object of type modelName, and id using modelApi.get function
    // For each field in the schema that has "array" property in its type property, with type == object
    // asynchronously call loadObjectTree with id and modelName. Replace field value with the result.
    // For each field in the schema that has "object" property with type == object and with schema property with schema field,
    // asynchronously call loadObjectTree with id and modelName. Replace field value with the result.
    const modelApi = getModelApi(modelName);
    const data = await modelApi.get(id);
    const schema = unRefSchema(await getSchema(modelName));

    // lookup already loaded objects, and return them if found
    if (alreadyLoaded[`${modelName}:${id}`]) {
      return alreadyLoaded[`${modelName}:${id}`];
    }

    const result1: ObjectDataTuple = await loadReferencedObjects(
      schema,
      data,
      loadSubobjectTree,
      alreadyLoaded
    );
    const result2: ObjectDataTuple = await loadReferencedArrObjects(
      schema,
      data,
      loadSubobjectTree,
      alreadyLoaded
    );
    const merge1 = mergeRelatedObjects({}, [result1]);
    const merge2 = mergeRelatedObjects(merge1, [result2]);
    const objectData = { ...data, ...result1[0], ...result2[0] };
    const tuple: ObjectDataTuple = [objectData, merge2];
    alreadyLoaded[`${modelName}:${id}`] = tuple;
    const output: ObjectDataTuple = [
      { ...data, ...result1[0], ...result2[0] },
      merge2,
    ];
    const input = { id, modelName };
    // console.log({ input, output });
    return output;
  };

export default loadObjectTree;

const isForeignReference = (schema: any) => (key: string) =>
  (schema.properties[key]?.type === 'string' &&
    schema.properties[key]?.schemaId) ||
  (schema.properties[key]?.type === 'object' &&
    schema.properties[key]?.properties?.id &&
    schema.properties[key]?.properties?.name);
const isArrayField = (schema: any) => (key: string) =>
  schema.properties[key]?.type === 'array';

async function loadReferencedObjects(
  schema: any,
  data: any,
  loadSubobjectTree: (
    id: string,
    modelName: string,
    alreadyLoaded: any
  ) => Promise<ObjectDataTuple>,
  alreadyLoaded: Record<string, any>
): Promise<ObjectDataTuple> {
  if (!(schema && schema.properties)) {
    return [data, {}];
  }
  if (!data) {
    return [data, {}];
  }
  const foreignFields = Object.keys(schema.properties).filter(
    isForeignReference(schema)
  );
  if (foreignFields.length === 0) {
    return [data, {}];
  }

  const subObjectData: Record<string, any> = {};
  let relatedObjects: RelatedObjectTable = {}; // key is modelName, value is array of objects
  for (const key of foreignFields) {
    const subschema = schema.properties[key];
    const subModelName = subschema.schemaId;
    const value = data[key];
    if (!value) {
      continue;
    }
    if (!subModelName) {
      console.debug(`*** No schema specified for: ${key}`);
      continue;
    }
    const value2 = typeof value === 'object' ? value.id : value;
    const parts = value2.split(':'); // in case we have reference stored in the form <id>:<name>
    const id = parts[0];
    const [subdata, subrelated] = await loadSubobjectTree(
      id,
      subModelName,
      alreadyLoaded
    );
    relatedObjects = { ...relatedObjects, ...subrelated };
    subObjectData[key] = subdata;
    if (!relatedObjects[subModelName]) {
      relatedObjects[subModelName] = [];
    }
    relatedObjects[subModelName].push(subdata);
  }

  return [{ ...data, ...subObjectData }, relatedObjects];
}

async function loadReferencedArrObjects(
  schema: any,
  data: any,
  loadSubobjectTree: (
    id: string,
    modelName: string,
    alreadyLoaded: any
  ) => Promise<any>,
  alreadyLoaded: Record<string, any>
): Promise<ObjectDataTuple> {
  if (!(schema && schema.properties)) {
    return [data, {}];
  }
  const arrFields = Object.keys(schema.properties).filter(isArrayField(schema));
  const subObjectData: Record<string, any> = {};
  let relatedObjects: RelatedObjectTable = {};
  for (const key of arrFields) {
    const arrValue = data[key] || [];
    if (!arrValue) {
      continue;
    }
    const subschema = schema.properties[key];
    const itemSchema = subschema?.items;
    if (itemSchema.type === 'array') {
      continue;
    }
    if (itemSchema.type !== 'object') {
      continue;
    }
    const subModelName = itemSchema?.schemaId;
    if (subModelName) {
      const promArr = arrValue.map(async (idstr: string) => {
        const parts = idstr.split(':'); // in case we have reference stored in the form <id>:<name>
        const id = parts[0];
        const tuple = await loadSubobjectTree(id, subModelName, alreadyLoaded);
        if (!relatedObjects[subModelName]) {
          relatedObjects[subModelName] = [];
        }
        relatedObjects[subModelName].push(tuple[0]);
        return tuple;
      });
      const subobjTuples: ObjectDataTuple[] = await Promise.all(promArr);
      subObjectData[key] = subobjTuples.map(
        (tuple: ObjectDataTuple) => tuple[0]
      );
      relatedObjects = mergeRelatedObjects(relatedObjects, subobjTuples);
      relatedObjects = mergeRelated2(
        relatedObjects,
        subModelName,
        subObjectData[key]
      );
    } else {
      const subobjTuples: ObjectDataTuple[] = await Promise.all(
        arrValue.map(async (item: any) => {
          const tuple = await loadReferencedObjects(
            itemSchema,
            item,
            loadSubobjectTree,
            alreadyLoaded
          );

          const related2 = tuple[1];
          relatedObjects = mergeTables(relatedObjects, related2);
          return tuple;
        })
      );
      const accumulate = (
        acc: ObjectData[],
        [item, _related]: ObjectDataTuple
      ) => [...acc, item];
      const initval = [] as ObjectData[];
      const arrval: ObjectData[] = subobjTuples.reduce(accumulate, initval);
      subObjectData[key] = arrval;

      const modelName = itemSchema?.schemaId;
      if (modelName) {
        relatedObjects = mergeRelated2(relatedObjects, modelName, arrval);
      }
    }
  }
  return [subObjectData, relatedObjects];
}

function mergeTables(before1: RelatedObjectTable, before2: RelatedObjectTable) {
  const after = { ...before1 };
  Object.keys(before2).forEach((modelName) => {
    if (!after[modelName]) {
      after[modelName] = [];
    }
    after[modelName] = uniqBy(
      [...after[modelName], ...before2[modelName]],
      (x: any) => '' + (x._id || x.id)
    );
  });
  return after;
}

function mergeRelated2(
  relatedObjects: RelatedObjectTable,
  modelName: string,
  data: ObjectData[]
) {
  if (!relatedObjects[modelName]) {
    relatedObjects[modelName] = [];
  }
  relatedObjects[modelName] = [...relatedObjects[modelName], ...data];
  return relatedObjects;
}

function mergeRelatedObjects(
  relatedObjects: RelatedObjectTable,
  subobjTuples: ObjectDataTuple[]
): RelatedObjectTable {
  const newRelatedObjects: RelatedObjectTable = { ...relatedObjects };
  subobjTuples.forEach((tuple) => {
    const subRelatedObjects = tuple[1] || {};
    Object.keys(subRelatedObjects).forEach((modelName) => {
      if (!newRelatedObjects[modelName]) {
        newRelatedObjects[modelName] = [];
      }
      newRelatedObjects[modelName] = [
        ...(newRelatedObjects[modelName] || []),
        ...subRelatedObjects[modelName],
      ];
    });
  });
  return newRelatedObjects;
}
