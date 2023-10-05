import { mocked } from 'ts-jest/utils';

import authorize from '../api/authorize';
import onboard from '../api/onboard';
import logout from '../api/logout';
import openService from '../api/open-service';
import requestLoginLink from '../api/request-login-link';
import exchangeToken from '../api/exchange-token';
import tokenInfo from '../api/token-info';
import mtLinkSdk, { Mode, MtLinkSdk } from '..';

import packageJson from '../../package.json';

jest.mock('../api/authorize');
jest.mock('../api/onboard');
jest.mock('../api/logout');
jest.mock('../api/open-service');
jest.mock('../api/request-login-link');
jest.mock('../api/exchange-token');
jest.mock('../api/token-info');

describe('index', () => {
  test('MtLinkSdk', async () => {
    const instance = new MtLinkSdk();

    instance.init('clientId', {
      redirectUri: 'redirectUri',
      authnMethod: 'sso',
      samlSubjectId: 'samlSubjectId'
    });

    const options = instance.storedOptions;
    const storedOptions = {
      clientId: options.clientId,
      mode: options.mode,
      redirectUri: options.redirectUri,
      state: options.state,
      authnMethod: options.authnMethod,
      samlSubjectId: options.samlSubjectId
    };

    const result1 = instance.authorize({ scopes: 'scopes' });
    expect(result1).toBeUndefined();
    expect(authorize).toBeCalledWith(storedOptions, { scopes: 'scopes' });

    const result2 = instance.onboard({ scopes: 'scopes' });
    expect(result2).toBeUndefined();
    expect(onboard).toBeCalledWith(storedOptions, { scopes: 'scopes' });

    const result3 = instance.logout({ backTo: 'backTo' });
    expect(result3).toBeUndefined();
    expect(logout).toBeCalledWith(storedOptions, { backTo: 'backTo' });

    const result4 = instance.openService('myaccount');
    expect(result4).toBeUndefined();
    expect(openService).toBeCalledWith(storedOptions, 'myaccount', undefined);

    const result5 = await instance.requestLoginLink({ loginLinkTo: 'settings' });
    expect(result5).toBeUndefined();
    expect(requestLoginLink).toBeCalledWith(storedOptions, { loginLinkTo: 'settings' });

    const token = {
      access_token: 'access_token',
      refresh_token: 'refresh_token',
      expires_in: 3600,
      token_type: 'bearer',
      scope: 'guest_read',
      created_at: Date.now(),
      resource_server: 'jp-api'
    };
    mocked(exchangeToken).mockResolvedValueOnce(token);
    const result6 = await instance.exchangeToken({ code: 'code' });
    expect(result6).toEqual(token);
    expect(exchangeToken).toBeCalledWith(storedOptions, { code: 'code' });

    // @ts-ignore: set tokenInfo with invalid type value
    mocked(tokenInfo).mockResolvedValueOnce('test');
    const result7 = await instance.tokenInfo('test');
    expect(result7).toBe('test');

    const sdkVersion = packageJson.version;

    const result8 = instance.authorizeUrl({ scopes: 'scopes' });
    expect(result8).toBe(
      'https://myaccount.getmoneytree.com/oauth/authorize?client_id=clientId&response_type=code&' +
        'scope=scopes&redirect_uri=redirectUri&country=JP&saml_subject_id=samlSubjectId&' +
        `configs=authn_method%3Dsso%26sdk_platform%3Djs%26sdk_version%3D${sdkVersion}`
    );

    const result9 = instance.onboardUrl({ scopes: 'scopes' });
    expect(result9).toBe(
      'https://myaccount.getmoneytree.com/onboard?client_id=clientId&response_type=code&' +
        'scope=scopes&redirect_uri=redirectUri&country=JP&' +
        `configs=authn_method%3Dsso%26sdk_platform%3Djs%26sdk_version%3D${sdkVersion}`
    );

    const result10 = instance.logoutUrl({ backTo: 'backTo' });
    expect(result10).toBe(
      'https://myaccount.getmoneytree.com/guests/logout?client_id=clientId&saml_subject_id=samlSubjectId&' +
        `configs=back_to%3DbackTo%26authn_method%3Dsso%26sdk_platform%3Djs%26sdk_version%3D${sdkVersion}`
    );

    const result11 = instance.openServiceUrl('vault');
    expect(result11).toBe(
      'https://vault.getmoneytree.com?client_id=clientId&saml_subject_id=samlSubjectId&' +
        `configs=authn_method%3Dsso%26sdk_platform%3Djs%26sdk_version%3D${sdkVersion}`
    );

    instance.openServiceUrl('myaccount');
  });

  test('mtLinkSdk', () => {
    const instance = new MtLinkSdk();

    expect(instance).not.toBe(mtLinkSdk);
  });

  test('init without clientId', () => {
    expect(() => {
      mtLinkSdk.init('');
    }).toThrow('[mt-link-sdk] Missing parameter `client_id` in `init`.');
  });

  test('init options', () => {
    mtLinkSdk.init('clientId', {
      mode: 'local',
      state: 'state'
    });

    expect(mtLinkSdk.storedOptions.mode).toBe('local');
    expect(mtLinkSdk.storedOptions.state).toBe('state');
  });

  test('invalid mode default to production', () => {
    mtLinkSdk.init('clientId', {
      // force cast invalid value so that we can use it for testing
      mode: 'invalid' as Mode
    });

    expect(mtLinkSdk.storedOptions.mode).toBe('production');
  });

  test('sets the samlSubjectId when calling setSamlSubjectId', () => {
    const samlSubjectId = 'samlSubjectId';
    mtLinkSdk.init('clientId', {
      samlSubjectId
    });

    expect(mtLinkSdk.storedOptions.samlSubjectId).toBe(samlSubjectId);

    const newSamlSubjectId = 'newSamlSubjectId';

    mtLinkSdk.setSamlSubjectId(newSamlSubjectId);

    expect(mtLinkSdk.storedOptions.samlSubjectId).toBe(newSamlSubjectId);
  });
});
