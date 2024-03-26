import { IWorkflowStepArg } from './util/pipe';
import mergeValue from './util/mergeValue';
import { makeFolderName } from './util/makeFolderName';

export async function createOutputFolderName(x: IWorkflowStepArg) {
  const outputFolderName = makeFolderName(x);
  return mergeValue(
    {
      outputFolderName,
    },
    x
  );
}
