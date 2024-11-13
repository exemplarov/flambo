/**
 * Memoizes getter results after the first call
 * @returns PropertyDecorator
 */
export function Once() {
  return function (target: Object, propertyKey: string | symbol, descriptor: PropertyDescriptor) {
    const originalGetter = descriptor?.get;
    if (!originalGetter) {
      throw new Error('@Once can only be used on getters');
    }

    descriptor.get = function () {
      const result = originalGetter.call(this);
      Object.defineProperty(this, propertyKey, {
        value: result,
        configurable: true,
        enumerable: true,
      });
      return result;
    };
  };
} 