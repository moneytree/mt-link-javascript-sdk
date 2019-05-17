import * as qs from 'qs';

import linkSDK, { IAuthorizeParams, IParamConfigsOptions, ISDKConfigOptions } from '..';
import { MY_ACCOUNT, VAULT } from '../endpoints';
import { getServerHostByEnvironment } from '../helpers';

type IMock = { authorizeParams: IAuthorizeParams; commonParams: ISDKConfigOptions, configsParams: IParamConfigsOptions };

describe('LinkSDK', () => {
  const value = 'test';
  let mockValue = {} as IMock

  beforeEach(() => {
    mockValue = {} as IMock;
  });

  describe('init', () => {
    test('default', async () => {
      linkSDK.init.call(mockValue, {
        clientId: value
      });

      const { authorizeParams, commonParams, configsParams } = mockValue;

      expect(authorizeParams.clientId).toBe(value);
      expect(authorizeParams.redirectUri).toBe(`${location.protocol}//${location.host}/callback`);
      expect(authorizeParams.responseType).toBe('token');
      expect(authorizeParams.scope).toEqual([]);
      expect(authorizeParams.state).toBeFalsy();

      expect(commonParams.locale).toBeFalsy();
      expect(commonParams.isTestEnvironment).toBe(false);
      expect(commonParams.newTab).toBe(false);

      expect(configsParams.email).toBeFalsy();
      expect(configsParams.backTo).toBe(location.href);
      expect(configsParams.authPage).toBe('login');
      expect(configsParams.showAuthToggle).toBe(true);
    });

    test('Failed without clientId', async () => {
      const failed = jest.fn();

      try {
        linkSDK.init({ clientId: '' });
      } catch (error) {
        failed(error);
      }

      expect(failed).toBeCalled();
    });

    test('authorizeParams - clientId, redirectUri, responseType, scope', async () => {
      linkSDK.init.call(mockValue, {
        clientId: value,
        redirectUri: value,
        responseType: 'token',
        scope: [value, value],
        state: value
      });

      const { authorizeParams } = mockValue;

      expect(authorizeParams.clientId).toBe(value);
      expect(authorizeParams.redirectUri).toBe(value);
      expect(authorizeParams.responseType).toBe('token');
      expect(authorizeParams.scope).toEqual([value, value]);
      expect(authorizeParams.state).toBe(value);
    });

    test('commonParams - locale, isTestEnvironment, newTab', async () => {
      linkSDK.init.call(mockValue, {
        clientId: value,
        locale: value,
        isTestEnvironment: true,
        newTab: true
      });

      const { commonParams } = mockValue;

      expect(commonParams.locale).toBe(value);
      expect(commonParams.isTestEnvironment).toBe(true);
      expect(commonParams.newTab).toBe(true);
    });

    test('authorizeParams - email, backTo, authPage, showAuthToggle', async () => {
      linkSDK.init.call(mockValue, {
        clientId: value,
        email: value,
        backTo: value,
        authPage: 'signup',
        showAuthToggle: false
      });

      const { configsParams } = mockValue;

      expect(configsParams.email).toBe(value);
      expect(configsParams.backTo).toBe(value);
      expect(configsParams.authPage).toBe('signup');
      expect(configsParams.showAuthToggle).toBe(false);
    });
  });

  describe('authorize', () => {
    test('Calling "authorize" method before an init will failed', async () => {
      const failed = jest.fn();

      try {
        linkSDK.authorize();
      } catch (error) {
        failed(error);
      }

      expect(failed).toBeCalled();
    });

    test('default', async () => {
      const open = (window.open = jest.fn());

      linkSDK.init.call(mockValue, {
        clientId: value
      });
      linkSDK.authorize.call(mockValue);

      expect(open).toBeCalled();

      const { authorizeParams } = mockValue;
      const domain = getServerHostByEnvironment(MY_ACCOUNT);

      const configs = qs.stringify({
        sdk_platform: 'js',
        sdk_version: VERSION,
        back_to: location.href,
        auth_page: 'login',
        show_auth_toggle: true
      }, { encode: false, delimiter: ';' });

      const params = qs.stringify({
        client_id: authorizeParams.clientId,
        redirect_uri: authorizeParams.redirectUri,
        response_type: 'token',
        configs
      });

      const url = open.mock.calls[0][0];
      const isNewTab = open.mock.calls[0][1];

      expect(url).toBe(`${domain}/${MY_ACCOUNT.PATHS.OAUTH}?${params}`);
      expect(isNewTab).toBe('_self');
    });

    test('redirectUri, scope, responseType, state, locale, isTestEnvironment, newTab, authPage, email, backTo, showAuthToggle', async () => {
      const open = (window.open = jest.fn());

      linkSDK.init.call(mockValue, {
        clientId: value
      });
      linkSDK.authorize.call(mockValue, {
        redirectUri: value,
        scope: [value, value],
        responseType: 'code',
        state: value,
        locale: value,
        isTestEnvironment: true,
        newTab: true,
        authPage: 'signup',
        email: value,
        backTo: value,
        showAuthToggle: false
      });

      expect(open).toBeCalled();

      const { authorizeParams } = mockValue;
      const domain = getServerHostByEnvironment(MY_ACCOUNT, true);

      const configs = qs.stringify({
        sdk_platform: 'js',
        sdk_version: VERSION,
        email: value,
        back_to: value,
        auth_page: 'signup',
        show_auth_toggle: false
      }, { encode: false, delimiter: ';' });

      const params = qs.stringify({
        client_id: authorizeParams.clientId,
        scope: `${value} ${value}`,
        state: value,
        locale: value,
        redirect_uri: value,
        response_type: 'code',
        configs
      });

      const url = open.mock.calls[0][0];
      const isNewTab = open.mock.calls[0][1];

      expect(url).toBe(`${domain}/${MY_ACCOUNT.PATHS.OAUTH}?${params}`);
      expect(isNewTab).toBe('_blank');
    });
  });

  describe('openVault', () => {
    test('Calling "openVault" method before an init will failed', async () => {
      const failed = jest.fn();

      try {
        linkSDK.openVault();
      } catch (error) {
        failed(error);
      }

      expect(failed).toBeCalled();
    });

    test('default', async () => {
      const open = (window.open = jest.fn());

      linkSDK.init.call(mockValue, {
        clientId: value
      });
      linkSDK.openVault.call(mockValue);

      expect(open).toBeCalled();

      const { authorizeParams, commonParams } = mockValue;
      const domain = getServerHostByEnvironment(VAULT, commonParams.isTestEnvironment);

      const configs = qs.stringify({
        sdk_platform: 'js',
        sdk_version: VERSION,
        back_to: location.href,
        auth_page: 'login',
        show_auth_toggle: true
      }, { encode: false, delimiter: ';' });

      const params = qs.stringify({
        client_id: authorizeParams.clientId,
        configs
      });

      const url = open.mock.calls[0][0];
      const isNewTab = open.mock.calls[0][1];

      expect(url).toBe(`${domain}?${params}`);
      expect(isNewTab).toBe('_self');
    });

    test('state, locale, isTestEnvironment, newTab, authPage, email, backTo, showAuthToggle', async () => {
      const open = (window.open = jest.fn());

      linkSDK.init.call(mockValue, {
        clientId: value
      });
      linkSDK.openVault.call(mockValue, {
        state: value,
        locale: value,
        isTestEnvironment: true,
        newTab: true,
        authPage: 'signup',
        email: value,
        backTo: value,
        showAuthToggle: false
      });

      expect(open).toBeCalled();

      const { authorizeParams } = mockValue;
      const domain = getServerHostByEnvironment(VAULT, true);

      const configs = qs.stringify({
        sdk_platform: 'js',
        sdk_version: VERSION,
        email: value,
        back_to: value,
        auth_page: 'signup',
        show_auth_toggle: false
      }, { encode: false, delimiter: ';' });

      const params = qs.stringify({
        state: value,
        locale: value,
        client_id: authorizeParams.clientId,
        configs
      });

      const url = open.mock.calls[0][0];
      const isNewTab = open.mock.calls[0][1];

      expect(url).toBe(`${domain}?${params}`);
      expect(isNewTab).toBe('_blank');
    });
  });

  describe('openSettings', () => {
    test('Calling "openSettings" method before an init will failed', async () => {
      const failed = jest.fn();

      try {
        linkSDK.openSettings();
      } catch (error) {
        failed(error);
      }

      expect(failed).toBeCalled();
    });

    test('default', async () => {
      const open = (window.open = jest.fn());

      linkSDK.init.call(mockValue, {
        clientId: value
      });
      linkSDK.openSettings.call(mockValue);

      expect(open).toBeCalled();

      const { authorizeParams, commonParams } = mockValue;
      const domain = getServerHostByEnvironment(MY_ACCOUNT, commonParams.isTestEnvironment);

      const configs = qs.stringify({
        sdk_platform: 'js',
        sdk_version: VERSION,
        back_to: location.href,
        auth_page: 'login',
        show_auth_toggle: true
      }, { encode: false, delimiter: ';' });

      const params = qs.stringify({
        client_id: authorizeParams.clientId,
        configs
      });

      const url = open.mock.calls[0][0];
      const isNewTab = open.mock.calls[0][1];

      expect(url).toBe(`${domain}/${MY_ACCOUNT.PATHS.SETTINGS}?${params}`);
      expect(isNewTab).toBe('_self');
    });

    test('redirectUri, scope, responseType, state, locale, isTestEnvironment, newTab, authPage, email, backTo, showAuthToggle', async () => {
      const open = (window.open = jest.fn());

      linkSDK.init.call(mockValue, {
        clientId: value
      });
      linkSDK.openSettings.call(mockValue, {
        state: value,
        locale: value,
        isTestEnvironment: true,
        newTab: true,
        authPage: 'signup',
        email: value,
        backTo: value,
        showAuthToggle: false
      });

      expect(open).toBeCalled();

      const { authorizeParams } = mockValue;
      const domain = getServerHostByEnvironment(MY_ACCOUNT, true);

      const configs = qs.stringify({
        sdk_platform: 'js',
        sdk_version: VERSION,
        email: value,
        back_to: value,
        auth_page: 'signup',
        show_auth_toggle: false
      }, { encode: false, delimiter: ';' });

      const params = qs.stringify({
        state: value,
        locale: value,
        client_id: authorizeParams.clientId,
        configs
      });

      const url = open.mock.calls[0][0];
      const isNewTab = open.mock.calls[0][1];

      expect(url).toBe(`${domain}/${MY_ACCOUNT.PATHS.SETTINGS}?${params}`);
      expect(isNewTab).toBe('_blank');
    });
  });
});
