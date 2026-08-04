import { MY_ACCOUNT_DOMAINS } from '../../server-paths';
import { MtLinkSdk } from '../..';
import onboard from '../onboard/onboard';
import { generateConfigs } from '../../helper';
import * as helper from '../../helper';
import storage from '../../storage';
import expectUrlToMatchWithPKCE from '../../__tests__/helper/expect-url-to-match';

vi.mock('../../storage');

describe('api', () => {
  describe('onboard', () => {
    const open = (window.open = vi.fn());

    const mockedStorage = vi.mocked(storage);

    const clientId = 'clientId';
    const redirectUri = 'redirectUri';
    const email = 'email';

    test('without calling init', async () => {
      await expect(onboard(new MtLinkSdk().storedOptions)).rejects.toThrow(
        '[mt-link-sdk] Make sure to call `init` before calling `onboardUrl/onboard`.'
      );
    });

    test('redirectUri is required', async () => {
      const mtLinkSdk = new MtLinkSdk();
      mtLinkSdk.init(clientId);

      await expect(onboard(mtLinkSdk.storedOptions)).rejects.toThrow(
        '[mt-link-sdk] Missing option `redirectUri` in `onboardUrl/onboard`, make sure to pass one via `onboardUrl/onboard` options or `init` options.'
      );
    });

    test('method call without options use default init value', async () => {
      mockedStorage.set.mockClear();
      open.mockClear();

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

      await onboard(mtLinkSdk.storedOptions);

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
        configs: await generateConfigs({ email, mode: 'production' })
      };
      expectUrlToMatchWithPKCE(url, { baseUrl: MY_ACCOUNT_DOMAINS.production, path: '/onboard', query });
    });

    test('with options', async () => {
      mockedStorage.set.mockClear();
      open.mockClear();

      const state = 'state';
      const country = 'JP';
      const scopes = 'points_read';

      const mtLinkSdk = new MtLinkSdk();
      mtLinkSdk.init(clientId);

      await onboard(mtLinkSdk.storedOptions, {
        state,
        redirectUri,
        scopes,
        email
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
        configs: await generateConfigs({ email, mode: 'production' })
      };

      expectUrlToMatchWithPKCE(url, { baseUrl: MY_ACCOUNT_DOMAINS.production, path: '/onboard', query });
    });

    test('without window', async () => {
      vi.spyOn(helper, 'hasWindow').mockReturnValue(false);

      await expect(onboard(new MtLinkSdk().storedOptions)).rejects.toThrow(
        '[mt-link-sdk] `onboard` only works in the browser.'
      );
    });
  });
});
