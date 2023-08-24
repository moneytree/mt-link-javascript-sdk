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

function fallbackOnUndefined<T>(value: T, fallbackValue: T): T {
  return value === undefined ? fallbackValue : value;
}

export function mergeConfigs(
  initValues: InitOptions,
  newValues: ConfigsOptions,
  ignoreKeys: string[] = []
): ConfigsOptions {
  const configs: ConfigsOptions = {
    email: fallbackOnUndefined<ConfigsOptions['email']>(newValues.email, initValues.email),
    backTo: fallbackOnUndefined<ConfigsOptions['backTo']>(newValues.backTo, initValues.backTo),
    authAction: fallbackOnUndefined<ConfigsOptions['authAction']>(newValues.authAction, initValues.authAction),
    showAuthToggle: fallbackOnUndefined<ConfigsOptions['showAuthToggle']>(
      newValues.showAuthToggle,
      initValues.showAuthToggle
    ),
    showRememberMe: fallbackOnUndefined<ConfigsOptions['showRememberMe']>(
      newValues.showRememberMe,
      initValues.showRememberMe
    ),
    isNewTab: fallbackOnUndefined<ConfigsOptions['isNewTab']>(newValues.isNewTab, initValues.isNewTab),
    forceLogout: newValues.forceLogout,
    authnMethod: parseAuthnMethod(
      fallbackOnUndefined<ConfigsOptions['authnMethod']>(newValues.authnMethod, initValues.authnMethod)
    ),
    sdkPlatform: fallbackOnUndefined<ConfigsOptions['sdkPlatform']>(newValues.sdkPlatform, initValues.sdkPlatform),
    sdkVersion: fallbackOnUndefined<ConfigsOptions['sdkVersion']>(newValues.sdkVersion, initValues.sdkVersion)
  };

  Object.keys(configs).forEach((key) => {
    if (configs[key as keyof ConfigsOptions] === undefined || ignoreKeys.indexOf(key) !== -1) {
      delete configs[key as keyof ConfigsOptions];
    }
  });

  return configs;
}

export function generateConfigs(configs: ConfigsOptions = {}): string {
  const snakeCaseConfigs: { [key: string]: string | AuthAction | boolean | undefined } = {};

  const configKeys = [
    'email',
    'backTo',
    'authAction',
    'showAuthToggle',
    'showRememberMe',
    'isNewTab',
    'forceLogout',
    'authnMethod',
    'sdkPlatform',
    'sdkVersion'
  ];

  if (configs.authnMethod) {
    configs.authnMethod = parseAuthnMethod(configs.authnMethod);
  }

  if (configs.authAction) {
    configs.authAction = parseAuthAction(configs.authAction);
  }

  // fallback to current SDK value when both sdk platform and version doesn't or partially exists
  if (!configs.sdkPlatform || !configs.sdkVersion) {
    configs.sdkPlatform = 'js';
    configs.sdkVersion = __VERSION__;
  }

  for (const key in configs) {
    if (configKeys.indexOf(key) !== -1) {
      snakeCaseConfigs[snakeCase(key)] = configs[key as keyof ConfigsOptions];
    }
  }

  return stringify(snakeCaseConfigs);
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

// Validators
function isAuthnMethod(x: unknown): x is AuthnMethod {
  return supportedAuthnMethod.includes(x as AuthnMethod);
}

function parseAuthnMethod(x: unknown): AuthnMethod | undefined {
  if (Array.isArray(x)) {
    throw new TypeError('Array is not allowed for authnMethod');
  }

  return isAuthnMethod(x) ? x : undefined;
}

function isAuthAction(x: unknown): x is AuthAction {
  return supportedAuthAction.includes(x as AuthAction);
}

function parseAuthAction(x: unknown): AuthAction | undefined {
  return isAuthAction(x) ? x : undefined;
}
