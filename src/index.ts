/**
 * The option inteface.
 */
export interface IOption<T> {
    /**
     * If has value returns containing value; otherwise throws an error.
     */
    readonly value: T;
    /**
     * If has value returns `true`; otherwise `false`.
     */
    readonly hasValue: boolean;
    
    /**
     * If has value and type of `callback` is not `undefined` and `callback` is not `null` calls `callback` always; otherwise do nothing.
     */
    onsome(callback?: ((value: T) => void) | null): this;
    /**
     * If does not have value and type of `callback` is not `undefined` and `callback` is not `null` calls `callback` always; otherwise do nothing.
     */
    onnone(callback?: (() => void) | null): this;
    /**
     * If type of `callback` is not `undefined` and `callback` is not `null` calls `callback` always; otherwise do nothing.
     */
    onboth(callback?: (() => void) | null): this;
    /**
     * If has value returns a new mapped option; otherwise returns none.
     */
    map<TMapped>(mapper: (value: T) => TMapped): IOption<TMapped>;
    /**
     * If has value returns a result of `mapper` calling; otherwise returns none.
     */
    do<TMapped>(mapper: (value: T) => IOption<TMapped>): IOption<TMapped>;
    /**
     * If has value returns value; otherwise returns `null`.
     */
    toNullable(): T | null;
    /**
     * If has value returns a new succeeded result with containing value; otherwise returns a new failed result with `error`.
     */
    toResult<TError>(error: TError): IResult<T, TError>;
}
/**
 * The containing value implementation of {@link IOption}
 */
export class Some<T> implements IOption<T> {
    /**
     * Returns containing value.
     */
    readonly value: T;
    /**
     * Returns `true` always.
     */
    get hasValue(): true {
        return true;
    }

    /**
     * Creates a new {@link Some} object.
     */
    constructor(value: T) {
        this.value = value;
    }

    /**
     * If type of `callback` is not `undefined` and `callback` is not `null` calls `callback` always; otherwise do nothing.
     */
    onsome(callback?: (value: T) => void): this {
        if (callback) callback(this.value);

        return this;
    }
    /**
     * Do nothing always.
     */
    onnone(): this {
        return this;
    }
    /**
     * If type of `callback` is not `undefined` and `callback` is not `null` calls `callback` always; otherwise do nothing.
     */
    onboth(callback?: () => void): this {
        if (callback) callback();

        return this;
    }
    /**
     * Returns a new mapped option always.
     */
    map<TMapped>(mapper: (value: T) => TMapped): Some<TMapped> {
        return some(mapper(this.value));
    }
    /**
     * Returns a result of `mapper` calling always.
     */
    do<TMapped>(mapper: (value: T) => IOption<TMapped>): IOption<TMapped> {
        return mapper(this.value);
    }
    /**
     * Returns containing value always.
     */
    toNullable(): T {
        return this.value;
    }
    /**
     * Returns a new succeeded result with containing value always.
     */
    toResult<TError>(_: TError): IResult<T, TError> {
        return Result.ok(this.value);
    }
}
/**
 * Wraps {@link Some.constructor}.
 */
export function some<T>(value: T): Some<T> {
    return new Some(value);
}
/**
 * The none implementation of {@link IOption}
 */
export class None<T> implements IOption<T> {
    /**
     * Throws an error always.
     */
    get value(): never {
        throw new Error('None value cannot be getted.');
    }
    /**
     * Returns `false` always.
     */
    get hasValue(): false {
        return false;
    }

    /**
     * Creates a new none.
     */
    constructor() {}

    /**
     * Do nothing always.
     */
    onsome(): this {
        return this;
    }
    /**
     * If type of `callback` is not `undefined` and `callback` is not `null` calls `callback` always; otherwise do nothing.
     */
    onnone(callback?: () => void): this {
        if (callback) callback();

        return this;
    }
    /**
     * If type of `callback` is not `undefined` and `callback` is not `null` calls `callback` always; otherwise do nothing.
     */
    onboth(callback?: () => void): this {
        if (callback) callback();

        return this;
    }
    /**
     * Returns none always.
     */
    map<TMapped>(_: (value: T) => TMapped): None<TMapped> {
        return none();
    }
    /**
     * Returns none always.
     */
    do<TMapped>(_: (value: T) => IOption<TMapped>): None<TMapped> {
        return none();
    }
    /**
     * Returns `null` always.
     */
    toNullable(): null {
        return null;
    }
    /**
     * Returns a new failed result with `error` always.
     */
    toResult<TError>(error: TError): IResult<T, TError> {
        return Result.error(error);
    }
}
/**
 * Wraps {@link None.constructor}.
 */
export function none<T>(): None<T> {
    return new None<T>();
}

/**
 * The recursed option type.
 */
export type RecursedOption<T> = T | IOption<RecursedOption<T>>;
/**
 * Contains options utilities.
 */
export namespace Option {
    /**
     * If `nullable` is null returns none; otherwise a new option with `nullable` as value.
     */
    export function wrap<T>(nullable?: T | null): IOption<T> {
        return nullable ? some(nullable) : none();
    }
    /**
     * Walks to object tree of `object` and if found required property returns a new option with found property as value; otherwise returns none.
     */
    export function get<T = any>(object: any, ...propertyKeys: any[]): IOption<T> {
        propertyKeys = propertyKeys
            .map(key => typeof key === 'string' ? key.split('.') : [key])
            .reduce((sum, wrapped) => { sum.push(...wrapped); return sum; });

        for (const propertyKey of propertyKeys) {
            if (typeof object !== 'object' || !(propertyKey in object)) return none();

            object = object[propertyKey];
        }

        return some<T>(object as T);
    }
    /**
     * If `outer` contains one or more nones returns none; otherwise returns the last value of `outer`.
     */
    export function unwrap<T>(outer: RecursedOption<T>): IOption<T> {
        return typeof outer === 'object' && 'hasValue' in outer && 'value' in outer
            ? outer.hasValue
                ? unwrap(outer.value)
                : none()
            : some(outer);
    }
}

/**
 * The result interface.
 */
export interface IResult<T = void, TError = any> {
    /**
     * If suceeded returns containing value; otherwise throws an error.
     */
    readonly value: T;
    /**
     * If suceeded throws an error; otherwise returns containing error.
     */
    readonly error: TError;
    /**
     * If contain value returns `true`; otherwise `false`.
     */
    readonly ok: boolean;

    /**
     * If suceeded and type of `callback` is not `undefined` and `callback` is not `null` calls `callback`; otherwise do nothing.
     */
    onok(callback?: ((value: T) => void) | null): this;
    /**
     * If not suceeded and type of `callback` is not `undefined` and `callback` is not `null` calls `callback`; otherwise do nothing.
     */
    onerror(callback?: ((error: TError) => void) | null): this;
    /**
     * If type of `callback` is not `undefined` and `callback` is not `null` calls `callback` always; otherwise do nothing.
     */
    onboth(callback?: (() => void) | null): this;
    /**
     * Returns mapped result.
     */
    map<TMapped>(mapper: (value: T) => TMapped): IResult<TMapped, TError>;
    /**
     * If succeeded returns result of `mapper`; otherwise returns failed mapped result.
     */
    do<TMapped>(mapper: (value: T) => IResult<TMapped, TError>): IResult<TMapped, TError>;
    /**
     * If succeeded returns containing value; otherwise throws converted to {@link Error} `error`.
     */
    getOrThrow(): T;
    /**
     * If failed throws converted to {@link Error} `error`; otherwise do nothing.
     */
    throwWhenFailed(): void;
    /**
     * If succeeded returns a new option with containing value; otherwise returns none.
     */
    toOption(): IOption<T>;
}
/**
 * The default implementation of {@link IResult}.
 */
export class Result<T, TError> implements IResult<T, TError> {
    private readonly _value: T | TError;
    /**
     * If suceeded returns containing value; otherwise throws an error.
     */
    get value(): T {
        if (!this.ok) throw new Error('Failed result cannot get value.');

        return this._value as T;
    }
    /**
     * If suceeded throws an error; otherwise returns containing error.
     */
    get error(): TError {
        if (this.ok) throw new Error('Succeeded result cannot get error.');

        return this._value as TError;
    }
    /**
     * If contain value returns `true`; otherwise `false`.
     */
    readonly ok: boolean;

    private constructor(ok: boolean, value: T | TError) {
        this.ok = ok;
        this._value = value;
    }

    /**
     * Creates a new succeeded result with `value` as containing value.
     */
    static ok<T, TError = never>(value: T): Result<T, TError> {
        return new Result<T, TError>(true, value);
    }
    /**
     * Creates a new failed result with `error` as containging error.
     */
    static error<TError, T = never>(error: TError): Result<T, TError> {
        return new Result<T, TError>(false, error);
    }
    /**
     * If suceeded and type of `callback` is not `undefined` and `callback` is not `null` calls `callback`; otherwise do nothing.
     */
    onok(callback?: (value: T) => void): this {
        if (this.ok && callback) callback(this.value);

        return this;
    }
    /**
     * If not suceeded and type of `callback` is not `undefined` and `callback` is not `null` calls `callback`; otherwise do nothing.
     */
    onerror(callback?: (error: TError) => void): this {
        if (!this.ok && callback) callback(this.error);

        return this;
    }
    /**
     * If type of `callback` is not `undefined` and `callback` is not `null` calls `callback` always; otherwise do nothing.
     */
    onboth(callback?: () => void): this {
        if (callback) callback();

        return this;
    }
    /**
     * Returns mapped result.
     */
    map<TMapped>(mapper: (value: T) => TMapped): IResult<TMapped, TError> {
        return this.ok ? Result.ok(mapper(this.value)) : Result.error(this.error);
    }
    /**
     * If succeeded returns result of `mapper`; otherwise returns failed mapped result.
     */
    do<TMapped>(mapper: (value: T) => IResult<TMapped, TError>): IResult<TMapped, TError> {
        return this.ok ? mapper(this.value) : Result.error(this.error);
    }
    /**
     * If succeeded returns containing value; otherwise throws converted to {@link Error} `error`.
     */
    getOrThrow(): T {
        if (this.ok) return this.value;
        
        if (typeof this.error === 'object') {
            if ('toError' in this.error)
                throw (this.error as any).toError() as Error;
            if ('error' in this.error)
                throw new Error((this.error as any).error as string);
        }
        
        throw new Error(new String(this.error).toString());
    }
    /**
     * If failed throws converted to {@link Error} `error`; otherwise do nothing.
     */
    throwWhenFailed(): void {
        this.getOrThrow();
    }
    /**
     * If succeeded returns a new option with containing value; otherwise returns none.
     */
    toOption(): IOption<T> {
        return this.ok ? some(this.value) : none();
    }
}

/**
 * If any option is none returns none; otherwise returns mapped array.
 */
export function arrayToOption<T>(array: IOption<T>[]): IOption<T[]> {
    return array.some(option => !option.hasValue)
        ? none()
        : some(array.map(option => option.value));
}
/**
 * If any result is failed returns a new failed result with first result error; otherwise returns mapped array.
 */
export function arrayToResult<T, TError>(array: IResult<T, TError>[]): IResult<T[], TError> {
    const failedResultIndex = array.findIndex(result => !result.ok);

    return failedResultIndex === -1
        ? Result.ok(array.map(result => result.value))
        : Result.error(array[failedResultIndex].error);
}

/**
 * The default result error interface.
 */
export interface IError {
    /**
     * The error message.
     */
    readonly message: string;
    /**
     * The error data.
     */
    readonly data: Readonly<any>;
    /**
     * The inner errors.
     */
    readonly inners: readonly IError[];

    /**
     * Returns formatted `this` as lines. Every line has indent that is basic indent repeated `indent` times.
     * @param indent Indent repetition count (`0` by default).
     */
    format(indent?: number): string[];
    /**
     * Converts `this` to {@link Error}.
     */
    toError(): Error;
}
/**
 * The result error class.
 */
export class ResultError {
    /**
     * The error message.
     */
    message: string;
    /**
     * The error data.
     */
    data: any;
    /**
     * The inner errors.
     */
    inners: ResultError[];

    /**
     * Creates a new result error.
     */
    constructor(message: string, data?: Readonly<any> | null, ...inners: readonly (ResultError | string | null | undefined)[]) {
        this.message = message;
        this.data = {...data};
        this.inners = [];

        for (const error of inners)
            if (error)
                this.inners.push(typeof error === 'string'
                    ? new ResultError(error)
                    : error);
    }

    private static toResultError(error: IError): ResultError {
        const inners = error.inners.map(inner => ResultError.toResultError(inner));

        return new ResultError(error.message, error.data, ...inners);
    }
    /**
     * Converts object error to result error.
     */
    static fromObject(object: Readonly<ObjectError>): ResultError {
        const inners: (ResultError | string | null | undefined)[] =
            'inners' in object &&
            object.inners !== null &&
            object.inners!.length > 0
            ? object.inners!.map(inner =>
                typeof inner !== 'undefined' && inner != null && typeof inner === 'object'
                    ? 'error' in inner
                        ? ResultError.fromObject(inner)
                        : this.toResultError(inner as IError)
                    : inner as string)
            : [];
        const error = new ResultError(object.error, null, ...inners);
        Object.assign(error.data, object);
        delete error.data.error;
        
        if ('inners' in error.data) delete error.data.inners;

        return error;
    }
    /**
     * Converts `this` to object error.
     */
    toObject(): ObjectError {
        const object = {...this.data, error: this.message};

        if (this.inners.length > 0)
            Object.defineProperty(object, 'inners', {
                value: this.inners.map(inner =>
                    'error' in inner.data || 'inners' in inner.data
                        ? inner
                        : inner.toObject()),
                writable: true,
                enumerable: true,
                configurable: true
            });
        
        return object;
    }
    /**
     * Converts `this` to error.
     */
    freeze(): IError {
        return new FreezedResultError(this);
    }
}
class FreezedResultError implements IError {
    static readonly INDENT = '  ';
    readonly message: string;
    readonly data: Readonly<any>;
    readonly inners: readonly IError[];

    constructor(builder: Readonly<ResultError>) {
        this.message = builder.message;
        this.data = Object.freeze({...builder.data});
        const inners: IError[] = [];

        for (const unfreezedError of builder.inners)
            inners.push(unfreezedError.freeze());
        
        this.inners = Object.freeze(inners);
    }

    static escape(input: string): string {
        return input
            .replace('\\', '\\\\')
            .replace('\"', '\\"')
            .replace('\t', '\\t')
            .replace('\r', '\\r')
            .replace('\n', '\\n')
            .replace('\b', '\\b')
            .replace('\f', '\\f');
    }
    format(indent?: number): string[] {
        indent ??= 0;
        const repeatedIndent = FreezedResultError.INDENT.repeat(indent);

        const lines: string[] = [`${repeatedIndent}! ${this.message}`];

        for (const key in this.data) {
            const valueAsLines = (JSON.stringify(this.data[key], null, FreezedResultError.INDENT) ?? 'undefined')
                .split('\n');

            lines.push(`${repeatedIndent}+ \"${FreezedResultError.escape(key)}\": ${valueAsLines[0]}`);
            lines.push(...valueAsLines.slice(1));
        }
        for (const inner of this.inners)
            lines.push(...inner.format(indent)
                .map(line => FreezedResultError.INDENT + line));
        
        return lines;
    }
    toString(newLine?: string): string {
        return this.format().join(newLine ?? '\n');
    }
    toError(): Error {
        return new Error(this.message);
    }
}

/**
 * The object error type.
 */
export type ObjectError = {
    /**
     * The error message.
     */
    error: string;
    /**
     * The inner errors.
     */
    inners?: readonly (IError | ObjectError | string | null | undefined)[] | null;
    [key: string]: any;
}