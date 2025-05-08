import ClientSchemaRegistry from './SchemaRegistry';
// import { ListSchema, UISchema } from '@wl-apps/schema-to-ui';
import { SchemaType, Schema } from '@wl-apps/schema-to-ui';

export const setupSchemaRegistry = () => {
  const registry = ClientSchemaRegistry.getInstance();

  // Register schemas with proper type
  // const registerFormSchema = (name: string, schema: UISchema) => {
  //   registry.registerSchema(`${name}form`, schema as Schema, 'form');
  // };
  // const registerListSchema = <T>(name: string, schema: ListSchema<T>) => {
  //   registry.registerSchema(`${name}list`, schema as Schema, 'list');
  // };

  // Register all schemas
  

  return registry;
};

export const registry = setupSchemaRegistry();

export type GetSchemaFunction = <T extends Schema>(type: SchemaType) => T;

// class SchemaService {
//   private registry = registry;

//   getSchema<T extends Schema>(modelName: string, type: SchemaType): T {
//     const result = this.registry.getSchema<T>(`${modelName}${type}`);
//     if (!result?.schema) {
//       throw new Error(`Schema not found: ${modelName}${type}`);
//     }
//     return result.schema;
//   }
// }

// const schemaService = new SchemaService();
