declare const __VERSION__: string;

import fetch from 'jest-fetch-mock';

import { MY_ACCOUNT_DOMAINS } from '../../server-paths';
import { MtLinkSdk } from '../..';
import exchangeToken from '../exchange-token';
import * as helper from '../../helper';

describe('api', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('exchange-token', () => {
    const clientId = 'clientId';
    const code = 'code';
    const redirectUri = 'redirectUri';
    const token = {
      access_token: 'access_token',
      refresh_token: 'refresh_token',
      expires_in: 3600,
      token_type: 'bearer',
      scope: 'guest_read',
      created_at: Date.now(),
      resource_server: 'jp-api'
    };
    const state = 'state';

    const mtLinkSdk = new MtLinkSdk();
    mtLinkSdk.init(clientId, {
      redirectUri,
      state
    });

    test('without calling init', async () => {
      await expect(exchangeToken(new MtLinkSdk().storedOptions)).rejects.toThrow(
        '[mt-link-sdk] Make sure to call `init` before calling `exchangeToken`.'
      );
    });

    test('code is required', async () => {
      await expect(exchangeToken(mtLinkSdk.storedOptions)).rejects.toThrow(
        '[mt-link-sdk] Missing option `code` in `exchangeToken`, or failed to get `code` from query/hash value from the URL.'
      );
    });

    test('redirectUri is required', async () => {
      const instance = new MtLinkSdk();
      instance.init(clientId);

      await expect(
        exchangeToken(instance.storedOptions, {
          code,
          state
        })
      ).rejects.toThrow(
        '[mt-link-sdk] Missing option `redirectUri` in `exchangeToken`, make sure to pass one via `exchangeToken` options or `init` options.'
      );
    });

    test('make request', async () => {
      fetch.mockResponseOnce(JSON.stringify(token));

      await exchangeToken(mtLinkSdk.storedOptions, { code, codeVerifier: '' });

      const url = `${MY_ACCOUNT_DOMAINS.production}/oauth/token.json`;

      expect(fetch).toHaveBeenCalledTimes(1);
      expect(fetch).toHaveBeenCalledWith(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'mt-sdk-platform': 'js',
          'mt-sdk-version': __VERSION__
        },
        body: JSON.stringify({
          code,
          client_id: clientId,
          grant_type: 'authorization_code',
          redirect_uri: redirectUri
        })
      });
    });

    test('failed to request', async () => {
      const error = new Error('failed');

      fetch.mockRejectOnce(error);

      await expect(exchangeToken(mtLinkSdk.storedOptions, { code, state, redirectUri })).rejects.toThrow(
        `[mt-link-sdk] \`exchangeToken\` execution failed. ${error}`
      );
    });

    test('throw error on response with error', async () => {
      const error = 'failed';

      fetch.mockResponseOnce(JSON.stringify({ error: 'error', error_description: error }));

      await expect(exchangeToken(mtLinkSdk.storedOptions, { code, state })).rejects.toThrow(error);
    });

    test('auto extract code from url query if no code was passed', async () => {
      fetch.mockResponseOnce(JSON.stringify(token));

      const code = 'realCode';

      window.history.pushState({}, '', `?code=otherCode&code=${code}`);

      await exchangeToken(mtLinkSdk.storedOptions, { state });

      const result = fetch.mock.calls[0][1] || {};
      const data = JSON.parse(result.body as string);

      expect(data.code).toBe(code);
    });

    test('auto extract state from url query if no state was passed or set during init', async () => {
      fetch.mockResponseOnce(JSON.stringify(token));

      window.history.pushState({}, '', `?state=otherState&state=${state}`);

      const actual = await exchangeToken(mtLinkSdk.storedOptions, { code, redirectUri });

      expect(actual).toEqual(token);
    });

    test('non browser environment will not auto extract code from url', async () => {
      vi.spyOn(helper, 'hasWindow').mockReturnValue(false);

      await expect(exchangeToken(mtLinkSdk.storedOptions)).rejects.toThrow(
        '[mt-link-sdk] Missing option `code` in `exchangeToken`, or failed to get `code` from query/hash value from the URL.'
      );
    });
  });
});
