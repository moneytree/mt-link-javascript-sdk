import linkSDK, { IParams, IDomains, IOauthParams } from '..';
import { DOMAIN, VAULT, MY_ACCOUNT } from '../endpoints';
import * as packageJSON from '../../package.json';

const value = 'test';
const mockValue = {} as { params: IParams; domains: IDomains; oauthParams: IOauthParams };

describe('LinkSDK', () => {
  describe('init', () => {
    test('no clientId', async () => {
      expect(() => {
        linkSDK.init({ clientId: '' });
      }).toThrow('Need a clientId to initialize');
    });

    test('default', async () => {
      linkSDK.init.call(mockValue, {
        clientId: value
      });

      const { params, domains, oauthParams } = mockValue;

      expect(oauthParams.client_id).toBe(value);
      expect(oauthParams.redirect_uri).toBe(`${location.protocol}//${location.host}/callback`);
      expect(oauthParams.response_type).toBe('token');
      expect(oauthParams.scope).toBeUndefined();
      expect(oauthParams.state).toBeUndefined();

      expect(params.locale).toBeUndefined();

      expect(domains.myaccount).toBe(`${MY_ACCOUNT.SUBDOMAIN}.${DOMAIN}`);
      expect(domains.vault).toBe(`${VAULT.SUBDOMAIN}.${DOMAIN}`);
    });

    test('isTestEnviroment', async () => {
      linkSDK.init.call(mockValue, {
        clientId: value,
        isTestEnvironment: true
      });

      const { domains } = mockValue;

      expect(domains.myaccount).toBe(`${MY_ACCOUNT.TEST_SUBDOMAIN}.${DOMAIN}`);
      expect(domains.vault).toBe(`${VAULT.TEST_SUBDOMAIN}.${DOMAIN}`);
    });

    test('scope', async () => {
      const scope = [value, value];

      linkSDK.init.call(mockValue, {
        clientId: value,
        scope
      });

      expect(mockValue.oauthParams.scope).toBe(scope.join(' '));
    });

    test('redirectUri', async () => {
      linkSDK.init.call(mockValue, {
        clientId: value,
        redirectUri: value
      });

      expect(mockValue.oauthParams.redirect_uri).toBe(value);
    });

    test('continueTo', async () => {
      // continue
      linkSDK.init.call(mockValue, {
        clientId: value,
        continueTo: value
      });

      expect(mockValue.params.continue).toBe(value);
    });

    test('responseType', async () => {
      linkSDK.init.call(mockValue, {
        clientId: value,
        responseType: 'token'
      });

      expect(mockValue.oauthParams.response_type).toBe('token');
    });

    test('locale', async () => {
      linkSDK.init.call(mockValue, {
        clientId: value,
        locale: value
      });

      expect(mockValue.params.locale).toBe(value);
    });

    test('state', async () => {
      linkSDK.init.call(mockValue, {
        clientId: value,
        state: value
      });

      expect(mockValue.oauthParams.state).toBe(value);
    });
  });

  describe('authorize', () => {
    test('Calling "authorize" method before an init will fail', async () => {
      expect(() => {
        linkSDK.authorize();
      }).toThrow('SDK not initialized');
    });

    test('default params', async () => {
      const open = (window.open = jest.fn());

      linkSDK.init.call(mockValue, {
        clientId: value
      });
      // @ts-ignore Ignores missing arguments to test user passing no arguments
      linkSDK.authorize.call(mockValue);

      expect(open).toBeCalled();

      const [[url, isNewTab]] = open.mock.calls; // [0][1]

      const host = `https://${mockValue.domains.myaccount}/${MY_ACCOUNT.PATHS.OAUTH}`;
      expect(url).toContain(host);
      expect(isNewTab).toBe('_self');

      const { params, oauthParams } = mockValue;

      const configs = encodeURIComponent(`sdk_platform=js;sdk_version=${packageJSON.version}`);
      const qs =
        `client_id=${params.client_id}&redirect_uri=${encodeURIComponent(oauthParams.redirect_uri)}` +
        `&response_type=token&configs=${configs}`;
      expect(url).toBe(`${host}?${qs}`);
    });

    test('with params', async () => {
      const open = (window.open = jest.fn());
      const email = '"test@"@test.com';
      const authPage = 'signup';

      linkSDK.init.call(mockValue, {
        clientId: value,
        scope: [value]
      });
      linkSDK.authorize.call(mockValue, {
        email,
        authPage,
        newTab: true
      });

      expect(open).toBeCalled();

      const [[url, isNewTab]] = open.mock.calls; // [0][1]
      expect(isNewTab).toBe('_blank');

      const { params, domains, oauthParams } = mockValue;
      const host = `https://${domains.myaccount}/${MY_ACCOUNT.PATHS.OAUTH}`;
      const qs =
        `client_id=${params.client_id}&redirect_uri=${encodeURIComponent(oauthParams.redirect_uri)}` +
        `&response_type=token&scope=${value}`;
      const configs = encodeURIComponent(
        `sdk_platform=js;sdk_version=${packageJSON.version};email=${email};auth_action=${authPage}`
      );

      expect(url).toBe(`${host}?${qs}&configs=${configs}`);
    });
  });

  describe('openVault', () => {
    test('Calling "openVault" method before an init will fail', async () => {
      expect(() => {
        linkSDK.openVault();
      }).toThrow('SDK not initialized');
    });

    test('default params', async () => {
      const open = (window.open = jest.fn());

      linkSDK.init.call(mockValue, {
        clientId: value,
        scope: [value]
      });
      // @ts-ignore Ignores missing arguments to test user passing no arguments
      linkSDK.openVault.call(mockValue);

      expect(open).toBeCalled();

      const [[url, isNewTab]] = open.mock.calls; // [0][1]

      const host = `https://${mockValue.domains.vault}`;
      expect(url).toContain(host);
      expect(isNewTab).toBe('_self');

      const { params } = mockValue;
      const qs = `client_id=${params.client_id}`;
      const configs = encodeURIComponent(`sdk_platform=js;sdk_version=${packageJSON.version};back_to=${location.href}`);

      expect(url).toBe(`${host}?${qs}&configs=${configs}`);
    });

    test('with params', async () => {
      const open = (window.open = jest.fn());
      const backTo = 'http://google.com';

      linkSDK.init.call(mockValue, {
        clientId: value,
        scope: [value],
        isTestEnvironment: true
      });
      linkSDK.openVault.call(mockValue, {
        backTo,
        newTab: true
      });

      expect(open).toBeCalled();

      const [[url, isNewTab]] = open.mock.calls; // [0][1]
      expect(isNewTab).toBe('_blank');

      const { params, domains } = mockValue;
      const host = `https://${domains.vault}`;
      const qs = `client_id=${params.client_id}`;
      const configs = encodeURIComponent(`sdk_platform=js;sdk_version=${packageJSON.version};back_to=${backTo}`);

      expect(url).toBe(`${host}?${qs}&configs=${configs}`);
    });
  });

  describe('openSettings', () => {
    test('Calling "openSettings" method before an init will failed', async () => {
      expect(() => {
        // @ts-ignore Ignores missing arguments to test user passing no arguments
        linkSDK.openSettings();
      }).toThrow('SDK not initialized');
    });

    test('default params', async () => {
      const open = (window.open = jest.fn());

      linkSDK.init.call(mockValue, {
        clientId: value,
        scope: [value]
      });
      // @ts-ignore Ignores missing arguments to test user passing no arguments
      linkSDK.openSettings.call(mockValue);

      expect(open).toBeCalled();

      const [[url, isNewTab]] = open.mock.calls; // [0][1]

      const host = `https://${mockValue.domains.myaccount}/${MY_ACCOUNT.PATHS.SETTINGS}`;
      expect(url).toContain(host);
      expect(isNewTab).toBe('_self');

      const { params } = mockValue;
      const qs = `client_id=${params.client_id}`;
      const configs = encodeURIComponent(`sdk_platform=js;sdk_version=${packageJSON.version};back_to=${location.href}`);

      expect(url).toBe(`${host}?${qs}&configs=${configs}`);
    });

    test('with params', async () => {
      const open = (window.open = jest.fn());
      const backTo = 'http://google.com';

      linkSDK.init.call(mockValue, {
        clientId: value,
        scope: [value],
        isTestEnvironment: true
      });
      linkSDK.openSettings.call(mockValue, {
        backTo,
        newTab: true
      });

      expect(open).toBeCalled();

      const [[url, isNewTab]] = open.mock.calls; // [0][1]
      expect(isNewTab).toBe('_blank');

      const { params, domains } = mockValue;
      const host = `https://${domains.myaccount}/${MY_ACCOUNT.PATHS.SETTINGS}`;
      const qs = `client_id=${params.client_id}`;
      const configs = encodeURIComponent(`sdk_platform=js;sdk_version=${packageJSON.version};back_to=${backTo}`);

      expect(url).toBe(`${host}?${qs}&configs=${configs}`);
    });
  });
});
