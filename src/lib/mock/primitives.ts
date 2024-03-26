import type { PrimitiveFunctions } from '../types/primitives-types';

import getSchema from './getSchema';
import getModel from './getModel';
import readAttachment from './readAttachment';
import writeS3File from './writeS3File';
import bcCalcHash from './bcCalcHash';
import bcSerializePayload from './bcSerializePayload';
import qrRender from './qrRender';
import createBlockchainRecord from './createBlockchainRecord';
import getBlockchainRecordUrl from './getBlockchainRecordUrl';
import getAppName from './getAppName';
import finReportRender from './finReportRender';
import connectDB from './connectDB';

const primitives: PrimitiveFunctions = {
  bcSerializePayload,
  bcCalcHash: bcCalcHash,
  createBlockchainRecord,
  finReportRender,
  getAppName,
  getBlockchainRecordUrl,
  getModel,
  getSchema,
  qrRender,
  readAttachment,
  writeS3File,
  connectDB,
};

export default primitives;
