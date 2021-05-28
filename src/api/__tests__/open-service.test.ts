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
      const url = `${MY_ACCOUNT_DOMAINS.production}/settings/?${query}`;

      expect(open).toBeCalledWith(url, '_self', 'noreferrer');
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

      expect(open).toBeCalledWith(url, '_self', 'noreferrer');
    });

    test('vault/services-list', () => {
      open.mockClear();

      openService(new MtLinkSdk().storedOptions, 'vault', {
        view: 'services-list',
        type: 'bank',
        group: 'grouping_testing',
        search: 'vault',
        showRememberMe: false
      });

      expect(open).toBeCalledTimes(1);

      const query = qs.stringify({
        configs: generateConfigs({
          showRememberMe: false
        }),
        group: 'grouping_testing',
        type: 'bank',
        search: 'vault'
      });
      const url = `${VAULT_DOMAINS.production}/services?${query}`;

      expect(open).toBeCalledWith(url, '_self', 'noreferrer');
    });

    test('vault/service-connection', () => {
      open.mockClear();

      openService(new MtLinkSdk().storedOptions, 'vault', {
        view: 'service-connection',
        entityKey: 'fauxbank_test_bank',
        showRememberMe: false
      });

      expect(open).toBeCalledTimes(1);

      const query = qs.stringify({
        configs: generateConfigs({
          showRememberMe: false
        })
      });
      const url = `${VAULT_DOMAINS.production}/service/fauxbank_test_bank?${query}`;

      expect(open).toBeCalledWith(url, '_self', 'noreferrer');
    });

    test('vault/connection-setting', () => {
      open.mockClear();

      openService(new MtLinkSdk().storedOptions, 'vault', {
        view: 'connection-setting',
        credentialId: '123',
        showRememberMe: false
      });

      expect(open).toBeCalledTimes(1);

      const query = qs.stringify({
        configs: generateConfigs({
          showRememberMe: false
        })
      });
      const url = `${VAULT_DOMAINS.production}/connection/123?${query}`;

      expect(open).toBeCalledWith(url, '_self', 'noreferrer');
    });

    test('vault/customer-support', () => {
      open.mockClear();

      openService(new MtLinkSdk().storedOptions, 'vault', {
        view: 'customer-support',
        showRememberMe: false
      });

      expect(open).toBeCalledTimes(1);

      const query = qs.stringify({
        configs: generateConfigs({
          showRememberMe: false
        })
      });
      const url = `${VAULT_DOMAINS.production}/customer-support?${query}`;

      expect(open).toBeCalledWith(url, '_self', 'noreferrer');
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

      expect(open).toBeCalledWith(url, '', 'noreferrer');
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
      const url = `${MY_ACCOUNT_DOMAINS.production}/settings/?${query}`;

      expect(open).toBeCalledWith(url, '_self', 'noreferrer');
    });

    test('invalid service id', () => {
      expect(() => {
        openService(new MtLinkSdk().storedOptions, 'invalid');
      }).toThrow('[mt-link-sdk] Invalid `serviceId` in `openService`, got: invalid');
    });

    test('without window', () => {
      const windowSpy = jest.spyOn(global, 'window', 'get');
      // @ts-ignore: mocking window object to undefined
      windowSpy.mockImplementation(() => undefined);

      expect(() => {
        openService(new MtLinkSdk().storedOptions, 'vault');
      }).toThrow();
    });
  });
});
