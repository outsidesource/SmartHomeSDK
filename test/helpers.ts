import { createStubInstance, SinonStubbedInstance, SinonStubbedMember, StubbableType } from 'sinon'

export type StubbedClass<T> = SinonStubbedInstance<T> & T

export function createSinonStubInstance<T>(
  ctor: StubbableType<T>,
  overrides?: { [K in keyof T]?: SinonStubbedMember<T[K]> },
): StubbedClass<T> {
  const stub = createStubInstance<T>(ctor, overrides)
  return stub as unknown as StubbedClass<T>
}

/**
 * Converts a number to a string with leading zeros.
 * @param value The number, ideally an integer, to convert.
 * @param digits The number of desired characters.
 * @returns A string with the number desired characters (or possibly more if the number is too large.)
 */
export const toStringWithLeadingZeros = (value: number, digits: number) => String(value).padStart(digits, '0')

/**
 * The main purpose of this function is to unset or delete
 * `undefined` properties. During type-checking and at runtime, 
 * undefined values will behave as expected. However, since
 * most of the tests compare the result to a JSON fixture, 
 * and `undefined` cannot be used in JSON, the deep equal checks
 * correctly identify that a property is unset in JSON.
 */
export function removeUndefinedProps<T>(obj: T | undefined | null): T | undefined | null {
  return obj === undefined || obj === null
    ? obj
    : JSON.parse(JSON.stringify(obj))
}
