declare const __VERSION__: string;

import { fetchMock, mockResponseOnce, mockRejectOnce } from '../../test-utils/mockFetch';

import { MY_ACCOUNT_DOMAINS } from '../../server-paths';
import { MtLinkSdk } from '../..';
import { generateConfigs, objectToQueryString } from '../../helper';
import tokenInfo from './token-info';

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
        name: 'aud-name'
      },
      exp: 'exp',
      scopes: ['scopes']
    };

    const mtLinkSdk = new MtLinkSdk();
    mtLinkSdk.init(clientId, {
      redirectUri
    });

    test('token is required', async () => {
      await expect(tokenInfo(mtLinkSdk.storedOptions, '')).rejects.toThrow(
        '[mt-link-sdk] Missing parameter `token` in `tokenInfo`.'
      );
    });

    test('make request', async () => {
      mockResponseOnce(JSON.stringify(response));

      await tokenInfo(mtLinkSdk.storedOptions, token);
      const query = objectToQueryString({
        client_id: clientId,
        configs: await generateConfigs()
      });

      const url = `${MY_ACCOUNT_DOMAINS.production}/oauth/token/info.json?${query}`;

      expect(fetchMock).toHaveBeenCalledTimes(1);
      expect(fetchMock).toHaveBeenCalledWith(url, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'API-Version': '1604911588',
          'mt-sdk-platform': 'js',
          'mt-sdk-version': __VERSION__
        }
      });
    });

    test('failed to request', async () => {
      const error = 'failed';

      mockRejectOnce(error);

      await expect(tokenInfo(mtLinkSdk.storedOptions, token)).rejects.toThrow(
        `[mt-link-sdk] \`tokenInfo\` execution failed. ${error}`
      );
    });

    test('throw error on response with error', async () => {
      const error = 'failed';

      mockResponseOnce(JSON.stringify({ error: 'error', error_description: error }));

      await expect(tokenInfo(mtLinkSdk.storedOptions, token)).rejects.toThrow(error);
    });
  });
});
