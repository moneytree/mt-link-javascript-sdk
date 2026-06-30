import { mocked } from 'ts-jest/utils';

import { MY_ACCOUNT_DOMAINS } from '../../server-paths';
import { MtLinkSdk } from '../..';
import authorizeUrl from '../authorize-url';
import { generateConfigs } from '../../helper';
import storage from '../../storage';
import expectUrlToMatchWithPKCE from '../../__tests__/helper/expect-url-to-match';

jest.mock('../../storage');

describe('api', () => {
  describe('authorize-url', () => {
    const mockedStorage = mocked(storage);

    const clientId = 'clientId';
    const redirectUri = 'redirectUri';

    test('without calling init', async () => {
      await expect(authorizeUrl(new MtLinkSdk().storedOptions)).rejects.toThrow(
        '[mt-link-sdk] Make sure to call `init` before calling `authorizeUrl/authorize`.'
      );
    });

    test('redirectUri is required', async () => {
      const mtLinkSdk = new MtLinkSdk();
      mtLinkSdk.init(clientId);

      await expect(authorizeUrl(mtLinkSdk.storedOptions)).rejects.toThrow(
        '[mt-link-sdk] Missing option `redirectUri` in `authorizeUrl/authorize`, make sure to pass one via `authorizeUrl/authorize` options or `init` options.'
      );
    });

    test('method call without options use default init value', async () => {
      mockedStorage.set.mockClear();

      const country = 'JP';
      const scopes = 'points_read';
      const cobrandClientId = 'cobrandClientId';
      const locale = 'locale';
      const samlSubjectId = 'mySubject';

      const mtLinkSdk = new MtLinkSdk();
      mtLinkSdk.init(clientId, {
        redirectUri,
        scopes,
        locale,
        cobrandClientId,
        samlSubjectId
      });

      const url = await authorizeUrl(mtLinkSdk.storedOptions);

      const query = {
        client_id: clientId,
        cobrand_client_id: cobrandClientId,
        response_type: 'code',
        scope: scopes,
        redirect_uri: redirectUri,
        country,
        locale,
        saml_subject_id: samlSubjectId,
        configs: await generateConfigs()
      };
      expectUrlToMatchWithPKCE(url, { baseUrl: MY_ACCOUNT_DOMAINS.production, path: '/oauth/authorize', query });
    });

    test('with options', async () => {
      mockedStorage.set.mockClear();

      const state = 'state';
      const country = 'JP';
      const scopes = 'points_read';
      const samlSubjectId = 'mySubject';

      const mtLinkSdk = new MtLinkSdk();
      mtLinkSdk.init(clientId, { samlSubjectId });

      const url = await authorizeUrl(mtLinkSdk.storedOptions, {
        state,
        redirectUri,
        scopes
      });

      const query = {
        client_id: clientId,
        response_type: 'code',
        scope: scopes,
        redirect_uri: redirectUri,
        state,
        country,
        saml_subject_id: samlSubjectId,
        configs: await generateConfigs()
      };
      expectUrlToMatchWithPKCE(url, { baseUrl: MY_ACCOUNT_DOMAINS.production, path: '/oauth/authorize', query });
    });

    test('includes affiliate_code when provided', async () => {
      mockedStorage.set.mockClear();

      const state = 'state';
      const scopes = 'points_read';
      const affiliateCode = 'mtb_hoge';

      const mtLinkSdk = new MtLinkSdk();
      mtLinkSdk.init(clientId, { redirectUri });

      const url = await authorizeUrl(mtLinkSdk.storedOptions, {
        state,
        redirectUri,
        scopes,
        affiliateCode
      });

      const urlObj = new URL(url);
      expect(urlObj.searchParams.get('affiliate_code')).toBe(affiliateCode);
    });

    test('does not include affiliate_code when affiliateCode is undefined', async () => {
      mockedStorage.set.mockClear();

      const state = 'state';
      const scopes = 'points_read';

      const mtLinkSdk = new MtLinkSdk();
      mtLinkSdk.init(clientId, { redirectUri });

      const url = await authorizeUrl(mtLinkSdk.storedOptions, {
        state,
        redirectUri,
        scopes,
        affiliateCode: undefined
      });

      const urlObj = new URL(url);
      expect(urlObj.searchParams.has('affiliate_code')).toBe(false);
    });

    test('does not include affiliate_code when affiliateCode is empty string', async () => {
      mockedStorage.set.mockClear();

      const state = 'state';
      const scopes = 'points_read';

      const mtLinkSdk = new MtLinkSdk();
      mtLinkSdk.init(clientId, { redirectUri });

      const url = await authorizeUrl(mtLinkSdk.storedOptions, {
        state,
        redirectUri,
        scopes,
        affiliateCode: null as any
      });

      const urlObj = new URL(url);
      expect(urlObj.searchParams.has('affiliate_code')).toBe(false);
    });
  });
});
