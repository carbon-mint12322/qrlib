import R from 'ramda';
import { WorkflowContext } from '../types/wf-types';
import { PrimitiveFunctions } from '../types/primitives-types';
import dayjs from 'dayjs';

export interface IWorkflowStepArg {
  value: any;
  ctx: WorkflowContext;
  flowContext?: any;
  primitives: PrimitiveFunctions;
}
export type Step = (x: IWorkflowStepArg) => Promise<IWorkflowStepArg>;

export const IdentityStep: Step = async (
  x: IWorkflowStepArg
): Promise<IWorkflowStepArg> => Promise.resolve(x);

export function pipe(...fnArr: Step[]) {
  const name = generateId();
  const composed = R.pipeWith(R.andThen, [IdentityStep, ...fnArr] as any);
  return async (x: IWorkflowStepArg): Promise<IWorkflowStepArg> => {
    const result: IWorkflowStepArg = await (composed(
      Promise.resolve(x)
    ) as Promise<IWorkflowStepArg>);
    return result;
  };
}

export function tap(fn: (x: any) => void) {
  return (x: any) => {
    fn(x);
    return x;
  };
}

export function taplog(...x: any[]) {
  return (y: any) => {
    const ts = dayjs().format('HH:mm:ss.SSS');
    console.debug(`[${ts}]`, ...x);
    return y;
  };
}

export function tapWithValue(...x: any[]) {
  return (y: any) => {
    console.debug(...x);
    console.debug({ currentValue: y.value });
    return y;
  };
}

let _id = 1;
export function generateId() {
  return 'pipeline-' + _id++;
}
