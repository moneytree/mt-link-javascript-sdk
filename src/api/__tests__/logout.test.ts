import qs from 'qs';

import { MY_ACCOUNT_DOMAINS } from '../../server-paths';
import { MtLinkSdk } from '../..';
import logout from '../logout';
import { generateConfigs } from '../../helper';

describe('api', () => {
  describe('logout', () => {
    test('without calling init', () => {
      window.open = jest.fn();

      logout(new MtLinkSdk().storedOptions);

      expect(window.open).toBeCalledTimes(1);

      const query = qs.stringify({
        configs: generateConfigs()
      });
      const url = `${MY_ACCOUNT_DOMAINS.production}/guests/logout?${query}`;
      expect(window.open).toBeCalledWith(url, '_self', 'noreferrer');
    });

    test('after calling init', () => {
      window.open = jest.fn();

      const clientId = 'clientId';
      const cobrandClientId = 'cobrandClientId';
      const locale = 'locale';

      const mtLinkSkd = new MtLinkSdk();
      mtLinkSkd.init(clientId, {
        locale,
        cobrandClientId
      });
      logout(mtLinkSkd.storedOptions);

      expect(window.open).toBeCalledTimes(1);

      const query = qs.stringify({
        client_id: clientId,
        cobrand_client_id: cobrandClientId,
        locale,
        configs: generateConfigs()
      });
      const url = `${MY_ACCOUNT_DOMAINS.production}/guests/logout?${query}`;
      expect(window.open).toBeCalledWith(url, '_self', 'noreferrer');
    });

    test('with options', () => {
      window.open = jest.fn();

      const backTo = 'backTo';

      logout(new MtLinkSdk().storedOptions, {
        backTo
      });

      expect(window.open).toBeCalledTimes(1);

      const query = qs.stringify({
        configs: generateConfigs({
          backTo
        })
      });
      const url = `${MY_ACCOUNT_DOMAINS.production}/guests/logout?${query}`;
      expect(window.open).toBeCalledWith(url, '_self', 'noreferrer');
    });

    test('without window', () => {
      const windowSpy = jest.spyOn(global, 'window', 'get');
      // @ts-ignore: mocking window object to undefined
      windowSpy.mockImplementation(() => undefined);

      expect(() => {
        logout(new MtLinkSdk().storedOptions);
      }).toThrow();
    });
  });
});
