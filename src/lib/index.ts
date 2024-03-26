import { WorkflowContext } from './types/wf-types';
import { IWorkflowStepArg, Step } from './util/pipe';
import { PrimitiveFunctions } from './types/primitives-types';

import { pipe, taplog } from './util/pipe';

export { default as dbLoadDataTree } from './01-load-data';
export { default as lockPastEvents } from './10-lock-past-events';
export { createOutputFolderName } from './15-createOutputFolderName';
export { default as copyAttachments } from './20-copy-attachments';
export { default as qrGenerate } from './30-qr-generate';
export { default as finReportGenerate } from './40-fin-report-generate';
export { default as blockchainLock } from './50-bc-lock';
export { default as dbUpdateFinal } from './60-db-update-final';
export { extractContextId } from './extractContextId';

/**
 * Main function triggered for locking/QR code generation
 * Note that the sequence of steps executed for this process amy vary
 * between applications (evlocker, farmbook, etc.). That's why
 * this function receives the sequence of steps as a parameter.
 *
 * This function is intended to be called from a workflow processing step
 */
export const kickoffLockingFromWorkflow =
  (
    lockingPipeline: Step /* sequence of steps to be executed, composed into one function*/,
    primitives: PrimitiveFunctions /* Primitive functions that can be mocked */
  ) =>
  (ctx: WorkflowContext) => {
    const initArg: IWorkflowStepArg = { value: null, ctx, primitives };
    return lockingPipeline(initArg);
  };
