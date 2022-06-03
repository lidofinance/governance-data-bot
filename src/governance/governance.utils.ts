import { Logger } from '@nestjs/common';

export function formatDate(date: Date | number | string): string | null {
  return date ? new Date(new Date(date).setSeconds(0)).toISOString() : null;
}

export function objectsIsEqual(obj1: object, obj2: object): boolean {
  return Object.keys(obj1).every((key) => {
    const result = obj1[key] === obj2[key];
    if (!result)
      new Logger().debug(
        `Field ${key} is different. Values: ${obj1[key]}, ${obj2[key]}`,
      );
    return result;
  });
}
