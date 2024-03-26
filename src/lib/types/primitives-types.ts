import { IWorkflowStepArg, Step } from '../util/pipe';
import { IDbModelApi } from './db-types';
/**  
 * const result = await createBlockchainRecord({ ...lockedPayloadData, hash });
  const { blockHash, blockNumber, transactionHash, transactionIndex } = result;
 */

export type IBlockchainRecord = {
  blockHash: string;
  blockNumber: number;
  transactionHash: string;
  transactionIndex: number;
};

export type PrimitiveFunctions = {
  bcSerializePayload: (x: any) => string;
  bcCalcHash: (x) => string;
  createBlockchainRecord: (obj: any) => Promise<IBlockchainRecord>;
  getAppName: () => string;
  getBlockchainRecordUrl: (record: IBlockchainRecord) => string;
  getModel: (name: string) => IDbModelApi;
  getSchema: (name: string) => Promise<any>;
  qrRender: (contextSchemaId: string, data: any) => Promise<string>;
  finReportRender: (contextSchemaId: string, data: any) => Promise<string>;
  readAttachment: (link: string, db?: any) => Promise<Buffer | string>;
  writeS3File: (
    x: IWorkflowStepArg,
    filename: string,
    meta: Record<string, string>,
    content: Buffer | string
  ) => Promise<string>;
  connectDB: () => any;
};
