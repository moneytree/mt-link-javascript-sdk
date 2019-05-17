import * as qs from 'qs';
import { DOMAIN } from './endpoints';

function convertPascalToSnakeCase(str: string) {
  return str.split(/(?=[A-Z])/).join('_').toLowerCase();
}

interface IMap { [key: string]: string | IMap; }

export function getServerHostByEnvironment(server: IMap, isTest: boolean = false) {
  const subdomain = server[isTest ? 'TEST_SUBDOMAIN' : 'SUBDOMAIN'];
  return `https://${subdomain}.${DOMAIN}`;
}

export interface IParams {
  [k: string]: string | boolean;
}

export function extractConfigsFromOptionsOrDefault(options: IParams, configsParams: IParams) {
  const configKeys = Object.keys(configsParams);
  const configs: IParams = {
    sdk_platform: 'js',
    sdk_version: VERSION
  };

  configKeys.forEach((key) => {
    const snakeCaseKey = convertPascalToSnakeCase(key);
    const value = options[key];
    configs[snakeCaseKey] = value === undefined ? configsParams[key] : value;
  });

  return qs.stringify(configs, { encode: false, delimiter: ';' });
}
