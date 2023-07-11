import { Logger } from '@nestjs/common';

export function formatDate(date: Date | number | string): string | null {
  return date ? new Date(new Date(date).setSeconds(0, 0)).toISOString() : null;
}

export function objectsAreEqual(obj1: object, obj2: object, ignored: string[] = []): boolean {
  return Object.keys(obj1).every((key) => {
    if (ignored.includes(key)) return true;
    const result = obj1[key] === obj2[key];
    if (!result)
      new Logger().debug(
        `Field ${key} is different. Values: ${obj1[key]}, ${obj2[key]}\n` +
          `Object keys are: ${Object.keys(obj1)}`,
      );
    return result;
  });
}

export class CaseInsensitiveMap<VT> extends Map<string, VT> {
  get(key: string): VT {
    return super.get(key.toLowerCase());
  }

  set(key: string, value: VT): this {
    return super.set(key.toLowerCase(), value);
  }

  has(key: string): boolean {
    return super.has(key.toLowerCase());
  }

  delete(key: string): boolean {
    return super.delete(key.toLowerCase());
  }
}
