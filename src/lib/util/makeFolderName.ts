import { IWorkflowStepArg } from './pipe';
import { uniqueId } from './uniqueId';

export function makeFolderName(x: IWorkflowStepArg) {
  return (
    `/${x.primitives.getAppName()}` +
    `/${x.value.domainSchemaId}/${x.value.domainObjectId}/${uniqueId()}`
  );
}
