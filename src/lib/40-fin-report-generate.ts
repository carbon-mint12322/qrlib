import { makeS3FileName } from './util/fileutil';
import mergeValue from './util/mergeValue';
import { IWorkflowStepArg, pipe } from './util/pipe';

async function extractFinReportData(x: IWorkflowStepArg) {
  const eventList = x.value.eventList || [];
  const durationExpensesList = eventList
    .map((evt) => evt.details?.durationAndExpenses)
    .filter(isDefined);
  const aggregateFinData = durationExpensesList.reduce(
    (acc: any, val: any) => {
      return {
        totalMenLabourDays:
          acc.totalMenLabourDays + safeReadNumber(val.totalMenLabourDays),
        totalLaborExpenditure:
          acc.totalLaborExpenditure + safeReadNumber(val.totalLaborExpenditure),
        totalExpenditure:
          acc.totalExpenditure + safeReadNumber(val.totalExpenditure),
      };
    },
    {
      totalMenLabourDays: 0,
      totalLaborExpenditure: 0,
      totalExpenditure: 0,
    }
  );
  const finSection = { financials: { aggregateFinData, durationExpensesList } };
  return mergeValue(finSection, x);
}

async function renderFinReport(x: IWorkflowStepArg) {
  const html = await x.primitives.finReportRender(
    x.value.domainContextSchemaId,
    x.value
  );
  return mergeValue({ finReportHtml: html }, x);
}

async function finReportStore(x: IWorkflowStepArg) {
  const outFn = makeS3FileName(x, 'finReport.html');
  const url = await x.primitives.writeS3File(
    x,
    outFn,
    {
      'Content-Type': 'text/html',
    },
    x.value.finReportHtml
  );
  return mergeValue({ financialReportUrl: url }, x);
}

async function finReportSave(x: IWorkflowStepArg): Promise<IWorkflowStepArg> {
  const mods = {
    finReportLink: x.value.finReportUrl,
  };
  await x.primitives
    .getModel(x.value.domainContextSchemaId)
    .update(
      x.value.domainContextObjectId,
      mods,
      x.ctx.session.userId,
      x.ctx.dbSession
    );
  return x;
}

export default pipe(
  extractFinReportData,
  renderFinReport,
  finReportStore,
  finReportSave
);

function isDefined(x: any) {
  return x ? true : false;
}

function safeReadNumber(val: any) {
  if (typeof val !== 'number') {
    return 0;
  }
  return val;
}
