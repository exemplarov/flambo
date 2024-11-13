import 'reflect-metadata';
import { envCase } from '../utils/env-case';

export interface EnvConfig {
  type?: StringConstructor | NumberConstructor | BooleanConstructor | 'json';
  default?: EnvDefault;
  key?: string;
}

export type EnvDefault = string | number | boolean | ((target: any) => string | number | boolean);

/**
 * Handles environment variables with type conversion and default values
 * @param config - Environment variable configuration or default value
 * @returns PropertyDecorator
 */
export function Env(config?: EnvDefault | EnvConfig) {
  const conf: EnvConfig = typeof config === 'function' || typeof config !== 'object'
    ? { default: config }
    : config as EnvConfig;

  return function (target: any, propertyKey: string) {
    const envKey = conf.key || envCase(propertyKey);
    let value: any = process.env[envKey];

    // Handle default value
    if (value === undefined) {
      value = typeof conf.default === 'function' 
        ? conf.default.call(target, target) 
        : conf.default;
    }

    // Type conversion
    const propertyType = conf.type || Reflect.getMetadata('design:type', target, propertyKey);
    
    try {
      if (propertyType === 'json') {
        value = JSON.parse(value);
      } else if (propertyType === String) {
        value = String(value);
      } else if (propertyType === Number) {
        value = Number(value);
        if (isNaN(value)) throw new Error(`Invalid number value for ${envKey}`);
      } else if (propertyType === Boolean) {
        value = Boolean(value);
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      throw new Error(`Failed to parse ${envKey}: ${errorMessage}`);
    }

    Object.defineProperty(target, propertyKey, {
      get: () => value,
      enumerable: true,
      configurable: true,
    });
  }
} 