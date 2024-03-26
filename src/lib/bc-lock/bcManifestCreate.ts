import mergeValue from '../util/mergeValue';
import { IWorkflowStepArg } from '../util/pipe';

async function bcManifestCreate(x: IWorkflowStepArg) {
  const {
    value: { outputFolderName, lockedPayloadData, blockchainData },
  } = x;
  const blockchainManifestData = {
    ...lockedPayloadData,
    blockchainData,
    uri: x.value.qrUrl,
    attachments: x.value.attachmentsMapped,
  };
  const blockchainManifestJson = JSON.stringify(
    blockchainManifestData,
    null,
    2
  );
  const blockchainManifest = `${outputFolderName}/blockchain-manifest.json`;
  const meta = { contentType: 'application/json' };
  await x.primitives.writeS3File(
    x,
    blockchainManifest,
    meta,
    blockchainManifestJson
  );
  return mergeValue({ blockchainManifestData, blockchainManifest }, x);
}

export default bcManifestCreate;
