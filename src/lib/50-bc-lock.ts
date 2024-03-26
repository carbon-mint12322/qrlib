import bcLockRecord from './bc-lock/bcLockRecord';
import bcManifestCreate from './bc-lock/bcManifestCreate';
import { pipe } from './util/pipe';

const blockchainLock = pipe(bcLockRecord, bcManifestCreate);

export default blockchainLock;
