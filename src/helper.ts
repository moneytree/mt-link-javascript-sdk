declare const __VERSION__: string;

import { stringify } from 'qs';
import { snakeCase } from 'snake-case';
import { createHash } from 'crypto';
import { encode } from 'url-safe-base64';
import { v4 as uuid } from 'uuid';
import storage from './storage';

import {
  Scopes,
  InitOptions,
  ConfigsOptions,
  AuthAction,
  AuthnMethod,
  supportedAuthnMethod,
  supportedAuthAction
} from './typings';

export function constructScopes(scopes: Scopes = ''): string | undefined {
  return (Array.isArray(scopes) ? scopes.join(' ') : scopes) || undefined;
}

export function getIsTabValue(isNewTab = false): '' | '_self' {
  return isNewTab ? '' : '_self';
}

export function mergeConfigs(
  initValues: InitOptions,
  newValues: ConfigsOptions,
  ignoreKeys: string[] = []
): ConfigsOptions {
  const {
    email: defaultEmail,
    backTo: defaultBackTo,
    authAction: defaultAuthAction,
    showAuthToggle: defaultShowAuthToggle,
    showRememberMe: defaultShowRememberMe
  } = initValues;

  const {
    email = defaultEmail,
    backTo = defaultBackTo,
    authAction = defaultAuthAction,
    showAuthToggle = defaultShowAuthToggle,
    showRememberMe = defaultShowRememberMe,
    ...rest
  } = newValues;

  const configs: ConfigsOptions = {
    ...rest,
    email,
    backTo,
    authAction,
    showAuthToggle,
    showRememberMe
  };

  if (ignoreKeys.length) {
    const keys = Object.keys(configs) as Array<keyof ConfigsOptions>;

    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];

      if (ignoreKeys.indexOf(key) !== -1) {
        configs[key] = undefined;
      }
    }
  }

  return configs;
}

export function generateConfigs(configs: ConfigsOptions = {}): string {
  const snakeCaseConfigs: { [key: string]: string | AuthAction | boolean | AuthnMethod[] | undefined } = {};

  const configKeys = [
    'email',
    'backTo',
    'authAction',
    'showAuthToggle',
    'showRememberMe',
    'isNewTab',
    'forceLogout',
    'sdkPlatform',
    'sdkVersion',
    'authnMethod'
  ];

  if (configs.authnMethod) {
    configs.authnMethod = parseAuthnMethod(configs.authnMethod);
  }

  if (configs.authAction) {
    configs.authAction = parseAuthAction(configs.authAction);
  }

  for (const key in configs) {
    if (configKeys.indexOf(key) !== -1) {
      snakeCaseConfigs[snakeCase(key)] = configs[key as keyof ConfigsOptions];
    }
  }

  return stringify(
    {
      sdk_platform: 'js',
      sdk_version: __VERSION__,
      ...snakeCaseConfigs
    },
    { indices: false, arrayFormat: 'brackets' }
  );
}

function isAuthnMethod(x: unknown): x is AuthnMethod | AuthnMethod[] {
  if (Array.isArray(x)) {
    return (
      x.length > 0 &&
      x.every((el: AuthnMethod) => {
        return supportedAuthnMethod.includes(el);
      })
    );
  }

  return supportedAuthnMethod.includes(x as AuthnMethod);
}

function parseAuthnMethod(x: unknown): AuthnMethod[] | AuthnMethod | undefined {
  if (Array.isArray(x)) {
    let filtered_x = x.filter((el: AuthnMethod) => supportedAuthnMethod.includes(el));

    filtered_x.length == 1 ? (x = filtered_x.toString()) : (x = filtered_x);
  }

  return isAuthnMethod(x) ? x : undefined;
}

function isAuthAction(x: unknown): x is AuthAction {
  return supportedAuthAction.includes(x as AuthAction);
}

function parseAuthAction(x: unknown): AuthAction | undefined {
  return isAuthAction(x) ? x : undefined;
}

export function generateCodeChallenge(): string {
  const codeVerifier = uuid();

  storage.set('cv', codeVerifier);

  return encode(createHash('sha256').update(codeVerifier).digest('base64').split('=')[0]);
}

export function generateSdkHeaderInfo(): {
  'mt-sdk-platform': string;
  'mt-sdk-version': string;
} {
  return {
    'mt-sdk-platform': 'js',
    'mt-sdk-version': __VERSION__
  };
}

export function openWindow(url: string, windowName: string): Window | null {
  return window.open(url, windowName, 'noreferrer');
}
