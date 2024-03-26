import events from './data/events.json';
import farmers from './data/farmers.json';
import landParcels from './data/landparcels.json';
import crops from './data/crops.json';
import plans from './data/plans.json';
import pops from './data/pops.json';
import croppingSystems from './data/croppingsystems.json';
import fields from './data/fields.json';
import collectives from './data/collectives.json';
import users from './data/users.json';

import { modelNameFromSchemaId } from './modelNameFromSchemaId';

export default function getObjList(schemaId: string) {
  let objList = [];
  switch (modelNameFromSchemaId(schemaId)) {
    case 'event':
      objList = events;
      break;
    case 'farmer':
      objList = farmers;
      break;
    case 'landparcel':
      objList = landParcels;
      break;
    case 'field':
      objList = fields;
      break;
    case 'crop':
      objList = crops;
      break;
    case 'plan':
      objList = plans;
      break;
    case 'pop':
      objList = pops;
      break;
    case 'croppingsytem':
      objList = croppingSystems;
      break;
    case 'collective':
      objList = collectives;
      break;
    case 'user':
      objList = users;
      break;
    default:
      objList = [];

      break;
  }
  return objList.map((obj) => ({
    ...obj,
    _id: typeof obj._id === 'string' ? obj._id : obj._id.$oid,
  }));
}
