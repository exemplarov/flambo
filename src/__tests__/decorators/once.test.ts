import { Once } from '../../decorators/once';

describe('@Once', () => {
  it('should memoize getter result', () => {
    let computeCount = 0;
    
    class Test {
      @Once()
      get value() {
        computeCount++;
        return 'computed';
      }
    }

    const test = new Test();
    expect(test.value).toBe('computed');
    expect(test.value).toBe('computed');
    expect(computeCount).toBe(1);
  });

  it('should throw error when used on non-getter', () => {
    expect(() => {
      class Test {
        // @ts-expect-error
        @Once()
        value = 'test';
      }
      new Test();
    }).toThrow('@Once can only be used on getters');
  });

  it('should maintain proper this context', () => {
    class Test {
      private secret = 'private';

      @Once()
      get value() {
        return this.secret;
      }
    }

    const test = new Test();
    expect(test.value).toBe('private');
  });
}); 