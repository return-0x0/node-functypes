### v1.1.0

- Upgraded `Option.get` function:
  - Changed signature: `get<T>(object: any, propertyKey?: any): IOption<T>` -> `get<T = any>(object: any, ...propertyKeys: any[]): IOption<T>`
  - Upgraded behavior:
    - Property keys can be passed in one row
    - String property keys shall be detected as dot-separated string containing property keys

### v1.0.0

- Namespaces:
  - `Option`:
    - `wrap<T>(nullable?: T | null): IOption<T>`
    - `get<T>(object: any, propertyKey?: any): IOption<T>`
    - `unwrap<T>(outer: RecursedOption<T>): IOption<T>`
- Interfaces:
  - `IOption<T>`
  - `IResult<T, TError>`
  - `IError`
- Classes:
  - `Some<T>`
  - `None<T>`
  - `Result<T, TError>`
  - `ResultError`
- Types:
  - `RecursedOption<T>`
  - `ObjectError`
- Functions:
  - `some<T>(value: T): Some<T>`
  - `none<T>(): None<T>`