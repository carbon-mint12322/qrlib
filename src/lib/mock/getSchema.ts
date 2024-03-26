import mockFarmerSchema from './schemas/farmer.json';
import mockLandParcelSchema from './schemas/landparcel.json';
import mockCropSchema from './schemas/crop.json';
import mockEventSchema from './schemas/event.json';
import mockPlanSchema from './schemas/plan.json';
import mockPopSchema from './schemas/pop.json';
import mockCroppingSystemSchema from './schemas/croppingsystem.json';
import mockFieldSchema from './schemas/field.json';
import mockCollectiveSchema from './schemas/collective.json';
import { modelNameFromSchemaId } from './modelNameFromSchemaId';

const getSchema = (schemaId: string) => {
  let schema = {};
  switch (modelNameFromSchemaId(schemaId)) {
    case 'event':
      schema = mockEventSchema;
      break;
    case 'farmer':
      schema = mockFarmerSchema;
      break;
    case 'landparcel':
      schema = mockLandParcelSchema;
      break;
    case 'field':
      schema = mockFieldSchema;
      break;
    case 'crop':
      schema = mockCropSchema;
      break;
    case 'plan':
      schema = mockPlanSchema;
      break;
    case 'pop':
      schema = mockPopSchema;
      break;
    case 'croppingsystem':
      schema = mockCroppingSystemSchema;
      break;
    case 'collective':
      schema = mockCollectiveSchema;
      break;
    default:
      schema = {};
      break;
  }
  return Promise.resolve(schema);
};

export default getSchema;
