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
     * If has value calls `callback`; otherwise do nothing.
     * @param callback calling callback
     * @returns {this}
     */
    onsome(callback?: ((value: T) => void) | null): this;
    /**
     * If has value do nothing; otherwise calls `callback`.
     * @param callback calling callback
     * @returns {this}
     */
    onnone(callback?: (() => void) | null): this;
    /**
     * Calls `callback` always.
     * @param callback calling callback
     * @returns {this}
     */
    onboth(callback?: (() => void) | null): this;
    /**
     * If has value returns a new mapped option; otherwise returns none.
     * @param mapper calling mapper
     */
    map<TMapped>(mapper: (value: T) => TMapped): IOption<TMapped>;
    /**
     * If has value returns a result of `mapper` calling; otherwise returns none.
     * @param mapper calling mapper
     */
    do<TMapped>(mapper: (value: T) => IOption<TMapped>): IOption<TMapped>;
    /**
     * If has value returns value; otherwise returns `null`.
     */
    toNullable(): T | null;
    /**
     * If has value returns a new succeeded {@link IResult} with containing value; otherwise returns a new failed {@link IResult} with `error`.
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
     * @param value containing value
     */
    constructor(value: T) {
        this.value = value;
    }

    /**
     * Calls `callback` always.
     * @param callback calling callback
     * @returns {this}
     */
    onsome(callback?: (value: T) => void): this {
        if (callback) callback(this.value);

        return this;
    }
    /**
     * Do nothing always.
     * @returns {this}
     */
    onnone(): this {
        return this;
    }
    /**
     * Calls `callback` always.
     * @param callback calling callback
     * @returns {this}
     */
    onboth(callback?: () => void): this {
        if (callback) callback();

        return this;
    }
    /**
     * Returns a new mapped option always.
     * @param mapper calling mapper
     */
    map<TMapped>(mapper: (value: T) => TMapped): Some<TMapped> {
        return some(mapper(this.value));
    }
    /**
     * Returns a result of `mapper` calling always.
     * @param mapper calling mapper
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
     * Returns a new succeeded {@link IResult} with containing value always.
     * @param _ unused
     */
    toResult<TError>(_: TError): IResult<T, TError> {
        return Result.ok(this.value);
    }
}
/**
 * Wraps {@link Some.constructor}.
 * @param value containing value
 * @returns {Some<T>}
 */
export function some<T>(value: T): Some<T> {
    return new Some(value);
}
/**
 * The no value implementation of {@link IOption}
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
     * Creates a new {@link None} object.
     */
    constructor() {}

    /**
     * Do nothing always.
     * @returns {this}
     */
    onsome(): this {
        return this;
    }
    /**
     * Calls `callback` always.
     * @param callback calling callback
     * @returns {this}
     */
    onnone(callback?: () => void): this {
        if (callback) callback();

        return this;
    }
    /**
     * Calls `callback` always.
     * @param callback calling callback
     * @returns {this}
     */
    onboth(callback?: () => void): this {
        if (callback) callback();

        return this;
    }
    /**
     * Returns none always.
     * @param _ unused
     */
    map<TMapped>(_: (value: T) => TMapped): None<TMapped> {
        return none();
    }
    /**
     * Returns none always.
     * @param _ unused
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
     * Returns a new failed {@link IResult} with `error` always.
     */
    toResult<TError>(error: TError): IResult<T, TError> {
        return Result.error(error);
    }
}
/**
 * Wraps {@link None.constructor}.
 * @returns {None<T>}
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
     * @param propertyKeys an array of property keys; string array item shall be detected as dot-separated string containing property keys.
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
     * If `outer` contains one or more nones returns none; otherwise returns the last value of `outer`
     */
    export function unwrap<T>(outer: RecursedOption<T>): IOption<T> {
        return typeof outer === 'object' && 'hasValue' in outer && 'value' in outer
            ? outer.hasValue
                ? unwrap(outer.value)
                : none()
            : some(outer);
    }
}

export interface IResult<T = void, TError = any> {
    readonly value: T;
    readonly error: TError;
    readonly ok: boolean;

    onok(callback?: ((value: T) => void) | null): this;
    onerror(callback?: ((error: TError) => void) | null): this;
    onboth(callback?: (() => void) | null): this;
    map<TMapped>(mapper: (value: T) => TMapped): IResult<TMapped, TError>;
    do<TMapped>(mapper: (value: T) => IResult<TMapped, TError>): IResult<TMapped, TError>;
    getOrThrow(): T;
    throwWhenFailed(): void;
    toOption(): IOption<T>;
}
export class Result<T, TError> implements IResult<T, TError> {
    private readonly _value: T | TError;
    get value(): T {
        if (!this.ok) throw new Error('Failed result cannot get value.');

        return this._value as T;
    }
    get error(): TError {
        if (this.ok) throw new Error('Succeeded result cannot get error.');

        return this._value as TError;
    }
    readonly ok: boolean;

    private constructor(ok: boolean, value: T | TError) {
        this.ok = ok;
        this._value = value;
    }

    static ok<T, TError>(value: T): Result<T, TError> {
        return new Result<T, TError>(true, value);
    }
    static error<T, TError>(error: TError): Result<T, TError> {
        return new Result<T, TError>(false, error);
    }
    onok(callback?: (value: T) => void): this {
        if (this.ok && callback) callback(this.value);

        return this;
    }
    onerror(callback?: (error: TError) => void): this {
        if (!this.ok && callback) callback(this.error);

        return this;
    }
    onboth(callback?: () => void): this {
        if (callback) callback();

        return this;
    }
    map<TMapped>(mapper: (value: T) => TMapped): IResult<TMapped, TError> {
        return this.ok ? Result.ok(mapper(this.value)) : Result.error(this.error);
    }
    do<TMapped>(mapper: (value: T) => IResult<TMapped, TError>): IResult<TMapped, TError> {
        return this.ok ? mapper(this.value) : Result.error(this.error);
    }
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
    throwWhenFailed(): void {
        this.getOrThrow();
    }
    toOption(): IOption<T> {
        return this.ok ? some(this.value) : none();
    }
}

export interface IError {
    readonly message: string;
    readonly data: Readonly<any>;
    readonly inners: readonly IError[];

    format(indent?: number): string[];
    toError(): Error;
}
export class ResultError {
    readonly message: string;
    readonly data: any;
    readonly inners: ResultError[];

    constructor(message: string, data?: any, ...inners: (ResultError | string | null | undefined)[]) {
        this.message = message;
        this.data = {...data};
        this.inners = [];

        for (const error of inners)
            if (error)
                this.inners.push(typeof error === 'string'
                    ? new ResultError(error)
                    : error);
    }

    static fromObject(objectError: ObjectError): ResultError {
        const inners: (ResultError | string | null | undefined)[] =
            'inners' in objectError &&
            objectError.inners !== null &&
            objectError.inners!.length > 0
            ? objectError.inners!.map(inner => inner && typeof inner === 'object'
                ? ResultError.fromObject(inner)
                : inner as string)
            : [];
        const error = new ResultError(objectError.error, null, ...inners);
        Object.assign(error.data, objectError);
        delete error.data.error;
        
        if ('inners' in error.data) delete error.data.inners;

        return error;
    }
    toObject(): ObjectError {
        const objectError = {...this.data, error: this.message};

        if (this.inners.length > 0)
            Object.defineProperty(objectError, 'inners', {
                value: this.inners.map(inner => inner.toObject()),
                writable: true,
                enumerable: true,
                configurable: true
            });
        
        return objectError;
    }
    freeze(): IError {
        return new FreezedResultError(this);
    }
}
function escape(input: string): string {
    return input
        .replace('\\', '\\\\')
        .replace('\"', '\\"')
        .replace('\t', '\\t')
        .replace('\r', '\\r')
        .replace('\n', '\\n')
        .replace('\b', '\\b')
        .replace('\f', '\\f');
}
class FreezedResultError implements IError {
    static readonly INDENT = '  ';
    readonly message: string;
    readonly data: Readonly<any>;
    readonly inners: readonly IError[];

    constructor(builder: ResultError) {
        this.message = builder.message;
        this.data = Object.freeze({...builder.data});
        const inners: IError[] = [];

        for (const unfreezedError of builder.inners)
            inners.push(unfreezedError.freeze());
        
        this.inners = Object.freeze(inners);
    }

    format(indent?: number): string[] {
        indent ??= 0;
        const repeatedIndent = FreezedResultError.INDENT.repeat(indent);

        const lines: string[] = [`${repeatedIndent}! ${this.message}`];

        for (const key in this.data) {
            const valueAsLines = (JSON.stringify(this.data[key], null, FreezedResultError.INDENT) ?? 'undefined')
                .split('\n');

            lines.push(`${repeatedIndent}+ \"${escape(key)}\": ${valueAsLines[0]}`);
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

export type ObjectError = {
    error: string;
    inners?: (ObjectError | string | null | undefined)[] | null,
    [key: string]: any;
}