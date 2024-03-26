export function modelNameFromSchemaId(schemaId: string) {
  return schemaId.split('/').pop();
}
