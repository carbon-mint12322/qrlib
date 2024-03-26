import { pipe, taplog } from './util/pipe';
import dbLoadDataTree from './01-load-data';
import lockPastEvents from './10-lock-past-events';
import { createOutputFolderName } from './15-createOutputFolderName';
import copyAttachments from './20-copy-attachments';
import qrGenerate from './30-qr-generate';
import finReportGenerate from './40-fin-report-generate';
import blockchainLock from './50-bc-lock';
import dbUpdateFinal from './60-db-update-final';
import { extractContextId } from './extractContextId';

export const lockingPipeline = pipe(
  extractContextId,
  taplog('[generateQr]', 'entering dbLoadDataTree'),
  dbLoadDataTree,
  taplog('[generateQr]', 'entering lockPastEvents'),
  lockPastEvents,
  createOutputFolderName,
  taplog('[generateQr]', 'entering copyAttachments'),
  copyAttachments,
  taplog('[generateQr]', 'entering qrGenerate'),
  qrGenerate,
  taplog('[generateQr]', 'entering finReportGenerate'),
  finReportGenerate,
  taplog('[generateQr]', 'entering blockchainLock'),
  blockchainLock,
  taplog('[generateQr]', 'entering dbUpdateFinal'),
  dbUpdateFinal
);
