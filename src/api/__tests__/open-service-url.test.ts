import qs from 'qs';

import { MY_ACCOUNT_DOMAINS, VAULT_DOMAINS, LINK_KIT_DOMAINS } from '../../server-paths';
import { MtLinkSdk } from '../..';
import openServiceUrl from '../open-service-url';
import { generateConfigs } from '../../helper';

describe('api', () => {
  describe('open-service-url', () => {
    const clientId = 'clientId';

    test('myaccount', () => {
      const url = openServiceUrl(new MtLinkSdk().storedOptions, 'myaccount');

      const query = qs.stringify({
        configs: generateConfigs()
      });

      expect(url).toBe(`${MY_ACCOUNT_DOMAINS.production}/?${query}`);
    });

    test('myaccount/change-language', () => {
      const url = openServiceUrl(new MtLinkSdk().storedOptions, 'myaccount', {
        view: 'settings/change-language'
      });

      const query = qs.stringify({
        configs: generateConfigs()
      });

      expect(url).toBe(`${MY_ACCOUNT_DOMAINS.production}/settings/change-language?${query}`);
    });

    test('vault', () => {
      const url = openServiceUrl(new MtLinkSdk().storedOptions, 'vault', {
        showRememberMe: false
      });

      const query = qs.stringify({
        configs: generateConfigs({
          showRememberMe: false
        })
      });

      expect(url).toBe(`${VAULT_DOMAINS.production}?${query}`);
    });

    test('vault/services-list', () => {
      const url = openServiceUrl(new MtLinkSdk().storedOptions, 'vault', {
        view: 'services-list',
        type: 'bank',
        group: 'grouping_testing',
        search: 'vault',
        showRememberMe: false
      });

      const query = qs.stringify({
        configs: generateConfigs({
          showRememberMe: false
        }),
        group: 'grouping_testing',
        type: 'bank',
        search: 'vault'
      });

      expect(url).toBe(`${VAULT_DOMAINS.production}/services?${query}`);
    });

    test('vault/service-connection', () => {
      const url = openServiceUrl(new MtLinkSdk().storedOptions, 'vault', {
        view: 'service-connection',
        entityKey: 'fauxbank_test_bank',
        showRememberMe: false
      });

      const query = qs.stringify({
        configs: generateConfigs({
          showRememberMe: false
        })
      });

      expect(url).toBe(`${VAULT_DOMAINS.production}/service/fauxbank_test_bank?${query}`);
    });

    test('vault/connection-setting', () => {
      const url = openServiceUrl(new MtLinkSdk().storedOptions, 'vault', {
        view: 'connection-setting',
        credentialId: '123',
        showRememberMe: false
      });

      const query = qs.stringify({
        configs: generateConfigs({
          showRememberMe: false
        })
      });

      expect(url).toBe(`${VAULT_DOMAINS.production}/connection/123?${query}`);
    });

    test('vault/customer-support', () => {
      const url = openServiceUrl(new MtLinkSdk().storedOptions, 'vault', {
        view: 'customer-support',
        showRememberMe: false
      });

      const query = qs.stringify({
        configs: generateConfigs({
          showRememberMe: false
        })
      });

      expect(url).toBe(`${VAULT_DOMAINS.production}/customer-support?${query}`);
    });

    test('link-kit', () => {
      const url = openServiceUrl(new MtLinkSdk().storedOptions, 'link-kit');

      const query = qs.stringify({
        configs: generateConfigs()
      });

      expect(url).toBe(`${LINK_KIT_DOMAINS.production}?${query}`);
    });

    test('calling after init will includes client id', () => {
      const cobrandClientId = 'cobrandClientId';
      const locale = 'locale';

      const mtLinkSdk = new MtLinkSdk();
      mtLinkSdk.init(clientId, {
        locale,
        cobrandClientId
      });

      const url = openServiceUrl(mtLinkSdk.storedOptions, 'myaccount');

      const query = qs.stringify({
        client_id: clientId,
        cobrand_client_id: cobrandClientId,
        locale,
        configs: generateConfigs()
      });

      expect(url).toBe(`${MY_ACCOUNT_DOMAINS.production}/?${query}`);
    });

    test('invalid service id', () => {
      expect(() => {
        // force cast invalid value so that we can use it for testing
        openServiceUrl(new MtLinkSdk().storedOptions, 'invalid' as 'vault');
      }).toThrow('[mt-link-sdk] Invalid `serviceId` in `openServiceUrl`, got: invalid');
    });

    test('saml_subject_id is passed when initialized', () => {
      const instance = new MtLinkSdk();
      instance.init('clientId', { samlSubjectId: 'samlSubjectId' });

      const url = openServiceUrl(instance.storedOptions, 'myaccount');

      const query = qs.stringify({
        client_id: 'clientId',
        saml_subject_id: 'samlSubjectId',
        configs: generateConfigs()
      });

      expect(url).toBe(`${MY_ACCOUNT_DOMAINS.production}/?${query}`);
    });

    test('undefined saml_subject_id should not be passed down', () => {
      const instance = new MtLinkSdk();
      instance.init('clientId', { samlSubjectId: undefined });

      const url = openServiceUrl(instance.storedOptions, 'myaccount');

      const query = qs.stringify({
        client_id: 'clientId',
        configs: generateConfigs()
      });

      expect(url).toBe(`${MY_ACCOUNT_DOMAINS.production}/?${query}`);
    });
  });
});
