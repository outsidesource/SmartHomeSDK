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
