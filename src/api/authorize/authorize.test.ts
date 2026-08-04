import { MY_ACCOUNT_DOMAINS } from '../../server-paths';
import { AuthorizeOptions, MtLinkSdk } from '../..';
import authorize from './authorize';
import { generateConfigs } from '../../helper';
import * as helper from '../../helper';
import storage from '../../storage';
import expectUrlToMatchWithPKCE from '../../__tests__/helper/expect-url-to-match';

vi.mock('../../storage');

describe('api', () => {
  describe('authorize', () => {
    const open = (window.open = vi.fn());

    const mockedStorage = vi.mocked(storage);

    const clientId = 'clientId';
    const redirectUri = 'redirectUri';

    test('without calling init', async () => {
      await expect(authorize(new MtLinkSdk().storedOptions)).rejects.toThrow(
        '[mt-link-sdk] Make sure to call `init` before calling `authorizeUrl/authorize`.'
      );
    });

    test('redirectUri is required', async () => {
      const mtLinkSdk = new MtLinkSdk();
      mtLinkSdk.init(clientId);

      await expect(authorize(mtLinkSdk.storedOptions)).rejects.toThrow(
        '[mt-link-sdk] Missing option `redirectUri` in `authorizeUrl/authorize`, make sure to pass one via `authorizeUrl/authorize` options or `init` options.'
      );
    });

    test('method call without options use default init value', async () => {
      mockedStorage.set.mockClear();
      open.mockClear();

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

      await authorize(mtLinkSdk.storedOptions);

      expect(open).toHaveBeenCalledTimes(1);
      expect(open).toHaveBeenCalledWith(expect.any(String), '_self', 'noreferrer');
      const url = open.mock.calls[0][0];
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
      open.mockClear();

      const state = 'state';
      const country = 'JP';
      const scopes = 'points_read';
      const samlSubjectId = 'mySubject';

      const mtLinkSdk = new MtLinkSdk();
      mtLinkSdk.init(clientId, { samlSubjectId });

      await authorize(mtLinkSdk.storedOptions, {
        state,
        redirectUri,
        scopes
      });

      expect(open).toHaveBeenCalledTimes(1);
      expect(open).toHaveBeenCalledWith(expect.any(String), '_self', 'noreferrer');
      const url = open.mock.calls[0][0];
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
      open.mockClear();

      const state = 'state';
      const scopes = 'points_read';
      const samlSubjectId = 'mySubject';
      const affiliateCode = 'mtb_hoge';

      const mtLinkSdk = new MtLinkSdk();
      mtLinkSdk.init(clientId, { samlSubjectId });

      await authorize(mtLinkSdk.storedOptions, {
        state,
        redirectUri,
        scopes,
        affiliateCode
      });

      expect(open).toHaveBeenCalledTimes(1);
      expect(open).toHaveBeenCalledWith(expect.any(String), '_self', 'noreferrer');
      const url = open.mock.calls[0][0];

      const parsed = new URL(url);
      expect(parsed.searchParams.has('affiliate_code')).toBe(true);
    });

    test('does not include affiliate_code when affiliateCode is undefined', async () => {
      mockedStorage.set.mockClear();
      open.mockClear();

      const state = 'state';
      const scopes = 'points_read';
      const samlSubjectId = 'mySubject';
      const affiliateCode = undefined;

      const mtLinkSdk = new MtLinkSdk();
      mtLinkSdk.init(clientId, { samlSubjectId });

      await authorize(mtLinkSdk.storedOptions, {
        state,
        redirectUri,
        scopes,
        affiliateCode
      });

      expect(open).toHaveBeenCalledTimes(1);
      expect(open).toHaveBeenCalledWith(expect.any(String), '_self', 'noreferrer');
      const url = open.mock.calls[0][0];

      const parsed = new URL(url);
      expect(parsed.searchParams.has('affiliate_code')).toBe(false);
    });

    test('does not include affiliate_code when affiliateCode is null', async () => {
      mockedStorage.set.mockClear();
      open.mockClear();

      const state = 'state';
      const scopes = 'points_read';
      const samlSubjectId = 'mySubject';
      const affiliateCode = null;

      const mtLinkSdk = new MtLinkSdk();
      mtLinkSdk.init(clientId, { samlSubjectId });

      await authorize(mtLinkSdk.storedOptions, {
        state,
        redirectUri,
        scopes,
        affiliateCode
      } as unknown as AuthorizeOptions);

      expect(open).toHaveBeenCalledTimes(1);
      expect(open).toHaveBeenCalledWith(expect.any(String), '_self', 'noreferrer');
      const url = open.mock.calls[0][0];

      const parsed = new URL(url);
      expect(parsed.searchParams.has('affiliate_code')).toBe(false);
    });

    test('without window', async () => {
      vi.spyOn(helper, 'hasWindow').mockReturnValue(false);

      await expect(authorize(new MtLinkSdk().storedOptions)).rejects.toThrow(
        '[mt-link-sdk] `authorize` only works in the browser.'
      );
    });
  });
});
