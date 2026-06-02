import qs from 'qs';

import { MY_ACCOUNT_DOMAINS } from '../../server-paths';
import { MtLinkSdk } from '../..';
import logout from '../logout';
import { generateConfigs } from '../../helper';

describe('api', () => {
  describe('logout', () => {
    test('without calling init', async () => {
      window.open = jest.fn();

      await logout(new MtLinkSdk().storedOptions);

      expect(window.open).toBeCalledTimes(1);

      const query = qs.stringify({ configs: await generateConfigs() });
      const url = `${MY_ACCOUNT_DOMAINS.production}/guests/logout?${query}`;
      expect(window.open).toBeCalledWith(url, '_self', 'noreferrer');
    });

    test('after calling init', async () => {
      window.open = jest.fn();

      const clientId = 'clientId';
      const cobrandClientId = 'cobrandClientId';
      const locale = 'locale';

      const mtLinkSkd = new MtLinkSdk();
      mtLinkSkd.init(clientId, {
        locale,
        cobrandClientId
      });
      await logout(mtLinkSkd.storedOptions);

      expect(window.open).toBeCalledTimes(1);

      const query = qs.stringify({
        client_id: clientId,
        cobrand_client_id: cobrandClientId,
        locale,
        configs: await generateConfigs()
      });
      const url = `${MY_ACCOUNT_DOMAINS.production}/guests/logout?${query}`;
      expect(window.open).toBeCalledWith(url, '_self', 'noreferrer');
    });

    test('with options', async () => {
      window.open = jest.fn();

      const backTo = 'backTo';

      await logout(new MtLinkSdk().storedOptions, { backTo });

      expect(window.open).toBeCalledTimes(1);

      const query = qs.stringify({
        configs: await generateConfigs({ backTo, mode: 'production' })
      });
      const url = `${MY_ACCOUNT_DOMAINS.production}/guests/logout?${query}`;
      expect(window.open).toBeCalledWith(url, '_self', 'noreferrer');
    });

    test('without window', async () => {
      const windowSpy = jest.spyOn(global, 'window', 'get');
      // @ts-ignore: mocking window object to undefined
      windowSpy.mockImplementation(() => undefined);

      await expect(logout(new MtLinkSdk().storedOptions)).rejects.toThrow();
    });
  });
});
