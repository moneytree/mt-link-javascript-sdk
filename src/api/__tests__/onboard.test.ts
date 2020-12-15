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
        redirectUri,
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
        email,
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

      const country = 'JP';
      const scopes = 'points_read';
      const cobrandClientId = 'cobrandClientId';
      const locale = 'locale';

      const mtLinkSdk = new MtLinkSdk();
      mtLinkSdk.init(clientId, {
        redirectUri,
        country,
        scopes,
        email,
        locale,
        cobrandClientId,
      });

      onboard(mtLinkSdk.storedOptions);

      expect(open).toBeCalledTimes(1);

      const query = qs.stringify({
        client_id: clientId,
        cobrand_client_id: cobrandClientId,
        response_type: 'code',
        scope: scopes,
        redirect_uri: redirectUri,
        country,
        locale,
        configs: generateConfigs({ email }),
      });
      const url = `${MY_ACCOUNT_DOMAINS.production}/onboard?${query}`;
      expect(open).toBeCalledWith(url, '_self', 'noreferrer');
    });

    test('with options', () => {
      mockedStorage.set.mockClear();
      open.mockClear();

      const state = 'state';
      const country = 'JP';
      const scopes = 'points_read';

      const mtLinkSdk = new MtLinkSdk();
      mtLinkSdk.init(clientId);

      onboard(mtLinkSdk.storedOptions, {
        state,
        redirectUri,
        country,
        scopes,
        email,
      });

      expect(open).toBeCalledTimes(1);

      const query = qs.stringify({
        client_id: clientId,
        response_type: 'code',
        scope: scopes,
        redirect_uri: redirectUri,
        state,
        country,
        configs: generateConfigs({ email }),
      });
      const url = `${MY_ACCOUNT_DOMAINS.production}/onboard?${query}`;
      expect(open).toBeCalledWith(url, '_self', 'noreferrer');
    });

    test('without window', () => {
      const windowSpy = jest.spyOn(global, 'window', 'get');
      // @ts-ignore: mocking window object to undefined
      windowSpy.mockImplementation(() => undefined);

      expect(() => {
        onboard(new MtLinkSdk().storedOptions);
      }).toThrow('[mt-link-sdk] `onboard` only works in the browser.');
    });
  });
});
