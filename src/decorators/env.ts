import 'reflect-metadata';
import { envCase } from '../utils/env-case';

export interface EnvConfig {
  type?: StringConstructor | NumberConstructor | BooleanConstructor | 'json';
  default?: EnvDefault;
  key?: string;
}

export type EnvDefault = string | number | boolean | ((target: any) => string | number | boolean);
type EnvDecoratorContext = ClassFieldDecoratorContext | { kind: string; name: string | symbol };

function isStandardFieldDecoratorContext(value: unknown): value is EnvDecoratorContext {
  return Boolean(
    value &&
    typeof value === 'object' &&
    'kind' in value &&
    (value as EnvDecoratorContext).kind === 'field'
  );
}

function getEnvValue(
  conf: EnvConfig,
  envKey: string,
  defaultTarget: any,
  metadataTarget?: any,
  propertyKey?: string | symbol
): any {
  let value: any = process.env[envKey];

  // Handle default value
  if (value === undefined) {
    value = typeof conf.default === 'function'
      ? conf.default.call(defaultTarget, defaultTarget)
      : conf.default;
  }

  // Type conversion
  const propertyType = conf.type || (
    metadataTarget && propertyKey !== undefined
      ? Reflect.getMetadata('design:type', metadataTarget, propertyKey)
      : undefined
  );

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

  return value;
}

/**
 * Handles environment variables with type conversion and default values
 * @param config - Environment variable configuration or default value
 * @returns PropertyDecorator
 */
export function Env(config?: EnvDefault | EnvConfig): any {
  const conf: EnvConfig = typeof config === 'function' || typeof config !== 'object'
    ? { default: config }
    : config as EnvConfig;

  return function (targetOrValue: any, propertyKeyOrContext: string | symbol | EnvDecoratorContext) {
    if (isStandardFieldDecoratorContext(propertyKeyOrContext)) {
      const propertyName = String(propertyKeyOrContext.name);
      const envKey = conf.key || envCase(propertyName);

      return function (this: any) {
        return getEnvValue(conf, envKey, this);
      };
    }

    const propertyKey = propertyKeyOrContext;
    const envKey = conf.key || envCase(String(propertyKey));
    const value = getEnvValue(conf, envKey, targetOrValue, targetOrValue, propertyKey);

    Object.defineProperty(targetOrValue, propertyKey, {
      get: () => value,
      enumerable: true,
      configurable: true,
    });
  }
} 
