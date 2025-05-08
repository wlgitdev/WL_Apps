import { SchemaRegistry } from '@wl-apps/schema-to-ui';

export class ClientSchemaRegistry {
  private static instance: SchemaRegistry;

  public static getInstance(): SchemaRegistry {
    if (!ClientSchemaRegistry.instance) {
      const registry = SchemaRegistry.getInstance({
        validators: [], // Add any custom validators
        enableCaching: true
      });

      ClientSchemaRegistry.instance = registry;
    }

    return ClientSchemaRegistry.instance;
  }
}
export default ClientSchemaRegistry;
