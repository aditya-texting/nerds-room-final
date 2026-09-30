#!/usr/bin/env -S node
import type { Contract as Start } from '../../snapshots/8bbf478797f61f07ae0c4e8b227036576a52ddfe97d767429538817d7cda9469/contract';
import startContract from '../../snapshots/8bbf478797f61f07ae0c4e8b227036576a52ddfe97d767429538817d7cda9469/contract.json' with { type: 'json' };
import type { Contract as End } from '../../snapshots/db67ec1d4869e4297932fb0b41809955263475e811abae226bf887158c212b7a/contract';
import endContract from '../../snapshots/db67ec1d4869e4297932fb0b41809955263475e811abae226bf887158c212b7a/contract.json' with { type: 'json' };
import { Migration, MigrationCLI, col, lit, placeholder } from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.createNativeEnumType({
        schema: 'public',
        typeName: 'EventLocationType',
        members: ['ONLINE', 'OFFLINE', 'HYBRID'],
      }),
      this.addNativeEnumValue({ schema: 'public', typeName: 'Role', value: 'ADMIN' }),
      this.addColumn({
        schema: 'public',
        table: 'Event',
        column: col('imageUrl', 'text', { codecRef: { codecId: 'pg/text@1' } }),
      }),
      this.addColumn({
        schema: 'public',
        table: 'Event',
        column: col('locationType', '"EventLocationType"', {
          notNull: true,
          default: lit('OFFLINE'),
          codecRef: { codecId: 'pg/enum@1', typeParams: { typeName: 'EventLocationType' } },
        }),
      }),
      this.addColumn({
        schema: 'public',
        table: 'Event',
        column: col('lumaUrl', 'text', { codecRef: { codecId: 'pg/text@1' } }),
      }),
      this.addColumn({
        schema: 'public',
        table: 'Event',
        column: col('slug', 'text', { codecRef: { codecId: 'pg/text@1' } }),
      }),
      this.setNotNull({ schema: 'public', table: 'Event', column: 'slug' }),
      this.setDefault({
        schema: 'public',
        table: 'User',
        column: 'role',
        defaultSql: "DEFAULT 'OTHER'",
        operationClass: 'widening',
      }),
      this.createIndex({
        schema: 'public',
        table: 'Event',
        index: 'Event_slug_key',
        columns: ['slug'],
        extras: { unique: true },
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
