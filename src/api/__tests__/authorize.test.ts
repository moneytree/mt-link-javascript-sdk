import qs from 'qs';
import { mocked } from 'ts-jest/utils';

import { MY_ACCOUNT_DOMAINS } from '../../server-paths';
import { MtLinkSdk } from '../..';
import authorize from '../authorize';
import { generateConfigs } from '../../helper';
import storage from '../../storage';

jest.mock('../../storage');

describe('api', () => {
  describe('authorize', () => {
    const open = (window.open = jest.fn());

    const mockedStorage = mocked(storage);

    const clientId = 'clientId';
    const redirectUri = 'redirectUri';

    test('without calling init', () => {
      expect(() => {
        authorize(new MtLinkSdk().storedOptions);
      }).toThrow('[mt-link-sdk] Make sure to call `init` before calling `authorize`.');
    });

    test('redirectUri is required', () => {
      const mtLinkSdk = new MtLinkSdk();
      mtLinkSdk.init(clientId);

      expect(() => {
        authorize(mtLinkSdk.storedOptions);
      }).toThrow(
        '[mt-link-sdk] Missing option `redirectUri` in `authorize`, make sure to pass one via `authorize` options or `init` options.'
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
        locale,
        cobrandClientId,
      });

      authorize(mtLinkSdk.storedOptions);

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
        configs: generateConfigs(),
      });
      const url = `${MY_ACCOUNT_DOMAINS.production}/oauth/authorize?${query}`;
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

      authorize(mtLinkSdk.storedOptions, {
        state,
        codeVerifier,
        redirectUri,
        country,
        scopes,
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
        configs: generateConfigs(),
      });
      const url = `${MY_ACCOUNT_DOMAINS.production}/oauth/authorize?${query}`;
      expect(open).toBeCalledWith(url, '_self');

      expect(mockedStorage.set).toBeCalledTimes(4);
      expect(mockedStorage.set).toBeCalledWith('state', state);
      expect(mockedStorage.set).toBeCalledWith('codeVerifier', codeVerifier);
    });

    test('without window', () => {
      const windowSpy = jest.spyOn(global, 'window', 'get');
      // @ts-ignore: mocking window object to undefined
      windowSpy.mockImplementation(() => undefined);

      expect(() => {
        authorize(new MtLinkSdk().storedOptions);
      }).toThrow('[mt-link-sdk] `authorize` only works in the browser.');
    });
  });
});
