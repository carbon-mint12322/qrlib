import { getMeta, makeS3FileName } from './util/fileutil';
import mergeValue from './util/mergeValue';
import { IWorkflowStepArg, pipe, Step } from './util/pipe';

const copyAttachments: Step = pipe(
  listAttachments,
  copyAttachmentsToS3,
  mapAttachments
);

export default copyAttachments;

async function listAttachments(x: IWorkflowStepArg) {
  if (!x.value.domainContextTree) {
    return x;
  }
  const attachmentList = recurseGetAttachments(x.value.domainContextTree);
  return Promise.resolve(mergeValue({ attachmentList }, x));
}

async function mapAttachments(x: IWorkflowStepArg) {
  const {
    value: { attachmentMap, attachmentList },
  } = x;
  const attachmentsMapped = attachmentList.map((url) => attachmentMap[url]);
  return mergeValue({ attachmentsMapped }, x);
}

async function copyAttachmentsToS3(x: IWorkflowStepArg) {
  // eslint-disable-next-line functional/prefer-readonly-type
  const attachments: string[] = x.value.attachmentList;
  if (!attachments) return x;

  // const proms = attachments.map(copyOneAttachment(x));
  const results2 = [];
  // eslint-disable-next-line functional/no-loop-statement, functional/no-let
  for (let i=0; i < attachments.length; i++) {
    // eslint-disable-next-line functional/immutable-data
    results2.push(await copyOneAttachment(x)(attachments[i]));
  }
  // const results = await Promise.all(proms);
  const attachmentMap = results2.reduce((acc, val) => ({ ...acc, ...val }), {});
  return mergeValue({ attachmentMap }, x);
}

function copyOneAttachment(x: IWorkflowStepArg) {
  return async (url: string) => {
    const meta: Record<string, string> = getMeta(x, url);
    const db = await x.primitives.connectDB();
    const content = await x.primitives.readAttachment(url, db);
    const outFn = makeS3FileName(x, url);
    const s3url = await x.primitives.writeS3File(x, outFn, meta, content);
    return { [url]: s3url };
  };
}

const recurseGetAttachments = (value: any) => {
  if (value === null || value === undefined) {
    return null;
  }
  if (typeof value === 'string') {
    return isAttachment(value) ? value : null;
  }
  if (Array.isArray(value)) {
    return value.flatMap(recurseGetAttachments).filter(notNull);
  }
  if (typeof value === 'object') {
    const attachmentProps = Object.values(value)
      .flatMap(recurseGetAttachments)
      .filter(notNull);
    return attachmentProps;
  }
  return null;
};

// eslint-disable-next-line functional/no-let
let _id_ = new Date().getTime();

function uniqueId() {
  return _id_++;
}

const isUrl = (val: unknown) => typeof val === "string" && val.startsWith("http");
const notNull = (x) => x !== null;
const gridfsRe = /gridfs/i;
const s3Re = /s3/i;
const isAttachment = (val: string) => isUrl(val) && (gridfsRe.test(val) || s3Re.test(val));
