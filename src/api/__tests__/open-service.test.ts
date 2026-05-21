import qs from 'qs';

import { MY_ACCOUNT_DOMAINS, VAULT_DOMAINS, LINK_KIT_DOMAINS } from '../../server-paths';
import { MtLinkSdk } from '../..';
import openService from '../open-service';
import { generateConfigs } from '../../helper';

describe('api', () => {
  describe('open-service', () => {
    const open = (window.open = jest.fn());
    const clientId = 'clientId';

    beforeEach(() => {
      open.mockClear();
    });

    test('myaccount', async () => {
      open.mockClear();

      await openService(new MtLinkSdk().storedOptions, 'myaccount');

      expect(open).toBeCalledTimes(1);

      const query = qs.stringify({
        configs: await generateConfigs()
      });
      const url = `${MY_ACCOUNT_DOMAINS.production}/?${query}`;

      expect(open).toBeCalledWith(url, '_self', 'noreferrer');
    });

    test('myaccount/change-language', async () => {
      open.mockClear();

      await openService(new MtLinkSdk().storedOptions, 'myaccount', { view: 'settings/change-language' });

      expect(open).toBeCalledTimes(1);

      const query = qs.stringify({
        configs: await generateConfigs()
      });
      const url = `${MY_ACCOUNT_DOMAINS.production}/settings/change-language?${query}`;

      expect(open).toBeCalledWith(url, '_self', 'noreferrer');
    });

    test('vault', async () => {
      open.mockClear();

      await openService(new MtLinkSdk().storedOptions, 'vault', {
        showRememberMe: false
      });

      expect(open).toBeCalledTimes(1);

      const query = qs.stringify({
        configs: await generateConfigs({ showRememberMe: false, mode: 'production' })
      });
      const url = `${VAULT_DOMAINS.production}?${query}`;

      expect(open).toBeCalledWith(url, '_self', 'noreferrer');
    });

    test('vault/services-list', async () => {
      open.mockClear();

      await openService(new MtLinkSdk().storedOptions, 'vault', {
        view: 'services-list',
        type: 'bank',
        group: 'grouping_testing',
        search: 'vault',
        showRememberMe: false
      });

      expect(open).toBeCalledTimes(1);

      const configs = await generateConfigs({
        showRememberMe: false,
        mode: 'production'
      });
      const query = qs.stringify({
        configs,
        group: 'grouping_testing',
        type: 'bank',
        search: 'vault'
      });
      const url = `${VAULT_DOMAINS.production}/services?${query}`;

      expect(open).toBeCalledWith(url, '_self', 'noreferrer');
    });

    test('vault/service-connection', async () => {
      open.mockClear();

      await openService(new MtLinkSdk().storedOptions, 'vault', {
        view: 'service-connection',
        entityKey: 'fauxbank_test_bank',
        showRememberMe: false
      });

      expect(open).toBeCalledTimes(1);

      const query = qs.stringify({
        configs: await generateConfigs({ showRememberMe: false, mode: 'production' })
      });
      const url = `${VAULT_DOMAINS.production}/service/fauxbank_test_bank?${query}`;

      expect(open).toBeCalledWith(url, '_self', 'noreferrer');
    });

    test('vault/connection-setting', async () => {
      open.mockClear();

      await openService(new MtLinkSdk().storedOptions, 'vault', {
        view: 'connection-setting',
        credentialId: '123',
        showRememberMe: false
      });

      expect(open).toBeCalledTimes(1);

      const query = qs.stringify({
        configs: await generateConfigs({ showRememberMe: false, mode: 'production' })
      });
      const url = `${VAULT_DOMAINS.production}/connection/123?${query}`;

      expect(open).toBeCalledWith(url, '_self', 'noreferrer');
    });

    test('vault/connection-update', async () => {
      open.mockClear();

      await openService(new MtLinkSdk().storedOptions, 'vault', {
        view: 'connection-update',
        credentialId: '123',
        showRememberMe: false
      });

      expect(open).toBeCalledTimes(1);

      const query = qs.stringify({
        configs: await generateConfigs({ showRememberMe: false, mode: 'production' })
      });
      const url = `${VAULT_DOMAINS.production}/connection/123/update?${query}`;

      expect(open).toBeCalledWith(url, '_self', 'noreferrer');
    });

    test('vault/connection-delete', async () => {
      open.mockClear();

      await openService(new MtLinkSdk().storedOptions, 'vault', {
        view: 'connection-delete',
        credentialId: '123',
        showRememberMe: false
      });

      expect(open).toBeCalledTimes(1);

      const query = qs.stringify({
        configs: await generateConfigs({ showRememberMe: false, mode: 'production' })
      });
      const url = `${VAULT_DOMAINS.production}/connection/123/delete?${query}`;

      expect(open).toBeCalledWith(url, '_self', 'noreferrer');
    });

    test('vault/customer-support', async () => {
      open.mockClear();

      await openService(new MtLinkSdk().storedOptions, 'vault', {
        view: 'customer-support',
        showRememberMe: false
      });

      expect(open).toBeCalledTimes(1);

      const query = qs.stringify({
        configs: await generateConfigs({ showRememberMe: false, mode: 'production' })
      });
      const url = `${VAULT_DOMAINS.production}/customer-support?${query}`;

      expect(open).toBeCalledWith(url, '_self', 'noreferrer');
    });

    test('vault/onboarding', async () => {
      const cobrandClientId = 'cobrandClientId';
      const sdk = new MtLinkSdk();
      const locale = 'ja';
      sdk.init(clientId, { locale, cobrandClientId });

      await openService(sdk.storedOptions, 'vault', { view: 'onboarding' });
      const configs = await generateConfigs();

      const query = qs.stringify({
        client_id: clientId,
        cobrand_client_id: cobrandClientId,
        locale,
        configs
      });
      const url = `${VAULT_DOMAINS.production}/onboarding?${query}`;

      expect(open).toBeCalledTimes(1);
      expect(open).toBeCalledWith(url, '_self', 'noreferrer');
    });

    test('link-kit', async () => {
      open.mockClear();

      await openService(new MtLinkSdk().storedOptions, 'link-kit', {
        isNewTab: true
      });

      expect(open).toBeCalledTimes(1);

      const query = qs.stringify({
        configs: await generateConfigs()
      });
      const url = `${LINK_KIT_DOMAINS.production}?${query}`;

      expect(open).toBeCalledWith(url, '', 'noreferrer');
    });

    test('calling after init will includes client id', async () => {
      open.mockClear();

      const cobrandClientId = 'cobrandClientId';
      const locale = 'locale';

      const mtLinkSdk = new MtLinkSdk();
      mtLinkSdk.init(clientId, {
        locale,
        cobrandClientId
      });

      await openService(mtLinkSdk.storedOptions, 'myaccount');

      expect(open).toBeCalledTimes(1);

      const query = qs.stringify({
        client_id: clientId,
        cobrand_client_id: cobrandClientId,
        locale,
        configs: await generateConfigs()
      });
      const url = `${MY_ACCOUNT_DOMAINS.production}/?${query}`;

      expect(open).toBeCalledWith(url, '_self', 'noreferrer');
    });

    test('invalid service id', async () => {
      await expect(openService(new MtLinkSdk().storedOptions, 'invalid' as 'myaccount')).rejects.toThrow(
        '[mt-link-sdk] Invalid `serviceId` in `openService`, got: invalid'
      );
    });

    test('saml_subject_id is passed when initialized', async () => {
      open.mockClear();

      const instance = new MtLinkSdk();
      instance.init('clientId', { samlSubjectId: 'samlSubjectId' });

      await openService(instance.storedOptions, 'myaccount');

      expect(open).toBeCalledTimes(1);

      const query = qs.stringify({
        client_id: 'clientId',
        saml_subject_id: 'samlSubjectId',
        configs: await generateConfigs()
      });
      const url = `${MY_ACCOUNT_DOMAINS.production}/?${query}`;

      expect(open).toBeCalledWith(url, '_self', 'noreferrer');
    });

    test('undefined saml_subject_id should not be passed down', async () => {
      open.mockClear();

      const instance = new MtLinkSdk();
      instance.init('clientId', { samlSubjectId: undefined });

      await openService(instance.storedOptions, 'myaccount');

      expect(open).toBeCalledTimes(1);

      const query = qs.stringify({
        client_id: 'clientId',
        configs: await generateConfigs()
      });
      const url = `${MY_ACCOUNT_DOMAINS.production}/?${query}`;

      expect(open).toBeCalledWith(url, '_self', 'noreferrer');
    });

    test('without window', async () => {
      const windowSpy = jest.spyOn(global, 'window', 'get');
      // @ts-ignore: mocking window object to undefined
      windowSpy.mockImplementation(() => undefined);

      await expect(openService(new MtLinkSdk().storedOptions, 'vault')).rejects.toThrow();
    });
  });
});
