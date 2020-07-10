import qs from 'qs';

import { MY_ACCOUNT_DOMAINS, VAULT_DOMAINS, LINK_KIT_DOMAINS } from '../../server-paths';
import { MtLinkSdk } from '../..';
import openService from '../open-service';
import { generateConfigs } from '../../helper';

describe('api', () => {
  describe('open-service', () => {
    const open = (window.open = jest.fn());
    const clientId = 'clientId';

    test('myaccount-settings', () => {
      open.mockClear();

      openService(new MtLinkSdk().storedOptions, 'myaccount-settings');

      expect(open).toBeCalledTimes(1);

      const query = qs.stringify({
        configs: generateConfigs()
      });
      const url = `${MY_ACCOUNT_DOMAINS.production}/settings?${query}`;

      expect(open).toBeCalledWith(url, '_self');
    });

    test('vault', () => {
      open.mockClear();

      openService(new MtLinkSdk().storedOptions, 'vault', {
        showRememberMe: false
      });

      expect(open).toBeCalledTimes(1);

      const query = qs.stringify({
        configs: generateConfigs({
          showRememberMe: false
        })
      });
      const url = `${VAULT_DOMAINS.production}?${query}`;

      expect(open).toBeCalledWith(url, '_self');
    });

    test('link-kit', () => {
      open.mockClear();

      openService(new MtLinkSdk().storedOptions, 'link-kit', {
        isNewTab: true
      });

      expect(open).toBeCalledTimes(1);

      const query = qs.stringify({
        configs: generateConfigs()
      });
      const url = `${LINK_KIT_DOMAINS.production}?${query}`;

      expect(open).toBeCalledWith(url, '');
    });

    test('calling after init will includes client id', () => {
      open.mockClear();

      const cobrandClientId = 'cobrandClientId';
      const locale = 'locale';

      const mtLinkSdk = new MtLinkSdk();
      mtLinkSdk.init(clientId, {
        locale,
        cobrandClientId
      });

      openService(mtLinkSdk.storedOptions, 'myaccount-settings');

      expect(open).toBeCalledTimes(1);

      const query = qs.stringify({
        client_id: clientId,
        cobrand_client_id: cobrandClientId,
        locale,
        configs: generateConfigs()
      });
      const url = `${MY_ACCOUNT_DOMAINS.production}/settings?${query}`;

      expect(open).toBeCalledWith(url, '_self');
    });

    test('invalid service id', () => {
      expect(() => {
        openService(new MtLinkSdk().storedOptions, 'invalid');
      }).toThrow('[mt-link-sdk] Invalid `serviceId` in `openService`, got: invalid');
    });

    test('without window', () => {
      const windowSpy = jest.spyOn(global, 'window', 'get');
      // @ts-ignore
      windowSpy.mockImplementation(() => undefined);

      expect(() => {
        openService(new MtLinkSdk().storedOptions, 'vault');
      }).toThrow();
    });
  });
});
