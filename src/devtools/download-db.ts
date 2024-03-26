import R from 'ramda';
import { writeFile, mkdir } from 'fs/promises';
import mongoose from 'mongoose';

const main = R.pipeWith(R.andThen, [
  loadEnv,
  verifyEnv,
  mongooseConnect,
  listCollections,
  filterCollections,
  downloadCollections,
  exit,
]);

main().then(console.log).catch(console.error);

async function loadEnv() {
  require('dotenv').config();
}

async function verifyEnv() {
  const DATABASE_URL = process.env.DATABASE_URL;
  const TENANT_NAME = process.env.TENANT_NAME || 'reactml-dev';
  const APP_NAME = process.env.APP_NAME || 'farmbook';
  if (!(DATABASE_URL && APP_NAME && TENANT_NAME)) {
    return Promise.reject(
      new Error(
        'Set environment variables: DATABASE_URL, TENANT_NAME and APP_NAME'
      )
    );
  }
  return Promise.resolve(null);
}

async function mongooseConnect() {
  await mongoose.connect(process.env.DATABASE_URL);
  console.log('Connected to MongoDB');
}

async function listCollections() {
  return await (
    await mongoose.connection.db.listCollections().toArray()
  ).map((coll) => coll.name);
}

function filterCollections(collections: string[]) {
  console.log(process.env.TENANT_NAME, process.env.APP_NAME);
  return collections.filter(
    (name) =>
      /user/.test(name) ||
      name.startsWith(`/${process.env.TENANT_NAME}/${process.env.APP_NAME}`)
  );
}

async function downloadCollections(collections: string[]) {
  for (const collection of collections) {
    await downloadCollection(collection);
  }
}

async function downloadCollection(collection: string) {
  const objects = await mongoose.connection.db
    .collection(collection)
    .find()
    .toArray();
  const json = JSON.stringify(objects, null, 2);
  const filename = `./dump/${collection}.json`.replace('//', '/');
  const dirName = filename.split('/').slice(0, -1).join('/');
  await mkdir(dirName, { recursive: true });
  await writeFile(filename, json);
  console.log(`Wrote ${filename}`);
}

async function exit() {
  console.log('DONE');
  process.exit(0);
}
