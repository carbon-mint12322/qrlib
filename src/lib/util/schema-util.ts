import mapValues from 'lodash/mapValues';

export function unRefSchema(schema: any) {
  const definitions = schema.definitions;
  return lookupRefsShallow(definitions, schema);
}

const lookupRefsShallow = (defs: any, schema: any) => {
  const props = schema.properties;
  const newProps = mapValues(props, (prop: any) => {
    if (prop.$ref) {
      const name = prop.$ref.split('/').pop();
      return defs[name];
    }
    return prop;
  });
  return {
    ...schema,
    properties: newProps,
  };
};
