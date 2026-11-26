import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const migration = readFileSync(
  resolve(process.cwd(), 'drizzle/migrations/0001_restrict_menu_item_writes_to_admins.sql'),
  'utf8',
);

describe('Menu item write permissions', () => {
  it('requires an administrator for existing rows being changed or deleted', () => {
    expect(migration).toMatch(/ALTER POLICY auth_write_items ON public\.menu_items\s+USING \(public\.has_role\(auth\.uid\(\), 'admin'::public\.app_role\)\)/);
  });

  it('requires an administrator for new or updated rows', () => {
    expect(migration).toMatch(/WITH CHECK \(public\.has_role\(auth\.uid\(\), 'admin'::public\.app_role\)\)/);
  });
});