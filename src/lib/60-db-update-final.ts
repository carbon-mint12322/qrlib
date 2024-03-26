import { IWorkflowStepArg, IdentityStep, Step, pipe } from './util/pipe';

const dbUpdateFinal: Step = async (x: IWorkflowStepArg) => {
  const { lockedPayloadData, lockedData, blockchainData, blockchainRecordUrl } =
    x.value;
  const mods = {
    locked: true,
    lockedPayloadData,
    blockchainData,
    blockchainRecordUrl,
    lockedData,
  };
  await x.primitives
    .getModel(x.value.domainSchemaId)
    .update(
      x.value.domainObjectId,
      mods,
      x.ctx.session.userId,
      x.ctx.dbSession
    );
  return x;
};

export default dbUpdateFinal;
