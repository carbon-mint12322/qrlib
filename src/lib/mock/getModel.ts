import {
  IDbModelApi,
  IDbTransactionSession,
  ObjectId,
  ViewDef,
} from '../types/db-types';
import getObjList from './getObjList';

export const mockDbTransactionSession = {
  withTransaction: () => 0,
  abortTransaction: () => 0,
  endSession: () => 0,
};

/* eslint-disable */
export const mockDbApi = (schemaId: string) => {
  let objList: any[] = getObjList(schemaId);
  return {
    create: (_: any, _userId: string, __: IDbTransactionSession) => Promise.resolve({}),
    createMany: (_: any[], __?: IDbTransactionSession) => Promise.resolve({}),
    get: (id: ObjectId, __?: IDbTransactionSession) => {
      const obj = objList.find((x) => x._id === id);
      if (!obj) {
        return Promise.reject(
          new Error(`Object not found (${schemaId}, ${id})`)
        );
      }
      return Promise.resolve(obj);
    },
    getMulti: (_: ObjectId[], __?: IDbTransactionSession) =>
      Promise.resolve([]),
    update: (
      id: ObjectId,
      updates: any,
      _userId: string,
      _options?: any,
      _tx?: IDbTransactionSession
    ) => {
      const obj = objList.find((x) => x._id === id);
      if (!obj) {
        return Promise.reject(
          new Error(`Object (${schemaId}, ${id} )not found`)
        );
      }
      const newObj = { ...obj, ...updates };
      objList = objList.map((x) => (x._id === id ? newObj : x));
      return Promise.resolve({});
    },
    updateMany: (
      _: object,
      __: any,
      ___: string,
      ____?: any,
      _____?: IDbTransactionSession
    ) => Promise.resolve({}),
    add: (
      _: ObjectId,
      __: any,
      ___: string,
      ____?: any,
      _____?: IDbTransactionSession
    ) => Promise.resolve({}),
    addUnique: (
      _: ObjectId,
      __: any,
      ___?: any,
      ____?: IDbTransactionSession
    ) => Promise.resolve({}),
    updateNestedDoc: (
      _: ObjectId,
      __: string,
      ___: object,
      ____: object,
      _____: string,
      ______?: IDbTransactionSession
    ) => Promise.resolve({}),
    remove: (_: ObjectId, __?: IDbTransactionSession) => Promise.resolve({}),
    removeAll: (_?: IDbTransactionSession) => Promise.resolve({}),
    list: (filter: any, _options?: any, _session?: IDbTransactionSession) => {
      if (/event/.test(schemaId)) {
        if (filter.cropId) {
          const matchingObjList = objList.filter(
            (x) => x.cropId === filter.cropId
          );
          return Promise.resolve(matchingObjList);
        }
      }
      return Promise.resolve(objList);
    },

    findOne: (_: any, __?: any, ___?: IDbTransactionSession) =>
      Promise.resolve({}),
    distinctList: (_: string, __: any) => Promise.resolve({}),
    // alias for findOne
    getByFilter: (_: any, __?: any, ___?: IDbTransactionSession) =>
      Promise.resolve({}),
    // find objects at the root level collections
    findOneAtRoot: (_: any, __?: any, ___?: IDbTransactionSession) =>
      Promise.resolve({}),

    // create an "inner" join between two collections
    createView: (_: ViewDef) => ({
      list: (_: any) => Promise.resolve({}),
    }),

    startSession: () => Promise.resolve(mockDbTransactionSession),

    /* eslint-disable  no-unused-vars */
    aggregate: (_: any) => Promise.resolve({}),
  };
};

export default function getModel(schemaId: string): IDbModelApi {
  return mockDbApi(schemaId);
}
