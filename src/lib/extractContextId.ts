import { IWorkflowStepArg } from './util/pipe';

export async function extractContextId(x: IWorkflowStepArg) {
  const {
    wf: {
      domainContextSchemaId, // e.g. 'crop' or '/farmbook/crop'
      domainContextObjectId, // e.g. cropId
      domainSchemaId,
      domainObjectId,
    },
  } = x.ctx;

  if (!(domainSchemaId && domainObjectId)) {
    return Promise.reject('No domainSchemaId or domainObjectId in workflow');
  }
  if (!(domainContextSchemaId && domainContextObjectId)) {
    return Promise.reject(
      'No domainContextSchemaId or domainContextObjectId in workflow'
    );
  }
  return Promise.resolve({
    ...x,
    value: {
      domainContextSchemaId,
      domainContextObjectId,
      domainSchemaId,
      domainObjectId,
    },
  });
}
