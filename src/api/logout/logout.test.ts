import { MY_ACCOUNT_DOMAINS } from '../../helpers/serverPaths';
import { MtLinkSdk } from '../..';
import logout from './logout';
import { generateConfigs, objectToQueryString } from '../../helpers';
import * as helper from '../../helpers';

describe('api', () => {
  describe('logout', () => {
    test('without calling init', async () => {
      window.open = vi.fn();

      await logout(new MtLinkSdk().storedOptions);

      expect(window.open).toHaveBeenCalledTimes(1);

      const query = objectToQueryString({ configs: await generateConfigs() });
      const url = `${MY_ACCOUNT_DOMAINS.production}/guests/logout?${query}`;
      expect(window.open).toHaveBeenCalledWith(url, '_self', 'noreferrer');
    });

    test('after calling init', async () => {
      window.open = vi.fn();

      const clientId = 'clientId';
      const cobrandClientId = 'cobrandClientId';
      const locale = 'locale';

      const mtLinkSkd = new MtLinkSdk();
      mtLinkSkd.init(clientId, {
        locale,
        cobrandClientId
      });
      await logout(mtLinkSkd.storedOptions);

      expect(window.open).toHaveBeenCalledTimes(1);

      const query = objectToQueryString({
        client_id: clientId,
        cobrand_client_id: cobrandClientId,
        locale,
        configs: await generateConfigs()
      });
      const url = `${MY_ACCOUNT_DOMAINS.production}/guests/logout?${query}`;
      expect(window.open).toHaveBeenCalledWith(url, '_self', 'noreferrer');
    });

    test('with options', async () => {
      window.open = vi.fn();

      const backTo = 'backTo';

      await logout(new MtLinkSdk().storedOptions, { backTo });

      expect(window.open).toHaveBeenCalledTimes(1);

      const query = objectToQueryString({
        configs: await generateConfigs({ backTo, mode: 'production' })
      });
      const url = `${MY_ACCOUNT_DOMAINS.production}/guests/logout?${query}`;
      expect(window.open).toHaveBeenCalledWith(url, '_self', 'noreferrer');
    });

    test('without window', async () => {
      vi.spyOn(helper, 'hasWindow').mockReturnValue(false);

      await expect(logout(new MtLinkSdk().storedOptions)).rejects.toThrow();
    });
  });
});
