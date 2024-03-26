import { IBlockchainRecord } from '../types/primitives-types';
import mergeValue from '../util/mergeValue';
import { IWorkflowStepArg } from '../util/pipe';

export async function bcLockRecord(
  x: IWorkflowStepArg
): Promise<IWorkflowStepArg> {
  const qrLink = x.value.qrUrl;
  const attachments = [];
  const json = JSON.stringify({ uri: qrLink, attachments });
  const { name, email: email, phone_number, ...rest }: any = x.ctx.session;
  const lockedPayloadData = {
    file: json,
    uri: qrLink,
    userId: email || phone_number,
    userName: name || email,
    latitude: '0',
    longitude: '0',
    ts: 0,
    recipient: '',
    locked: true,
    attachments,
  };

  const payload = x.primitives.bcSerializePayload(lockedPayloadData);
  const hash = x.primitives.bcCalcHash(payload);
  const lockedData = { header: { hash }, payload };

  const blockchainData: IBlockchainRecord =
    await x.primitives.createBlockchainRecord({ ...lockedPayloadData, hash });
  const blockchainRecordUrl =
    x.primitives.getBlockchainRecordUrl(blockchainData);
  return mergeValue(
    { lockedPayloadData, lockedData, blockchainData, blockchainRecordUrl },
    x
  );
}
export default bcLockRecord;
