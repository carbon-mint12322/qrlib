import { IBlockchainRecord } from '../types/primitives-types';

async function createBlockchainRecord(_obj: any): Promise<IBlockchainRecord> {
  return Promise.resolve({
    blockHash: 'foo',
    blockNumber: 1,
    transactionHash: 'bar',
    transactionIndex: 500,
  });
}

export default createBlockchainRecord;
