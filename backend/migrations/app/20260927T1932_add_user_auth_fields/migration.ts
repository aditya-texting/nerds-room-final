#!/usr/bin/env -S node
import type { Contract as End } from '../../snapshots/58919d037ad2c71834ebcd1525dbce2a6b7b49ab9800768e477f27b3e87fb6b5/contract';
import endContract from '../../snapshots/58919d037ad2c71834ebcd1525dbce2a6b7b49ab9800768e477f27b3e87fb6b5/contract.json' with { type: 'json' };
import type { Contract as Start } from '../../snapshots/8ae5bc7d8cc5c4294dddd6b2c447cf6f9f3f52e0c9844dd27ce1d535b0c2cf24/contract';
import startContract from '../../snapshots/8ae5bc7d8cc5c4294dddd6b2c447cf6f9f3f52e0c9844dd27ce1d535b0c2cf24/contract.json' with { type: 'json' };
import { Migration, MigrationCLI, col } from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
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
      this.dropNotNull({ schema: 'public', table: 'User', column: 'password' }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
