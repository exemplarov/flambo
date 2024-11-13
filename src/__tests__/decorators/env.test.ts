import { Env } from '../../decorators/env';
import 'reflect-metadata';

describe('@Env', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it('should read string env variable', () => {
    process.env.TEST_VALUE = 'test';

    class Test {
      @Env()
      testValue: string;
    }

    const test = new Test();
    expect(test.testValue).toBe('test');
  });

  it('should use default value when env is not set', () => {
    class Test {
      @Env({ default: 'default' })
      missing: string;
    }

    const test = new Test();
    expect(test.missing).toBe('default');
  });

  it('should convert types correctly', () => {
    process.env.NUMBER_VALUE = '123';
    process.env.BOOL_VALUE = 'true';
    process.env.JSON_VALUE = '{"key":"value"}';

    class Test {
      @Env({ type: Number })
      numberValue: number;

      @Env({ type: Boolean })
      boolValue: boolean;

      @Env({ type: 'json' })
      jsonValue: any;
    }

    const test = new Test();
    expect(test.numberValue).toBe(123);
    expect(test.boolValue).toBe(true);
    expect(test.jsonValue).toEqual({ key: 'value' });
  });

  it('should support custom env key', () => {
    process.env.CUSTOM_KEY = 'value';

    class Test {
      @Env({ key: 'CUSTOM_KEY' })
      differentName: string;
    }

    const test = new Test();
    expect(test.differentName).toBe('value');
  });

  it('should throw on invalid number conversion', () => {
    process.env.INVALID_NUMBER = 'not-a-number';

    expect(() => {
      class Test {
        @Env({ type: Number })
        invalidNumber: number;
      }
      new Test();
    }).toThrow('Invalid number value for INVALID_NUMBER');
  });

  it('should support function as default value', () => {
    const prefix = 'test-';

    class Test {
      @Env({ default: () => prefix + 'suffix' })
      value: string;
    }

    const test = new Test();
    expect(test.value).toBe('test-suffix');
  });
}); 