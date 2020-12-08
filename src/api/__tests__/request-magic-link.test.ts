declare const __VERSION__: string;

import fetch from 'jest-fetch-mock';
import qs from 'qs';

import { MY_ACCOUNT_DOMAINS } from '../../server-paths';
import { MtLinkSdk } from '../..';
import requestMagicLink from '../request-magic-link';
import { generateConfigs } from '../../helper';

describe('api', () => {
  describe('request-magic-link', () => {
    const clientId = 'clientId';
    const email = 'email';

    test('email is required', async () => {
      await expect(requestMagicLink(new MtLinkSdk().storedOptions)).rejects.toThrow(
        '[mt-link-sdk] Missing option `email` in `requestMagicLink`, make sure to pass one via `requestMagicLink` options or `init` options.'
      );
    });

    test('failed to request', async () => {
      const error = 'failed';

      fetch.mockClear();
      fetch.mockRejectedValueOnce(error);

      await expect(requestMagicLink(new MtLinkSdk().storedOptions, { email })).rejects.toThrow(
        `[mt-link-sdk] \`requestMagicLink\` execution failed. ${error}`
      );
    });

    test('default magicLinkTo to /settings', async () => {
      fetch.mockClear();

      await requestMagicLink(new MtLinkSdk().storedOptions, { email });

      const query = qs.stringify({
        configs: generateConfigs(),
      });

      const url = `${MY_ACCOUNT_DOMAINS.production}/magic-link.json?${query}`;

      expect(fetch).toBeCalledTimes(1);
      expect(fetch).toBeCalledWith(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'mt-sdk-platform': 'js',
          'mt-sdk-version': __VERSION__,
        },
        body: JSON.stringify({
          email,
          magic_link_to: '/settings',
        }),
      });
    });

    test('prefix magicLinkTo with "/" if provided value do not have one', async () => {
      fetch.mockClear();

      await requestMagicLink(new MtLinkSdk().storedOptions, {
        email,
        magicLinkTo: 'settings/delete-account',
      });

      const query = qs.stringify({
        configs: generateConfigs(),
      });

      const url = `${MY_ACCOUNT_DOMAINS.production}/magic-link.json?${query}`;

      expect(fetch).toBeCalledTimes(1);
      expect(fetch).toBeCalledWith(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'mt-sdk-platform': 'js',
          'mt-sdk-version': __VERSION__,
        },
        body: JSON.stringify({
          email,
          magic_link_to: '/settings/delete-account',
        }),
      });
    });

    test('throw error on status not within 200 ranges', async () => {
      const statusText = 'failed';

      fetch.mockClear();
      fetch.mockResolvedValueOnce({ status: 400, statusText } as Response);

      await expect(requestMagicLink(new MtLinkSdk().storedOptions, { email })).rejects.toThrow(
        statusText
      );
    });

    test('calling after init will includes client id', async () => {
      fetch.mockClear();

      const cobrandClientId = 'cobrandClientId';
      const locale = 'locale';

      const mtLinkSdk = new MtLinkSdk();
      mtLinkSdk.init(clientId, {
        email,
        locale,
        cobrandClientId,
      });

      await requestMagicLink(mtLinkSdk.storedOptions);

      const query = qs.stringify({
        client_id: clientId,
        cobrand_client_id: cobrandClientId,
        locale,
        configs: generateConfigs(),
      });

      const url = `${MY_ACCOUNT_DOMAINS.production}/magic-link.json?${query}`;

      expect(fetch).toBeCalledTimes(1);
      expect(fetch).toBeCalledWith(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'mt-sdk-platform': 'js',
          'mt-sdk-version': __VERSION__,
        },
        body: JSON.stringify({
          email,
          magic_link_to: '/settings',
        }),
      });
    });
  });
});
