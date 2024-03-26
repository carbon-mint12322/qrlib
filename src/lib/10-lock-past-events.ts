import dayjs from 'dayjs';
import { IWorkflowStepArg, Step, pipe } from './util/pipe';
import { IDbTransactionSession } from './types/db-types';
import { PrimitiveFunctions } from './types/primitives-types';
import mergeValue from './util/mergeValue';

const listEventIds: Step = async (x: IWorkflowStepArg) => {
  const { ctx: wfctx } = x;
  const eventList = await fetchEvents(
    x.primitives,
    wfctx.wf.domainSchemaId,
    eventListFilter(x),
    { sort: { createdAt: -1 } },
    x.ctx.dbSession
  );
  const eventIdList: string[] = eventList.map((evt: any) => evt._id);
  return mergeValue({ eventList, eventIdList }, x);
};

const lockEventIds: Step = async (x: IWorkflowStepArg) => {
  const { value } = x;
  const eventIdList: string[] = value.eventIdList;
  const proms = eventIdList.map((id: string) => {
    const mods = {
      locked: true,
      lockDate: dayjs().toISOString(),
      lockedBy: x.ctx.session.userId,
    };
    return x.primitives
      .getModel('/farmbook/event')
      .update(id, mods, x.ctx.session.userId, x.ctx.dbSession);
  });
  await Promise.all(proms);
  return mergeValue({ eventIdList }, x);
};

const fetchEvents = async (
  primitives: PrimitiveFunctions,
  schemaId,
  filter: any,
  options: any,
  dbSession: IDbTransactionSession
) => primitives.getModel(schemaId).list(filter, options, dbSession);

const eventListFilter = (x: IWorkflowStepArg) => ({
  cropId: x.ctx.wf.domainContextObjectId,
});

const lockPastEvents: Step = pipe(listEventIds, lockEventIds);

export default lockPastEvents;
