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

		test('myaccount', () => {
			openService(new MtLinkSdk().storedOptions, 'myaccount');

			expect(open).toBeCalledTimes(1);

			const query = qs.stringify({
				configs: generateConfigs()
			});
			const url = `${MY_ACCOUNT_DOMAINS.production}/?${query}`;

			expect(open).toBeCalledWith(url, '_self', 'noreferrer');
		});

		test('myaccount/change-language', () => {
			openService(new MtLinkSdk().storedOptions, 'myaccount', { view: 'settings/change-language' });

			expect(open).toBeCalledTimes(1);

			const query = qs.stringify({
				configs: generateConfigs()
			});
			const url = `${MY_ACCOUNT_DOMAINS.production}/settings/change-language?${query}`;

			expect(open).toBeCalledWith(url, '_self', 'noreferrer');
		});

		test('vault', () => {
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

		test('vault/connection-update', () => {
			openService(new MtLinkSdk().storedOptions, 'vault', {
				view: 'connection-update',
				credentialId: '123',
				showRememberMe: false
			});

			expect(open).toBeCalledTimes(1);

			const query = qs.stringify({
				configs: generateConfigs({
					showRememberMe: false
				})
			});
			const url = `${VAULT_DOMAINS.production}/connection/123/update?${query}`;

			expect(open).toBeCalledWith(url, '_self', 'noreferrer');
		});

		test('vault/connection-delete', () => {
			openService(new MtLinkSdk().storedOptions, 'vault', {
				view: 'connection-delete',
				credentialId: '123',
				showRememberMe: false
			});

			expect(open).toBeCalledTimes(1);

			const query = qs.stringify({
				configs: generateConfigs({
					showRememberMe: false
				})
			});
			const url = `${VAULT_DOMAINS.production}/connection/123/delete?${query}`;

			expect(open).toBeCalledWith(url, '_self', 'noreferrer');
		});

		test('vault/customer-support', () => {
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
			const cobrandClientId = 'cobrandClientId';
			const locale = 'locale';

			const mtLinkSdk = new MtLinkSdk();
			mtLinkSdk.init(clientId, {
				locale,
				cobrandClientId
			});

			openService(mtLinkSdk.storedOptions, 'myaccount');

			expect(open).toBeCalledTimes(1);

			const query = qs.stringify({
				client_id: clientId,
				cobrand_client_id: cobrandClientId,
				locale,
				configs: generateConfigs()
			});
			const url = `${MY_ACCOUNT_DOMAINS.production}/?${query}`;

			expect(open).toBeCalledWith(url, '_self', 'noreferrer');
		});

		test('invalid service id', () => {
			expect(() => {
				// force cast invalid value so that we can use it for testing
				openService(new MtLinkSdk().storedOptions, 'invalid' as 'myaccount');
			}).toThrow('[mt-link-sdk] Invalid `serviceId` in `openService`, got: invalid');
		});

		test('saml_subject_id is passed when initialized', () => {
			const instance = new MtLinkSdk();
			instance.init('clientId', { samlSubjectId: 'samlSubjectId' });

			openService(instance.storedOptions, 'myaccount');

			expect(open).toBeCalledTimes(1);

			const query = qs.stringify({
				client_id: 'clientId',
				saml_subject_id: 'samlSubjectId',
				configs: generateConfigs()
			});
			const url = `${MY_ACCOUNT_DOMAINS.production}/?${query}`;

			expect(open).toBeCalledWith(url, '_self', 'noreferrer');
		});

		test('undefined saml_subject_id should not be passed down', () => {
			const instance = new MtLinkSdk();
			instance.init('clientId', { samlSubjectId: undefined });

			openService(instance.storedOptions, 'myaccount');

			expect(open).toBeCalledTimes(1);

			const query = qs.stringify({
				client_id: 'clientId',
				configs: generateConfigs()
			});
			const url = `${MY_ACCOUNT_DOMAINS.production}/?${query}`;

			expect(open).toBeCalledWith(url, '_self', 'noreferrer');
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
