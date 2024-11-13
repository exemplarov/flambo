import { envCase } from '../../utils/env-case';

describe('envCase', () => {
  it('should convert camelCase to SCREAMING_SNAKE_CASE', () => {
    expect(envCase('camelCase')).toBe('CAMEL_CASE');
    expect(envCase('simple')).toBe('SIMPLE');
  });

  it('should not prefix first letter', () => {
    expect(envCase('HttpResponse')).toBe('HTTP_RESPONSE');
  });

  it('should handle edge cases', () => {
    expect(envCase('')).toBe('');
    expect(envCase('ABC')).toBe('A_B_C');
    expect(envCase('myXYZValue')).toBe('MY_X_Y_Z_VALUE');
  });
}); 