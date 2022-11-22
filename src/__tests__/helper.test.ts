import { constructScopes, getIsTabValue, mergeConfigs, generateConfigs } from '../helper';
import packageJson from '../../package.json';
import { AuthAction, AuthnMethod, ConfigsOptions } from '../typings';

describe('helper', () => {
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
        authnMethod: 'sso'
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
        showRememberMe: true
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
    test('with parameter', () => {
      const configPayload: ConfigsOptions = {
        email: 'email',
        backTo: 'backTo',
        authAction: 'signup',
        showAuthToggle: true,
        showRememberMe: true,
        authnMethod: 'sso'
      };

      expect(generateConfigs(configPayload)).toBe(
        `sdk_platform=js&sdk_version=${packageJson.version}&email=email&back_to=backTo&auth_action=signup&show_auth_toggle=true` +
          `&show_remember_me=true&authn_method=sso`
      );
    });

    test('query encoding should make sure config params are also encoded', () => {
      const configPayload: ConfigsOptions = {
        email: 'email&!@#(*)-304should be_encoded',
        backTo: 'backTo #!@with []special= chars',
        authAction: 'signup',
        showAuthToggle: true,
        showRememberMe: true,
        authnMethod: 'sso'
      };

      expect(generateConfigs(configPayload)).toBe(
        `sdk_platform=js&sdk_version=${packageJson.version}&email=email%26%21%40%23%28%2A%29-304should%20be_encoded&back_to=backTo%20%23%21%40with%20%5B%5Dspecial%3D%20chars&auth_action=signup&show_auth_toggle=true&show_remember_me=true&authn_method=sso`
      );
    });

    test('Should raise an error when passing an array in authnMethod', () => {
      const configPayload: ConfigsOptions = {
        authnMethod: ['oh-not-valid', 'should raise'] as unknown as AuthnMethod
      };

      expect(() => generateConfigs(configPayload)).toThrow(TypeError);
    });

    test('Should reject invalid authnMethod from config', () => {
      const configPayload: ConfigsOptions = {
        email: 'email',
        backTo: 'backTo',
        authAction: 'signup',
        showAuthToggle: true,
        showRememberMe: true,
        authnMethod: 'oh-not-valid' as AuthnMethod
      };

      expect(generateConfigs(configPayload)).toBe(
        `sdk_platform=js&sdk_version=${packageJson.version}&email=email&back_to=backTo&auth_action=signup&show_auth_toggle=true` +
          `&show_remember_me=true`
      );
    });

    test('without parameter', () => {
      expect(generateConfigs()).toBe(`sdk_platform=js&sdk_version=${packageJson.version}`);
    });
  });
});
