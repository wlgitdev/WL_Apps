import {
  BankAccountNamingScheme,
  TransactionCategoryNamingScheme,
  TransactionNamingScheme
} from '@wl-apps/types';
import ClientSchemaRegistry from '../SchemaRegistry';
import {
  bankAccountUpdateUISchema,
  bankAccountListUISchema
} from '@/schemas/PF/entities/bankAccount/bankAccount.schema';
import {
  transactionCategoryUpdateUISchema,
  transactionCategoryListUISchema
} from '@/schemas/PF/entities/transactionCategory/transactionCategory.schema';
import {
  transactionUpdateUISchema,
  transactionListUISchema
} from '@/schemas/PF/entities/transaction/transaction.schema';
import { ListSchema, UISchema, SchemaType, Schema } from '@wl-apps/schema-to-ui';

export const setupSchemaRegistry = () => {
  const registry = ClientSchemaRegistry.getInstance();

  // Register schemas with proper type
  const registerFormSchema = (name: string, schema: UISchema) => {
    registry.registerSchema(`${name}form`, schema as Schema, 'form');
  };
  const registerListSchema = <T>(name: string, schema: ListSchema<T>) => {
    registry.registerSchema(`${name}list`, schema as Schema, 'list');
  };

  // Register all schemas
  registerFormSchema(
    TransactionCategoryNamingScheme.MODEL,
    transactionCategoryUpdateUISchema
  );
  registerListSchema(
    TransactionCategoryNamingScheme.MODEL,
    transactionCategoryListUISchema
  );
  registerFormSchema(TransactionNamingScheme.MODEL, transactionUpdateUISchema);
  registerListSchema(TransactionNamingScheme.MODEL, transactionListUISchema);
  registerFormSchema(BankAccountNamingScheme.MODEL, bankAccountUpdateUISchema);
  registerListSchema(BankAccountNamingScheme.MODEL, bankAccountListUISchema);

  return registry;
};

export const registry = setupSchemaRegistry();

export type GetSchemaFunction = <T extends Schema>(type: SchemaType) => T;

class SchemaService {
  private registry = registry;

  getSchema<T extends Schema>(modelName: string, type: SchemaType): T {
    const result = this.registry.getSchema<T>(`${modelName}${type}`);
    if (!result?.schema) {
      throw new Error(`Schema not found: ${modelName}${type}`);
    }
    return result.schema;
  }
}

const schemaService = new SchemaService();

export const getTransactionCategorySchema: GetSchemaFunction = type =>
  schemaService.getSchema(TransactionCategoryNamingScheme.MODEL, type);

export const getTransactionSchema: GetSchemaFunction = type =>
  schemaService.getSchema(TransactionNamingScheme.MODEL, type);

export const getBankAccountSchema: GetSchemaFunction = type =>
  schemaService.getSchema(BankAccountNamingScheme.MODEL, type);
