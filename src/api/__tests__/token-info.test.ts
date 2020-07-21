import fetch from 'jest-fetch-mock';
import qs from 'qs';

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
      scopes: 'scopes',
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

    test('redirectUri is required', async () => {
      const instance = new MtLinkSdk();

      await expect(tokenInfo(instance.storedOptions, token)).rejects.toThrow(
        '[mt-link-sdk] Missing option `redirectUri` in `tokenInfo`, make sure to pass one via `tokenInfo` options or `init` options.'
      );
    });

    test('make request', async () => {
      fetch.mockClear();
      fetch.mockResponseOnce(JSON.stringify(response));

      await tokenInfo(mtLinkSdk.storedOptions, token);

      const query = qs.stringify({
        client_id: clientId,
        redirect_uri: redirectUri,
        response_type: 'token',
      });

      const url = `${MY_ACCOUNT_DOMAINS.production}/oauth/token/info.json?${query}`;

      expect(fetch).toBeCalledTimes(1);
      expect(fetch).toBeCalledWith(url, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    });

    test('use option', async () => {
      fetch.mockClear();
      fetch.mockResponseOnce(JSON.stringify(response));

      const newRedirectUri = 'newRedirectUri';

      await tokenInfo(mtLinkSdk.storedOptions, token, { redirectUri: newRedirectUri });

      const query = qs.stringify({
        client_id: clientId,
        redirect_uri: newRedirectUri,
        response_type: 'token',
      });

      const url = `${MY_ACCOUNT_DOMAINS.production}/oauth/token/info.json?${query}`;

      expect(fetch.mock.calls[0][0]).toBe(url);
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
