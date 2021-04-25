# Examples

## Example #1: Options
```javascript
let _some = some(13);
let _none = none();

function getNullable() {
    const number = Math.random();

    return number < 0.5 ? null : number;
}

Option.wrap(getNullable())
    .onsome(value => console.log(value))
    .onnone(() => console.log('none'))
    .onboth(() => console.log('tested'));

const users = {
    id1: {
        theme: null // 'light' | 'dark' | null, where null - inherit // when nullable is using null value is unavailable
    }
}

function getUser(id) {
    return Option.get(users, id);
}
function getUserTheme(user) {
    return Option.get(user, 'theme');
}

let globalTheme = 'light';

some(1)
    .map(id => typeof id === 'number' ? `id${Math.floor(id)}` : id)
    .do(id => getUser(id))
    .do(user => getUserTheme(user))
    .map(theme => theme ?? globalTheme)
    .onsome(theme => console.log(theme))
    .onnone(() => console.log('Not found.'))
    .onboth(() => console.log('Theme searching was ended.'));
// logs:
// light
// Theme searching was ended.

// OR
Option.unwrap(some(1)
    .map(id => typeof id === 'number' ? `id${Math.floor(id)}` : id)
    .map(id => getUser(id))
    .map(id => id.map(user => getUserTheme(user)))
    .map(id => id.map(user => user.map(theme => theme ?? globalTheme))))
    .onsome(theme => console.log(theme))
    .onnone(() => console.log('Not found.'))
    .onboth(() => console.log('Theme searching was ended.'));
```

## Example #2: Results
```javascript
const NUMBER_PATTERN = /^-?\d+$/;

function parseInteger(input) {
    if (!input.test(NUMBER_PATTERN)) return Result.error('The input is not a number.');

    return Result.ok(parseInt(input));
}

let x = parseInteger('abc').getOrThrow(); // throws `new Error('The input is not a number.')`
let y = parseInteger('123').getOrThrow(); // returns `123`

parseInteger('123abc')
    .onok(value => console.log(value))
    .onerror(() => console.log('error'))
    .onboth(() => console.log('parsing ended'));
// logs:
// error
// parsing ended

const data = {
    // ...
    id1: 'Data with id #1'
    // ...
};

function fetch(id) {
    return Option.wrap(data[id]).toResult('Not found.');
}

parseInteger('123')
    .map(value => `id${value}`)
    .do(id => fetch(id))
    .onok(data => console.log(`fetched data: ${data}`))
    .onerror(error => console.error(error)); // logs error 'Not found.'
```

## Example #3: Result Errors
```javascript
const error = new ResultError('some error', {
    key1: 'value1',
    key2: {key: 'value2'},
    '"': 'special\tvalue'},
    'inner #1', // shall be converted to `ResultError`
    null, // shall not be passed
    new ResultError('inner #2', null,
        'inner #3'))
    .freeze(); // converts mutable error to immutable

Result.error(error);

console.log(error.toString());
// logs:
// ! some error
// + "key1": "value1"
// + "key2": {
//   "key": "value2"
// }
// + "\"": "special\tvalue"
//   ! inner #1
//   ! inner #2
//     ! inner #3
```

## Example #4: Object Errors
```javascript
const error = {
    error: 'Error message.', // error message // required
    // error data
    key1: 'value1',
    key2: {key: 'value2'},
    // inner errors
    inners: [
        'Error message can be putter as a string.',
        {
            error: '...',
            string: 'string',
            number: 13,
            boolean: true,
            null: null,
            undefined: undefined
        }
    ]
};

console.log(ResultError.fromObject(error).freeze().toString());
// logs:
// ! Error message.
// + "key1": "value1"
// + "key2": {
//    "key": "value2"
// }
//   ! Error message can be putted as a string.
//   ! ...
//   + "number": 13
//   + "boolean": "string"
//   + "null": null,
//   + "undefined": undefined
```