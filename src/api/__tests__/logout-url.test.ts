import qs from 'qs';

import { MY_ACCOUNT_DOMAINS } from '../../server-paths';
import { MtLinkSdk } from '../..';
import logoutUrl from '../logout-url';
import { generateConfigs } from '../../helper';

describe('api', () => {
  describe('logout-url', () => {
    test('without calling init', () => {
      const url = logoutUrl(new MtLinkSdk().storedOptions);

      const query = qs.stringify({
        configs: generateConfigs()
      });

      expect(url).toBe(`${MY_ACCOUNT_DOMAINS.production}/guests/logout?${query}`);
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
      const url = logoutUrl(mtLinkSkd.storedOptions);

      const query = qs.stringify({
        client_id: clientId,
        cobrand_client_id: cobrandClientId,
        locale,
        configs: generateConfigs()
      });

      expect(url).toBe(`${MY_ACCOUNT_DOMAINS.production}/guests/logout?${query}`);
    });

    test('with options', () => {
      window.open = jest.fn();

      const backTo = 'backTo';

      const url = logoutUrl(new MtLinkSdk().storedOptions, {
        backTo
      });

      const query = qs.stringify({
        configs: generateConfigs({
          backTo
        })
      });

      expect(url).toBe(`${MY_ACCOUNT_DOMAINS.production}/guests/logout?${query}`);
    });
  });
});
