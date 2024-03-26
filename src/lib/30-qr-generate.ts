import { makeS3FileName } from './util/fileutil';
import mergeValue from './util/mergeValue';
import { IWorkflowStepArg, pipe } from './util/pipe';

async function renderView(x: IWorkflowStepArg) {
  const html = await x.primitives.qrRender(x.value.domainSchemaId, x.value);
  return mergeValue({ html }, x);
}

async function qrStore(x: IWorkflowStepArg) {
  const outFn = makeS3FileName(x, 'qr.html');
  const url = await x.primitives.writeS3File(
    x,
    outFn,
    {
      'Content-Type': 'text/html',
    },
    x.value.html
  );
  return mergeValue({ qrUrl: url }, x);
}

async function qrSaveLink(x: IWorkflowStepArg): Promise<IWorkflowStepArg> {
  const mods = {
    qrLink: x.value.qrUrl,
  };
  await x.primitives
    .getModel(x.value.domainSchemaId)
    .update(
      x.value.domainObjectId.toString(),
      mods,
      x.ctx.session.userId,
      x.ctx.dbSession
    );
  return x;
}

export default pipe(renderView, qrStore, qrSaveLink);
