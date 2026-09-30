#!/usr/bin/env -S node
import type { Contract as Start } from '../../snapshots/8ae5bc7d8cc5c4294dddd6b2c447cf6f9f3f52e0c9844dd27ce1d535b0c2cf24/contract';
import startContract from '../../snapshots/8ae5bc7d8cc5c4294dddd6b2c447cf6f9f3f52e0c9844dd27ce1d535b0c2cf24/contract.json' with { type: 'json' };
import type { Contract as End } from '../../snapshots/8bbf478797f61f07ae0c4e8b227036576a52ddfe97d767429538817d7cda9469/contract';
import endContract from '../../snapshots/8bbf478797f61f07ae0c4e8b227036576a52ddfe97d767429538817d7cda9469/contract.json' with { type: 'json' };
import { Migration, MigrationCLI, col, placeholder } from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.addNativeEnumValue({ schema: 'public', typeName: 'Role', value: 'OTHER' }),
      this.addColumn({
        schema: 'public',
        table: 'User',
        column: col('googleId', 'text', { codecRef: { codecId: 'pg/text@1' } }),
      }),
      this.addColumn({
        schema: 'public',
        table: 'User',
        column: col('resetToken', 'text', { codecRef: { codecId: 'pg/text@1' } }),
      }),
      this.addColumn({
        schema: 'public',
        table: 'User',
        column: col('resetTokenExpiry', 'timestamp(3)', {
          codecRef: { codecId: 'pg/timestamp-temporal@1', typeParams: { precision: 3 } },
        }),
      }),
      this.addColumn({
        schema: 'public',
        table: 'Admin',
        column: col('name', 'text', { codecRef: { codecId: 'pg/text@1' } }),
      }),
      this.dataTransform(endContract, 'backfill-Admin-name', {
        check: () => placeholder('backfill-Admin-name:check'),
        run: () => placeholder('backfill-Admin-name:run'),
      }),
      this.setNotNull({ schema: 'public', table: 'Admin', column: 'name' }),
      this.dropNotNull({ schema: 'public', table: 'User', column: 'password' }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
