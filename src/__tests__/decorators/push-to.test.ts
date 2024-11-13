import { PushTo } from '../../decorators/push-to';

describe('@PushTo', () => {
  it('should collect property names into array', () => {
    class Test {
      fields: string[];
      otherFields: string[];

      @PushTo('fields')
      field1: string;

      @PushTo('fields')
      field2: string;

      @PushTo('otherFields')
      field3: string;
    }

    const test = new Test();
    expect(test.fields).toEqual(['field1', 'field2']);
    expect(test.otherFields).toEqual(['field3']);
  });

  it('should work with inheritance', () => {
    class Parent {
      fields: string[];

      @PushTo('fields')
      parentField: string;
    }

    class Child extends Parent {
      @PushTo('fields')
      childField: string;
    }

    const child = new Child();
    expect(child['fields']).toContain('parentField');
    expect(child['fields']).toContain('childField');
  });

  it('should maintain multiple arrays', () => {
    class Test {
      fields: string[];
      otherFields: string[];

      @PushTo('fields')
      @PushTo('otherFields')
      field: string;
    }

    const test = new Test();
    expect(test['fields']).toEqual(['field']);
    expect(test['otherFields']).toEqual(['field']);
  });
}); 