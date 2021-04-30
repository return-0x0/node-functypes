### v1.1.1

- Fixed result types of `Some<T>`/`None<T>` properties/methods:
  - `Some<T>.hasValue: boolean` -> `true`
  - `Some<T>.map<TMapped>(...): IOption<TMapped>` -> `Some<TMapped>`
  - `Some<T>.toNullable(): T | null` -> `T`
  - `Some<T>.hasValue: boolean` -> `false`
  - `Some<T>.map<TMapped>(...): IOption<TMapped>` -> `None<TMapped>`
  - `Some<T>.do<TMapped>(...): IOption<TMapped>` -> `None<TMapped>`
  - `Some<T>.toNullable(): T | null` -> `null`

### v1.1.0

- Upgraded `Option.get` function:
  - Changed signature: `get<T>(object: any, propertyKey?: any): IOption<T>` -> `get<T = any>(object: any, ...propertyKeys: any[]): IOption<T>`
  - Upgraded behavior:
    - Property keys can be passed in one row
    - String property keys shall be detected as dot-separated string containing property keys

### v1.0.0

Initial release.