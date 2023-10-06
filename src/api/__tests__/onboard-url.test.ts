import qs from 'qs';
import { mocked } from 'ts-jest/utils';

import { MY_ACCOUNT_DOMAINS } from '../../server-paths';
import { MtLinkSdk } from '../..';
import onboardUrl from '../onboard-url';
import { generateConfigs } from '../../helper';
import storage from '../../storage';
import expectUrlToMatchWithPKCE from '../../__tests__/helper/expect-url-to-match';

jest.mock('../../storage');

describe('api', () => {
  describe('onboard-url', () => {
    const mockedStorage = mocked(storage);

    const clientId = 'clientId';
    const redirectUri = 'redirectUri';
    const email = 'email';

    test('without calling init', () => {
      expect(() => {
        onboardUrl(new MtLinkSdk().storedOptions);
      }).toThrow('[mt-link-sdk] Make sure to call `init` before calling `onboardUrl/onboard`.');
    });

    test('redirectUri is required', () => {
      const mtLinkSdk = new MtLinkSdk();
      mtLinkSdk.init(clientId);

      expect(() => {
        onboardUrl(mtLinkSdk.storedOptions);
      }).toThrow(
        '[mt-link-sdk] Missing option `redirectUri` in `onboardUrl/onboard`, make sure to pass one via `onboardUrl/onboard` options or `init` options.'
      );
    });

    test('method call without options use default init value', () => {
      mockedStorage.set.mockClear();

      const country = 'JP';
      const scopes = 'points_read';
      const cobrandClientId = 'cobrandClientId';
      const locale = 'locale';

      const mtLinkSdk = new MtLinkSdk();
      mtLinkSdk.init(clientId, {
        redirectUri,
        scopes,
        email,
        locale,
        cobrandClientId
      });

      const url = onboardUrl(mtLinkSdk.storedOptions);

      const query = {
        client_id: clientId,
        cobrand_client_id: cobrandClientId,
        response_type: 'code',
        scope: scopes,
        redirect_uri: redirectUri,
        country,
        locale,
        configs: generateConfigs({ email })
      };

      expectUrlToMatchWithPKCE(url, {baseUrl: MY_ACCOUNT_DOMAINS.production, path: '/onboard', query: query })
    });

    test('with options', () => {
      mockedStorage.set.mockClear();

      const state = 'state';
      const country = 'JP';
      const scopes = 'points_read';

      const mtLinkSdk = new MtLinkSdk();
      mtLinkSdk.init(clientId);

      const url = onboardUrl(mtLinkSdk.storedOptions, {
          state,
          redirectUri,
          scopes,
          email
        }
      );

      const query = {
        client_id: clientId,
        response_type: 'code',
        scope: scopes,
        redirect_uri: redirectUri,
        state,
        country,
        configs: generateConfigs({ email })
      };

      expectUrlToMatchWithPKCE(url, {baseUrl: MY_ACCOUNT_DOMAINS.production, path: '/onboard', query})
    });
  });
});
