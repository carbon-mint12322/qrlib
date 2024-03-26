import { IWorkflowStepArg } from './pipe';

export default function mergeValue(value: object, current: IWorkflowStepArg) {
  return {
    ...current,
    value: {
      ...current.value,
      ...value,
    },
  };
}
