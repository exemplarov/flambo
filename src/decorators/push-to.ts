/**
 * Collects decorated property names into an array
 * @param arrayName - Target array name to push property keys to
 * @returns PropertyDecorator
 */
export function PushTo(arrayName: string) {
  return function (target: any, propertyKey: string | symbol) {
    // Initialize array if doesn't exist
    if (!target[arrayName]) {
      Object.defineProperty(target, arrayName, {
        value: [],
        writable: true,
        enumerable: true,
      });
    }

    target[arrayName].push(propertyKey);
  }
} 