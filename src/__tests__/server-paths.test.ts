import { MY_ACCOUNT_DOMAINS, VAULT_DOMAINS, LINK_KIT_DOMAINS } from '../server-paths';

describe('server_paths', () => {
  test('MY_ACCOUNT_DOMAINS', () => {
    expect(Object.keys(MY_ACCOUNT_DOMAINS)).toMatchObject([
      'production',
      'staging',
      'develop',
      'local',
    ]);

    expect(MY_ACCOUNT_DOMAINS.production).toContain('myaccount');
    expect(MY_ACCOUNT_DOMAINS.staging).toContain('myaccount');
    expect(MY_ACCOUNT_DOMAINS.staging).toContain('staging');
    expect(MY_ACCOUNT_DOMAINS.develop).toContain('myaccount');
    expect(MY_ACCOUNT_DOMAINS.develop).toContain('develop');
    expect(MY_ACCOUNT_DOMAINS.local).toContain('localhost');
  });

  test('VAULT_DOMAINS', () => {
    expect(Object.keys(VAULT_DOMAINS)).toMatchObject(['production', 'staging', 'develop', 'local']);

    expect(VAULT_DOMAINS.production).toContain('vault');
    expect(VAULT_DOMAINS.staging).toContain('vault');
    expect(VAULT_DOMAINS.staging).toContain('staging');
    expect(VAULT_DOMAINS.develop).toContain('vault');
    expect(VAULT_DOMAINS.develop).toContain('develop');
    expect(VAULT_DOMAINS.local).toContain('localhost');
  });

  test('LINK_KIT_DOMAINS', () => {
    expect(Object.keys(LINK_KIT_DOMAINS)).toMatchObject([
      'production',
      'staging',
      'develop',
      'local',
    ]);

    expect(LINK_KIT_DOMAINS.production).toContain('linkkit');
    expect(LINK_KIT_DOMAINS.staging).toContain('linkkit');
    expect(LINK_KIT_DOMAINS.staging).toContain('staging');
    expect(LINK_KIT_DOMAINS.develop).toContain('linkkit');
    expect(LINK_KIT_DOMAINS.develop).toContain('develop');
    expect(LINK_KIT_DOMAINS.local).toContain('localhost');
  });
});
