import fetch from 'jest-fetch-mock';

import { MY_ACCOUNT_DOMAINS } from '../../server-paths';
import { MtLinkSdk } from '../..';
import tokenInfo from '../token-info';

describe('api', () => {
  describe('token-info', () => {
    const clientId = 'clientId';
    const redirectUri = 'redirectUri';
    const token = 'token';

    const response = {
      uid: 'uid',
      resource_server: 'resource_server',
      country: 'country',
      locale: 'locale',
      aud: {
        uid: 'aud-uid',
        name: 'aud-name',
      },
      exp: 'exp',
      scopes: ['scopes'],
    };

    const mtLinkSdk = new MtLinkSdk();
    mtLinkSdk.init(clientId, {
      redirectUri,
    });

    test('token is required', async () => {
      await expect(tokenInfo(mtLinkSdk.storedOptions, '')).rejects.toThrow(
        '[mt-link-sdk] Missing parameter `token` in `tokenInfo`.'
      );
    });

    test('make request', async () => {
      fetch.mockClear();
      fetch.mockResponseOnce(JSON.stringify(response));

      await tokenInfo(mtLinkSdk.storedOptions, token);

      const url = `${MY_ACCOUNT_DOMAINS.production}/oauth/token/info.json`;

      expect(fetch).toBeCalledTimes(1);
      expect(fetch).toBeCalledWith(url, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'x-api-key': clientId,
        },
      });
    });

    test('failed to request', async () => {
      const error = 'failed';

      fetch.mockClear();
      fetch.mockRejectedValueOnce(error);

      await expect(tokenInfo(mtLinkSdk.storedOptions, token)).rejects.toThrow(
        `[mt-link-sdk] \`tokenInfo\` execution failed. ${error}`
      );
    });

    test('throw error on response with error', async () => {
      const error = 'failed';

      fetch.mockClear();
      fetch.mockResponseOnce(JSON.stringify({ error: 'error', error_description: error }));

      await expect(tokenInfo(mtLinkSdk.storedOptions, token)).rejects.toThrow(error);
    });
  });
});
