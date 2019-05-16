import fetch from 'node-fetch';

import { DOMAIN, VAULT, MY_ACCOUNT } from '../endpoints';

describe('endpoints', () => {
  test('Valid Vault production domain', async () => {
    try {
      const response = await fetch(`https://${VAULT.SUBDOMAIN}.${DOMAIN}`);
      expect(response.status).not.toBe(404);
    } catch (error) {
      expect(error).toBeFalsy();
    }
  });

  test('Valid Vault staging domain', async () => {
    try {
      const response = await fetch(`https://${VAULT.TEST_SUBDOMAIN}.${DOMAIN}`);
      expect(response.status).not.toBe(404);
    } catch (error) {
      expect(error).toBeFalsy();
    }
  });

  test('Valid My Account production domain', async () => {
    try {
      const response = await fetch(`https://${MY_ACCOUNT.SUBDOMAIN}.${DOMAIN}`);
      expect(response.status).not.toBe(404);
    } catch (error) {
      expect(error).toBeFalsy();
    }
  });

  test('Valid My Account staging domain', async () => {
    try {
      const response = await fetch(`https://${MY_ACCOUNT.TEST_SUBDOMAIN}.${DOMAIN}`);
      expect(response.status).not.toBe(404);
    } catch (error) {
      expect(error).toBeFalsy();
    }
  });
});
