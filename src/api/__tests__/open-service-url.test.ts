import { MY_ACCOUNT_DOMAINS, VAULT_DOMAINS, LINK_KIT_DOMAINS } from '../../server-paths';
import { MtLinkSdk } from '../..';
import openServiceUrl from '../open-service-url';
import { generateConfigs, objectToQueryString } from '../../helper';

describe('api', () => {
  describe('open-service-url', () => {
    const clientId = 'clientId';

    test('myaccount', async () => {
      const url = await openServiceUrl(new MtLinkSdk().storedOptions, 'myaccount');

      const query = objectToQueryString({
        configs: await generateConfigs()
      });

      expect(url).toBe(`${MY_ACCOUNT_DOMAINS.production}/?${query}`);
    });

    test('myaccount/change-language', async () => {
      const url = await openServiceUrl(new MtLinkSdk().storedOptions, 'myaccount', {
        view: 'settings/change-language'
      });

      const query = objectToQueryString({
        configs: await generateConfigs()
      });

      expect(url).toBe(`${MY_ACCOUNT_DOMAINS.production}/settings/change-language?${query}`);
    });

    test('vault', async () => {
      const url = await openServiceUrl(new MtLinkSdk().storedOptions, 'vault', {
        showRememberMe: false
      });

      const query = objectToQueryString({
        configs: await generateConfigs({ showRememberMe: false, mode: 'production' })
      });

      expect(url).toBe(`${VAULT_DOMAINS.production}?${query}`);
    });

    test('vault/services-list', async () => {
      const url = await openServiceUrl(new MtLinkSdk().storedOptions, 'vault', {
        view: 'services-list',
        type: 'bank',
        group: 'grouping_testing',
        search: 'vault',
        showRememberMe: false
      });

      const query = objectToQueryString({
        configs: await generateConfigs({ showRememberMe: false, mode: 'production' }),
        group: 'grouping_testing',
        type: 'bank',
        search: 'vault'
      });

      expect(url).toBe(`${VAULT_DOMAINS.production}/services?${query}`);
    });

    test('vault/service-connection', async () => {
      const url = await openServiceUrl(new MtLinkSdk().storedOptions, 'vault', {
        view: 'service-connection',
        entityKey: 'fauxbank_test_bank',
        showRememberMe: false
      });

      const query = objectToQueryString({
        configs: await generateConfigs({ showRememberMe: false, mode: 'production' })
      });

      expect(url).toBe(`${VAULT_DOMAINS.production}/service/fauxbank_test_bank?${query}`);
    });

    test('vault/connection-setting', async () => {
      const url = await openServiceUrl(new MtLinkSdk().storedOptions, 'vault', {
        view: 'connection-setting',
        credentialId: '123',
        showRememberMe: false
      });

      const query = objectToQueryString({
        configs: await generateConfigs({ showRememberMe: false, mode: 'production' })
      });

      expect(url).toBe(`${VAULT_DOMAINS.production}/connection/123?${query}`);
    });

    test('vault/connection-update', async () => {
      const url = await openServiceUrl(new MtLinkSdk().storedOptions, 'vault', {
        view: 'connection-update',
        credentialId: '123',
        showRememberMe: false
      });

      const query = objectToQueryString({
        configs: await generateConfigs({ showRememberMe: false, mode: 'production' })
      });

      expect(url).toBe(`${VAULT_DOMAINS.production}/connection/123/update?${query}`);
    });

    test('vault/connection-delete', async () => {
      const url = await openServiceUrl(new MtLinkSdk().storedOptions, 'vault', {
        view: 'connection-delete',
        credentialId: '123',
        showRememberMe: false
      });

      const query = objectToQueryString({
        configs: await generateConfigs({ showRememberMe: false, mode: 'production' })
      });

      expect(url).toBe(`${VAULT_DOMAINS.production}/connection/123/delete?${query}`);
    });

    test('vault/customer-support', async () => {
      const url = await openServiceUrl(new MtLinkSdk().storedOptions, 'vault', {
        view: 'customer-support',
        showRememberMe: false
      });

      const query = objectToQueryString({
        configs: await generateConfigs({ showRememberMe: false, mode: 'production' })
      });

      expect(url).toBe(`${VAULT_DOMAINS.production}/customer-support?${query}`);
    });

    test('vault/onboarding', async () => {
      const cobrandClientId = 'cobrandClientId';
      const sdk = new MtLinkSdk();
      const locale = 'ja';
      sdk.init(clientId, { locale, cobrandClientId });

      const url = await openServiceUrl(sdk.storedOptions, 'vault', { view: 'onboarding' });
      const configs = await generateConfigs();

      const query = objectToQueryString({
        client_id: clientId,
        cobrand_client_id: cobrandClientId,
        locale,
        configs
      });

      expect(url).toBe(`${VAULT_DOMAINS.production}/onboarding?${query}`);
    });

    test('link-kit', async () => {
      const url = await openServiceUrl(new MtLinkSdk().storedOptions, 'link-kit');

      const query = objectToQueryString({
        configs: await generateConfigs()
      });

      expect(url).toBe(`${LINK_KIT_DOMAINS.production}?${query}`);
    });

    test('calling after init will includes client id', async () => {
      const cobrandClientId = 'cobrandClientId';
      const locale = 'locale';

      const mtLinkSdk = new MtLinkSdk();
      mtLinkSdk.init(clientId, {
        locale,
        cobrandClientId
      });

      const url = await openServiceUrl(mtLinkSdk.storedOptions, 'myaccount');

      const query = objectToQueryString({
        client_id: clientId,
        cobrand_client_id: cobrandClientId,
        locale,
        configs: await generateConfigs()
      });

      expect(url).toBe(`${MY_ACCOUNT_DOMAINS.production}/?${query}`);
    });

    test('vault with showBackBarOn services-list', async () => {
      const url = await openServiceUrl(new MtLinkSdk().storedOptions, 'vault', {
        showBackBarOn: { view: 'services-list' }
      });

      const query = objectToQueryString({ state: 'url=/services', configs: await generateConfigs() });

      expect(url).toBe(`${VAULT_DOMAINS.production}?${query}`);
    });

    test('vault with showBackBarOn connection-setting', async () => {
      const url = await openServiceUrl(new MtLinkSdk().storedOptions, 'vault', {
        showBackBarOn: { view: 'connection-setting', credentialId: '123' }
      });

      const query = objectToQueryString({ state: 'url=/connection/123', configs: await generateConfigs() });

      expect(url).toBe(`${VAULT_DOMAINS.production}?${query}`);
    });

    test('invalid service id', async () => {
      await expect(openServiceUrl(new MtLinkSdk().storedOptions, 'invalid' as 'vault')).rejects.toThrow(
        '[mt-link-sdk] Invalid `serviceId` in `openServiceUrl`, got: invalid'
      );
    });

    test('saml_subject_id is passed when initialized', async () => {
      const instance = new MtLinkSdk();
      instance.init('clientId', { samlSubjectId: 'samlSubjectId' });

      const url = await openServiceUrl(instance.storedOptions, 'myaccount');

      const query = objectToQueryString({
        client_id: 'clientId',
        saml_subject_id: 'samlSubjectId',
        configs: await generateConfigs()
      });

      expect(url).toBe(`${MY_ACCOUNT_DOMAINS.production}/?${query}`);
    });

    test('undefined saml_subject_id should not be passed down', async () => {
      const instance = new MtLinkSdk();
      instance.init('clientId', { samlSubjectId: undefined });

      const url = await openServiceUrl(instance.storedOptions, 'myaccount');

      const query = objectToQueryString({
        client_id: 'clientId',
        configs: await generateConfigs()
      });

      expect(url).toBe(`${MY_ACCOUNT_DOMAINS.production}/?${query}`);
    });
  });
});
