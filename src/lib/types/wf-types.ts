//import {JSONSchemaType} from "ajv"

import { IDbTransactionSession, IDbModelApi } from './db-types';

export const wfDefSchemaId = '/workflow/WfDefinition';
export const wfInstSchemaId = '/workflow/WfInstance';

type JSONSchemaType = any;
export type FunctionTable = Record<string, Function>;
export type SchemeId = string;

//type NonEmptyArray<T> = [T, ...T[]];

// TODO - replace with types from AJV
export interface JsonSchemaValidationResult {
  isValid: boolean;
  errors?: any[];
}

export interface BaseTrigger {
  eventName: string;
  description?: string;

  // Roles that are allowed to invoke this trigger
  // if the role list is empty, anyone can invoke the trigger
  roles?: string[];

  // JSON schema for the event data
  inputSchema: JSONSchemaType;
  // Schema name for input event
  inputSchemaName?: string;
}

export interface Trigger extends BaseTrigger {
  // A list of asynchronous steps to be executed.
  // Data loading and saving are automatically performed
  // by the workflow engine
  processingSteps?: ProcessingStep[];

  // Transition conditions are evaluated and state is
  // transitioned after all the processing steps are complete.
  // If any of the steps throws an error, the workflow remains
  // in the same state, but the error is logged.
  transitions: Transition[];
}

// Run-time mapped trigger, i.e. steps and conditions have `func`
// fields which are mapped from importPath in Trigger definition.
export interface MappedTrigger extends BaseTrigger {
  processingSteps?: MappedProcessingStep[];
  transitions: MappedTransition[];
}

export interface Condition {
  name: string;
  importPath: string; // e.g. ~/workflows/functions/myModule#myFunction
  description?: string;
}

export interface Transition {
  // If condition is not provided, it's assumed to be "true"
  condition?: Condition;
  state: string;
  description?: string;
}

export interface MappedTransition extends Transition {
  func: Function; // "condition" above mapped to a function
}

export interface BaseStateType {
  name: string;
  isEndState?: boolean;
  description?: string;
}

export interface EndStateType extends BaseStateType {}
export interface IntermediateStateType extends BaseStateType {
  triggers: Trigger[];
}

export type StateType = IntermediateStateType | EndStateType;

export type StateData = any;
export interface StateHistory {
  previousState: State;
}

export interface State {
  name: string;
  data: StateData;
  history?: StateHistory;
  event?: any;
}

export interface WorkflowDefinition {
  name: string;
  startStateName: string;
  domainSchemaId: string;
  description?: string;
  states: StateType[]; // NonEmptyArray<StateType>
  testScenariosFiles?: string[];
}

export interface WorkflowInstance {
  id: string;
  domainSchemaId: string; // e.g. /farmbook/event
  domainObjectId: string | undefined;
  domainContextSchemaId?: string; // e.g. /farmbook/crop
  domainContextObjectId?: string;
  def: WorkflowDefinition;
  state: State;
  dbSession?: IDbTransactionSession;
}
export interface UserSession {
  userId: string;
  roles?: string[];
  email?: string;
  name?: string;
}
export interface WorkflowContext {
  wf: WorkflowInstance;
  wfDef: MappedWorkflowDefinition;
  event: WorkflowEvent;
  session: UserSession;
  domainObject?: any;
  data?: any; // for backward compatibilty - same as domainObject
  logger: any;
  domainObjDbApi: IDbModelApi;
  dbSession: IDbTransactionSession;
  domainContextObject?: any;
}

export interface WorkflowEvent {
  eventName: string;
  wfInstanceId: string;
  data: any;
}

// Function types
export type InstantiateWf = (
  def: WorkflowDefinition,
  trigger: Trigger,
  data: any,
) => Promise<WorkflowInstance>;

export type EventProcessor = (wf: WorkflowInstance, trigger: Trigger) => Promise<WorkflowInstance>;

// Evaluates new state based on trigger
export type TransitionEvaluator = (currentState: State, trigger: Trigger) => Promise<State | null>;

export interface ProcessingStep {
  name: string;
  description?: string;
  importPath: string;
  // schemes for which this step should be executed. If not specified
  // or empty, applies to all schemes.
  schemes?: SchemeId[];
}

//
// Mapped types - these types have additional "func" property added to
// processingStep and transition conditions.
//

export interface MappedStateType {
  name: string;
  isStartState: boolean;
  isEndState: boolean;
  triggers: MappedTrigger[];
  description?: string;
}

export interface MappedProcessingStep {
  name: string;
  description?: string;
  importPath: string;
  func: Function;
}

export interface MappedWorkflowDefinition {
  name: string;
  startStateName: string;
  description?: string;
  domainSchemaId: string;
  states: MappedStateType[];
}

export interface WorkflowStartHandlerInput {
  org?: string;
  instanceId?: string; // new workflow ID
  wfName: string; // name of the workflow
  domainObjectId?: string;
  domainSchemaId?: string;
  eventName: string; // Name of the event specified in start state trigger
  eventData: any; // payload "formData"
}

export interface WorkflowEventHandlerInput {
  org?: string;
  instanceId: string; // new workflow ID
  eventName: string; // Name of the event specified in start state trigger
  eventData: any; // payload "formData"
}
