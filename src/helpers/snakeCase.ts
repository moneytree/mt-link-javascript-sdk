type SnakeCase<S extends string> = S extends `${infer Head}${infer Tail}`
  ? Head extends Uppercase<Head>
    ? `_${Lowercase<Head>}${SnakeCase<Tail>}`
    : `${Head}${SnakeCase<Tail>}`
  : S;

/**
 * Converts a camelCase string to snake_case  string.
 * e.g., "testString" -> "test_string"
 */
export function snakeCase<S extends string>(str: S): SnakeCase<S> {
  return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`) as SnakeCase<S>;
}
