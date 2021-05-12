### v2.3.0

- Changed `IResult` signature: `IResult<T = undefined, TError = any>` (since v1.0.0 was `IResult<T = void, TError = any>`)
- Changed `Result` signature: `Result<T = undefined, TError = any> implements IResult<T, TError>` (since v1.0.0 was `Result<T, TError> implements IResult<T, TError>`)

### v2.2.0

- Added `or` method to `IOption<T>` interface: `or(value: T): T`
- Updated `Some<T>` & `None<T>` implementations of `IOption<T>`

### v2.1.0

- Added `arrayToOption` function: `arrayToOption<T>(array: IOption<T>[]): IOption<T[]>`
- Added `arrayToResult` function: `arrayToResult<T, TError>(array: IResult<T, TError>[]): IResult<T[], TError>`

### v2.0.0

- Updated `Option.get` behavior: string property keys shall be detected as property names (since v1.1.0 was as dot-separated string containing property keys)
- Upgraded `ObjectError.inners` type: `readonly (IError | ObjectError | string | null | undefined)[] | null | undefined` (since v1.0.0 was `(ObjectError | string | null | undefined)[] | null | undefined`)
- Changed `ResultError` members:
  - `message`, `data`, and `inners` are mutable (since v1.0.0 were immutable).
  - Upgraded `toObject` behavior: when an inner error's `data` contain a property with `error` or `inners` then the inner error shall not be converted to `ObjectError`
  - Changed `constructor` signature: `consturctor(message: string, data?: Readonly<any> | null, ...inners: readonly (ResultError | string | null | undefined)[])` (since v1.0.0 was `consturctor(message: string, data?: any, ...inners: (ResultError | string | null | undefined)[])`)
  - Changed `fromObject` signature: `fromObject(object: Readonly<ObjectError>): ResultError` (since v1.0.0 was `fromObject(objectError: ObjectError)`)
- Changed `Result` members:
  - Changed `ok` signature: `static ok<T, TError = never>(value: T): Result<T, TError>` (since v1.0.0 was `static ok<T, TError>(value: T): Result<T, TError>`)
  - Changed `error` signature: `static error<TError, T = never>(error: TError): Result<T, TError>` (since v1.0.0 was `static error<T, TError>(error: TError): Result<T, TError>`)
- Documented:
  - `IResult<T>`
  - `Result<T>`
  - `IError`
  - `ResultError`
  - `ObjectError`

### v1.1.1

Fixed result types of `Some<T>`/`None<T>` members:
- `Some<T>.hasValue: true` (since v1.0.0 was `boolean`)
- `Some<T>.map<TMapped>(...): Some<TMapped>` (since v1.0.0 was `IOption<TMapped>`)
- `Some<T>.toNullable(): T` (since v1.0.0 was `T | null`)
- `None<T>.hasValue: false` (since v1.0.0 was `boolean`)
- `None<T>.map<TMapped>(...): None<TMapped>` (since v1.0.0 was `IOption<TMapped>`)
- `None<T>.do<TMapped>(...): None<TMapped>` (since v1.0.0 was `IOption<TMapped>`)
- `None<T>.toNullable(): null` (since v1.0.0 was `T | null`)

### v1.1.0

- Upgraded `Option.get`:
  - Changed signature: `get<T = any>(object: any, ...propertyKeys: any[]): IOption<T>` (since v1.0.0 was `get<T>(object: any, propertyKey?: any): IOption<T>`)
  - Upgraded behavior:
    - Property keys can be passed in one row
    - String property keys shall be detected as dot-separated string containing property keys
- Documented:
  - `IOption<T>`
  - `Option<T>`
  - `Option`
  - `RecursedOption<T>`
  - `some<T>`/`none<T>`

### v1.0.0

Initial release.