import { constructScopes, getIsTabValue, mergeConfigs, generateConfigs } from '../helper';
import packageJson from '../../package.json';
import { ConfigsOptions } from '../typings';

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
            showRememberMe: true
          },
          {}
        )
      ).toMatchObject({
        email: 'email',
        backTo: 'backTo',
        authAction: 'signup',
        showAuthToggle: true,
        showRememberMe: true
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
            whatIsThis: false
          },
          {
            whatIsThis2: false
          }
        )
      ).toMatchObject({
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
        authnMethod: 'sso',
        samlSubjectId: 'MeTesting'
      };

      expect(generateConfigs(configPayload)).toBe(
        `sdk_platform=js&sdk_version=${packageJson.version}&email=email&back_to=backTo&auth_action=signup&show_auth_toggle=true` +
          `&show_remember_me=true&authn_method=sso&saml_subject_id=MeTesting`
      );
    });

    test('with authnMethod parameter as an array', () => {
      const configPayload: ConfigsOptions = {
        authnMethod: ['sso', 'passwordless']
      };

      expect(generateConfigs(configPayload)).toBe(
        `sdk_platform=js&sdk_version=${packageJson.version}&authn_method[]=sso&authn_method[]=passwordless`
      );
    });

    test('without parameter', () => {
      expect(generateConfigs()).toBe(`sdk_platform=js&sdk_version=${packageJson.version}`);
    });
  });
});
