import { IBlockchainRecord } from '../types/primitives-types';

function getBlockchainRecordUrl({
  blockHash,
  blockNumber,
  transactionHash,
  transactionIndex,
}: IBlockchainRecord) {
  return `https://fake.blockchain.link/${blockNumber}/${transactionIndex}/${blockHash}/${transactionHash}`;
}

export default getBlockchainRecordUrl;
