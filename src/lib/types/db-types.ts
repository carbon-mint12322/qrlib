export interface IGenericObject {
  app: string;
  schemaId: string;
  ddcId?: string;
  data: any;
  tgs: any[];
}

// mongo session for transactions
export type IDbTransactionSession = {
  withTransaction: Function;
  abortTransaction: Function;
  endSession: Function;
};

export interface IDb {
  connect: () => Promise<any>;
  disconnect: () => Promise<any>;
  getModel: (schemaId: string) => IDbModelApi;
}

export type ICreateResult = any;
export type IDeleteResult = any;
export type IListResult = any;
export type IGetResult = any;
export type IUpdateResult = any;
export type ObjectId = string;

// a map identifying which fields to return
export type Projection = Record<string, boolean>;

export type ViewDef = {
  fromSchemaId: string; // Name of schema 1
  localField: string; // Field ID in schema to match with another field in schema2
  foreignSchemaId: string; // Name of schema 2
  foreignField: string; // Join field in schema 2
  projection1: Projection; // fields to retrieve in schema1
  projection2: Projection; // fields to retrieve in schema2

  foreignObjectName: string;
};

export interface IDbModelApi {
  create: (data: any, userId: string, session?: IDbTransactionSession) => Promise<ICreateResult>;
  createMany: (data: any[], session?: IDbTransactionSession) => Promise<ICreateResult>;
  get: (id: ObjectId, session?: IDbTransactionSession) => Promise<IGetResult>;
  getMulti: (id: ObjectId[], session?: IDbTransactionSession) => Promise<IGetResult[]>;
  update: (
    id: ObjectId,
    updates: any,
    userId: string,
    options?: any,
    session?: IDbTransactionSession,
  ) => Promise<IUpdateResult>;
  updateMany: (
    selection_criteria: object,
    updates: any,
    userId: string,
    options?: any,
    session?: IDbTransactionSession,
  ) => Promise<IUpdateResult>;
  add: (
    id: ObjectId,
    updates: any,
    userId: string,
    options?: any,
    session?: IDbTransactionSession,
  ) => Promise<IUpdateResult>;
  addUnique: (
    id: ObjectId,
    updates: any,
    options?: any,
    session?: IDbTransactionSession,
  ) => Promise<IUpdateResult>;
  updateNestedDoc: (
    id: ObjectId,
    nestedParamName: string,
    nestedDocFindQuery: object,
    newNestedDocObj: object,
    userId: string,
    session?: IDbTransactionSession,
  ) => Promise<IUpdateResult>;
  remove: (id: ObjectId, session?: IDbTransactionSession) => Promise<IDeleteResult>;
  removeAll: (session?: IDbTransactionSession) => Promise<IDeleteResult>;
  list: (filter: any, options?: any, session?: IDbTransactionSession) => Promise<IListResult>;
  findOne: (filter: any, options?: any, session?: IDbTransactionSession) => Promise<IGetResult>;
  distinctList: (field: string, filter: any) => Promise<IListResult>;
  // alias for findOne
  getByFilter: (filter: any, options?: any, session?: IDbTransactionSession) => Promise<IGetResult>;
  // find objects at the root level collections
  findOneAtRoot: (
    filter: any,
    options?: any,
    session?: IDbTransactionSession,
  ) => Promise<IGetResult>;

  // create an "inner" join between two collections
  createView: (viewDef: ViewDef) => IViewApi;

  startSession: () => Promise<IDbTransactionSession>;

  aggregate: (pipeline: any) => any; // Promise<any>;
}

export interface IViewApi {
  list: (query: any) => Promise<IListResult>;
}
