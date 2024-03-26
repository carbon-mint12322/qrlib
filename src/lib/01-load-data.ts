import { IWorkflowStepArg, Step, pipe } from './util/pipe';
import loadObjectTree from './db-load-data/object-tree';

const dbLoadContextObj: Step = async (x: IWorkflowStepArg) => {
  const {
    ctx: {
      wf: {
        domainContextSchemaId,
        domainContextObjectId,
        domainSchemaId,
        domainObjectId,
      },
    },
    primitives: { getModel, getSchema },
  } = x;
  const treeLoader = loadObjectTree(getModel, getSchema);
  const [domainObjectTree, domainObjectRelatedObjects] = await treeLoader(
    domainObjectId,
    domainSchemaId
  );
  const [domainContextTree, domainContextRelatedObjects] = await treeLoader(
    domainContextObjectId,
    domainContextSchemaId
  );
  return {
    ...x,
    value: {
      ...x.value,
      domainContextSchemaId,
      domainContextObjectId,
      domainSchemaId,
      domainObjectId,
      domainObjectTree,
      domainObjectRelatedObjects,
      domainContextTree,
      domainContextRelatedObjects,
    },
  };
};

const loadTreeProcessor = pipe(dbLoadContextObj);
const dbLoadTree: Step = async (x: IWorkflowStepArg) => {
  return loadTreeProcessor(x) as Promise<IWorkflowStepArg>;
};

export default dbLoadTree;
