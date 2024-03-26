import getMimeType from './mimetype';
import { IWorkflowStepArg } from './pipe';

export function getMeta(
  _x: IWorkflowStepArg,
  url: string
): Record<string, string> {
  const fileName = url.split('/').pop();
  const contentType = getMimeType(fileName);
  return { fileName, contentType };
}

export function makeS3FileName(x: IWorkflowStepArg, url: string) {
  const outputFolderName = x.value.outputFolderName;
  const meta = getMeta(x, url);
  return `${outputFolderName}/${meta.fileName}`;
}
