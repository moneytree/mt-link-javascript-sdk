type SnakeCase<S extends string> = S extends `${infer Head}${infer Tail}` ? Head extends Uppercase<Head> ? `_${Lowercase<Head>}${SnakeCase<Tail>}` : `${Head}${SnakeCase<Tail>}` : S;
export declare function snakeCase<S extends string>(str: S): SnakeCase<S>;
export {};
