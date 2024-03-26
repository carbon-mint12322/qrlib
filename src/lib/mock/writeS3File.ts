import fs from 'fs/promises';
import { IWorkflowStepArg } from '../util/pipe';

async function writeS3File(
  _x: IWorkflowStepArg,
  filename: string,
  _meta: Record<string, string>,
  content: string
) {
  // create tmp subdirectory if it doesnt exist, using fs module
  const root = '/tmp/s3';
  const path = root + filename;
  const dirName = path.split('/').slice(0, -1).join('/');
  await createDirectoryIfNotExists(dirName);
  await fs.writeFile(path, content);
  async function createDirectoryIfNotExists(path: string): Promise<void> {
    await fs.mkdir(path, { recursive: true });
  }
  return `fake-s3://${path}`;
}

export default writeS3File;
