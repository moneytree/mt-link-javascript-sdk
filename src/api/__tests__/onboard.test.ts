import qs from 'qs';
import { mocked } from 'ts-jest/utils';

import { MY_ACCOUNT_DOMAINS } from '../../server-paths';
import { MtLinkSdk } from '../..';
import onboard from '../onboard';
import { generateConfigs } from '../../helper';
import storage from '../../storage';

jest.mock('../../storage');

describe('api', () => {
  describe('onboard', () => {
    const open = (window.open = jest.fn());

    const mockedStorage = mocked(storage);

    const clientId = 'clientId';
    const redirectUri = 'redirectUri';
    const email = 'email';

    test('without calling init', () => {
      expect(() => {
        onboard(new MtLinkSdk().storedOptions);
      }).toThrow('[mt-link-sdk] Make sure to call `init` before calling `onboard`.');
    });

    test('redirectUri is required', () => {
      const mtLinkSdk = new MtLinkSdk();
      mtLinkSdk.init(clientId);

      expect(() => {
        onboard(mtLinkSdk.storedOptions);
      }).toThrow(
        '[mt-link-sdk] Missing option `redirectUri` in `onboard`, make sure to pass one via `onboard` options or `init` options.'
      );
    });

    test('email is required', () => {
      const mtLinkSdk = new MtLinkSdk();
      mtLinkSdk.init(clientId, {
        redirectUri
      });

      expect(() => {
        onboard(mtLinkSdk.storedOptions);
      }).toThrow(
        '[mt-link-sdk] Missing option `email` in `onboard`, make sure to pass one via `onboard` options or `init` options.'
      );
    });

    test('country is required', () => {
      const mtLinkSdk = new MtLinkSdk();
      mtLinkSdk.init(clientId, {
        redirectUri,
        email
      });

      expect(() => {
        onboard(mtLinkSdk.storedOptions);
      }).toThrow(
        '[mt-link-sdk] Missing option `country` in `onboard`, make sure to pass one via `onboard` options or `init` options.'
      );
    });

    test('method call without options use default init value', () => {
      mockedStorage.set.mockClear();
      open.mockClear();

      const codeVerifier = 'codeVerifier';
      const state = 'state';
      const country = 'JP';
      const scopes = 'points_read';
      const cobrandClientId = 'cobrandClientId';
      const locale = 'locale';

      const mtLinkSdk = new MtLinkSdk();
      mtLinkSdk.init(clientId, {
        redirectUri,
        state,
        codeVerifier,
        country,
        scopes,
        email,
        locale,
        cobrandClientId
      });

      onboard(mtLinkSdk.storedOptions);

      expect(open).toBeCalledTimes(1);

      const query = qs.stringify({
        client_id: clientId,
        cobrand_client_id: cobrandClientId,
        response_type: 'code',
        scope: scopes,
        redirect_uri: redirectUri,
        code_challenge: 'N1E4yRMD7xixn_oFyO_W3htYN3rY7-HMDKJe6z6r928',
        code_challenge_method: 'S256',
        state,
        country,
        locale,
        configs: generateConfigs({ email })
      });
      const url = `${MY_ACCOUNT_DOMAINS.production}/onboard?${query}`;
      expect(open).toBeCalledWith(url, '_self');

      expect(mockedStorage.set).toBeCalledTimes(2);
      expect(mockedStorage.set).toBeCalledWith('state', state);
      expect(mockedStorage.set).toBeCalledWith('codeVerifier', codeVerifier);
    });

    test('with options', () => {
      mockedStorage.set.mockClear();
      open.mockClear();

      const codeVerifier = 'codeVerifier';
      const state = 'state';
      const country = 'JP';
      const scopes = 'points_read';

      const mtLinkSdk = new MtLinkSdk();
      mtLinkSdk.init(clientId);

      onboard(mtLinkSdk.storedOptions, {
        state,
        codeVerifier,
        redirectUri,
        country,
        scopes,
        email
      });

      expect(open).toBeCalledTimes(1);

      const query = qs.stringify({
        client_id: clientId,
        response_type: 'code',
        scope: scopes,
        redirect_uri: redirectUri,
        code_challenge: 'N1E4yRMD7xixn_oFyO_W3htYN3rY7-HMDKJe6z6r928',
        code_challenge_method: 'S256',
        state,
        country,
        configs: generateConfigs({ email })
      });
      const url = `${MY_ACCOUNT_DOMAINS.production}/onboard?${query}`;
      expect(open).toBeCalledWith(url, '_self');

      expect(mockedStorage.set).toBeCalledTimes(4);
      expect(mockedStorage.set).toBeCalledWith('state', state);
      expect(mockedStorage.set).toBeCalledWith('codeVerifier', codeVerifier);
    });

    test('without window', () => {
      const windowSpy = jest.spyOn(global, 'window', 'get');
      // @ts-ignore
      windowSpy.mockImplementation(() => undefined);

      expect(() => {
        onboard(new MtLinkSdk().storedOptions);
      }).toThrow('[mt-link-sdk] `onboard` only works in the browser.');
    });
  });
});
