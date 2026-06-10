import qs from 'qs';
import { constructScopes, getIsTabValue, mergeConfigs, generateConfigs } from '../helper';
import packageJson from '../../package.json';
import { AuthnMethod, ConfigsOptions, StoredOptions } from '../typings';

const mockFetch = jest.spyOn(global, 'fetch')

describe('helper', () => {
  beforeEach(() => {
	  jest.clearAllMocks();
  });

  test('constuctScopes', () => {
    expect(constructScopes()).toBeUndefined();
    expect(constructScopes('guest_read')).toBe('guest_read');
    expect(constructScopes(['guest_read', 'points_read'])).toBe('guest_read points_read');
  });

  test('getIsTabValue', () => {
    expect(getIsTabValue()).toBe('_self');
    expect(getIsTabValue(false)).toBe('_self');
    expect(getIsTabValue(true)).toBe('');
  });

  describe('mergeConfigs', () => {
    test('use value from initValues by default', () => {
      expect(
        mergeConfigs(
          {
            email: 'email',
            backTo: 'backTo',
            authAction: 'signup',
            showAuthToggle: true,
            showRememberMe: true,
            authnMethod: 'sso'
          },
          {}
        )
      ).toEqual({
        authAction: 'signup',
        email: 'email',
        backTo: 'backTo',
        showRememberMe: true,
        showAuthToggle: true,
        authnMethod: 'sso',
        mode: 'production'
      });
    });

    test('use new value over initValues', () => {
      expect(
        mergeConfigs(
          {
            email: 'email',
            backTo: 'backTo',
            authAction: 'signup',
            showAuthToggle: true,
            showRememberMe: true
          },
          {
            email: 'newEmail',
            backTo: 'newBackTo',
            authAction: 'login',
            showAuthToggle: false,
            showRememberMe: false
          }
        )
      ).toMatchObject({
        email: 'newEmail',
        backTo: 'newBackTo',
        authAction: 'login',
        showAuthToggle: false,
        showRememberMe: false
      });
    });

    test('invalid configs will not be included', () => {
      expect(
        mergeConfigs(
          {
            email: 'email',
            backTo: 'backTo',
            authAction: 'signup',
            showAuthToggle: true,
            showRememberMe: true,
            // @ts-ignore: set unsupported key
            whatIsThis: false,
            authnMethod: 'not really valid' as AuthnMethod
          },
          {
            whatIsThis2: false
          }
        )
      ).toEqual({
        email: 'email',
        backTo: 'backTo',
        authAction: 'signup',
        showAuthToggle: true,
        showRememberMe: true,
        mode: 'production'
      });
    });

    test('can ignore key using third parameters', () => {
      expect(
        mergeConfigs(
          {
            email: 'email',
            backTo: 'backTo',
            authAction: 'signup',
            showAuthToggle: true,
            showRememberMe: true
          },
          {
            email: 'newEmail',
            backTo: 'newBackTo',
            authAction: 'login',
            showAuthToggle: false
          },
          ['email', 'backTo']
        )
      ).toMatchObject({
        authAction: 'login',
        showAuthToggle: false,
        showRememberMe: true
      });
    });
  });

  describe('generateConfigs', () => {
    test('with parameter', async () => {
			const emailToken = 'email-token';
			mockFetch.mockResolvedValueOnce({
				ok: true,
				json: () => Promise.resolve({ email_token: emailToken })
			} as Response);

      const configPayload: StoredOptions & ConfigsOptions = {
        email: 'email',
        backTo: 'backTo',
        authAction: 'signup',
        showAuthToggle: true,
        showRememberMe: true,
        authnMethod: 'sso',
        mode: 'production'
      };

      expect(qs.parse(await generateConfigs(configPayload))).toEqual({
        email_token: emailToken,
        back_to: 'backTo',
        auth_action: 'signup',
        show_auth_toggle: 'true',
        show_remember_me: 'true',
        authn_method: 'sso',
        sdk_platform: 'js',
        sdk_version: packageJson.version
      });
    });

    test('query encoding should make sure config params are also encoded', async () => {
			const emailToken = 'token&!@#(*)-304should be_encoded';
			mockFetch.mockResolvedValueOnce({
				ok: true,
				json: () => Promise.resolve({ email_token: emailToken })
			} as Response);

      const configPayload: StoredOptions & ConfigsOptions = {
        email: 'does not matter',
        backTo: 'backTo #!@with []special= chars',
        authAction: 'signup',
        showAuthToggle: true,
        showRememberMe: true,
        authnMethod: 'sso',
        mode: 'production'
      };

      const result = await generateConfigs(configPayload);
      expect(result).toContain('email_token=token%26%21%40%23%28%2A%29-304should%20be_encoded');
      expect(result).toContain('back_to=backTo%20%23%21%40with%20%5B%5Dspecial%3D%20chars');
    });

    test('Should raise an error when passing an array in authnMethod', async () => {
      const configPayload: StoredOptions & ConfigsOptions = {
        authnMethod: ['oh-not-valid', 'should raise'] as unknown as AuthnMethod,
        mode: 'production'
      };

      await expect(generateConfigs(configPayload)).rejects.toThrow(TypeError);
    });

    test('Should reject invalid authnMethod from config', async () => {
			const emailToken = 'token1234';
			mockFetch.mockResolvedValueOnce({
				ok: true,
				json: () => Promise.resolve({ email_token: emailToken })
			} as Response);

      const configPayload: StoredOptions & ConfigsOptions = {
        email: 'email',
        backTo: 'backTo',
        authAction: 'signup',
        showAuthToggle: true,
        showRememberMe: true,
        authnMethod: 'oh-not-valid' as AuthnMethod,
        mode: 'production'
      };

      expect(qs.parse(await generateConfigs(configPayload))).toEqual({
        email_token: emailToken,
        back_to: 'backTo',
        auth_action: 'signup',
        show_auth_toggle: 'true',
        show_remember_me: 'true',
        sdk_platform: 'js',
        sdk_version: packageJson.version
      });
    });

		test('it returns configs without email or emailToken if POST fails', async () => {
			mockFetch.mockResolvedValueOnce({ ok: false } as Response);

      const configPayload: StoredOptions & ConfigsOptions = {
        email: 'email',
        backTo: 'backTo #!@with []special= chars',
        authAction: 'signup',
        showAuthToggle: true,
        showRememberMe: true,
        authnMethod: 'sso',
        mode: 'production'
      };

			const result = await generateConfigs(configPayload);
			expect(result).not.toContain('email_token');
			expect(result).not.toContain('email');
		});

    test('without parameter', async () => {
      expect(await generateConfigs()).toBe(`sdk_platform=js&sdk_version=${packageJson.version}`);
    });
  });
});
