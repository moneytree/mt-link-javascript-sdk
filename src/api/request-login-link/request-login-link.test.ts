declare const __VERSION__: string;

import { fetchMock, mockRejectOnce } from '../../test-utils/mockFetch';

import { MY_ACCOUNT_DOMAINS } from '../../helpers/serverPaths';
import { MtLinkSdk } from '../..';
import requestLoginLink from './request-login-link';
import { generateConfigs, objectToQueryString } from '../../helpers';

describe('api', () => {
  describe('request-login-link', () => {
    const clientId = 'clientId';
    const email = 'email';

    test('email is required', async () => {
      await expect(requestLoginLink(new MtLinkSdk().storedOptions)).rejects.toThrow(
        '[mt-link-sdk] Missing option `email` in `requestLoginLink`, make sure to pass one via `requestLoginLink` options or `init` options.'
      );
    });

    test('failed to request', async () => {
      const error = 'failed';
      mockRejectOnce(error);

      await expect(requestLoginLink(new MtLinkSdk().storedOptions, { email })).rejects.toThrow(
        `[mt-link-sdk] \`requestLoginLink\` execution failed. ${error}`
      );
    });

    test('default loginLinkTo to /settings', async () => {
      await requestLoginLink(new MtLinkSdk().storedOptions, { email });

      const query = objectToQueryString({
        configs: await generateConfigs()
      });

      const url = `${MY_ACCOUNT_DOMAINS.production}/magic-link.json?${query}`;

      expect(fetchMock).toHaveBeenCalledTimes(1);
      expect(fetchMock).toHaveBeenCalledWith(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'mt-sdk-platform': 'js',
          'mt-sdk-version': __VERSION__
        },
        body: JSON.stringify({
          email,
          magic_link_to: '/settings'
        })
      });
    });

    test('prefix loginLinkTo with "/" if provided value do not have one', async () => {
      await requestLoginLink(new MtLinkSdk().storedOptions, {
        email,
        loginLinkTo: 'settings/delete-account'
      });

      const query = objectToQueryString({
        configs: await generateConfigs()
      });

      const url = `${MY_ACCOUNT_DOMAINS.production}/magic-link.json?${query}`;

      expect(fetchMock).toHaveBeenCalledTimes(1);
      expect(fetchMock).toHaveBeenCalledWith(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'mt-sdk-platform': 'js',
          'mt-sdk-version': __VERSION__
        },
        body: JSON.stringify({
          email,
          magic_link_to: '/settings/delete-account'
        })
      });
    });

    test('throw error on status not within 200 ranges', async () => {
      const statusText = 'failed';
      fetchMock.mockResolvedValueOnce(new Response(null, { status: 400, statusText }));

      await expect(requestLoginLink(new MtLinkSdk().storedOptions, { email })).rejects.toThrow(statusText);
    });

    test('calling after init will includes client id', async () => {
      const cobrandClientId = 'cobrandClientId';
      const locale = 'locale';

      const mtLinkSdk = new MtLinkSdk();
      mtLinkSdk.init(clientId, {
        email,
        locale,
        cobrandClientId
      });

      await requestLoginLink(mtLinkSdk.storedOptions);

      const query = objectToQueryString({
        client_id: clientId,
        cobrand_client_id: cobrandClientId,
        locale,
        configs: await generateConfigs()
      });

      const url = `${MY_ACCOUNT_DOMAINS.production}/magic-link.json?${query}`;

      expect(fetchMock).toHaveBeenCalledTimes(1);
      expect(fetchMock).toHaveBeenCalledWith(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'mt-sdk-platform': 'js',
          'mt-sdk-version': __VERSION__
        },
        body: JSON.stringify({
          email,
          magic_link_to: '/settings'
        })
      });
    });
  });
});
