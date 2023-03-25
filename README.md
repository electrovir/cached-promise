# cached-promise

Cache promises when deeply-checked triggers change.

## Installation

```bash
npm i @electrovir/cached-promise
```

## Usage

See example code below:

<!-- example-link: src/readme-examples/main-example.example.ts -->

```TypeScript
import {createCachedPromise} from '@electrovir/cached-promise';

async function example() {
    //
    //  Basic Usage
    //

    // creates a cached promise with inner typeof number
    const myCachedPromise = createCachedPromise<number>();

    // get the promise
    const myNumber: number = await myCachedPromise.get({
        async createPromise() {
            return Math.random();
        },
        triggers: {trigger1: 'super', trigger2: 'easy'},
    });

    //
    // How "triggers" works
    //

    // this will not trigger a new promise because it deeply equals the already used triggers above
    const mySameNumber: number = await myCachedPromise.get({
        async createPromise() {
            return Math.random();
        },
        triggers: {trigger1: 'super', trigger2: 'easy'},
    });

    // this will trigger a new promise because the triggers input changed
    const newNewNumber: number = await myCachedPromise.get({
        async createPromise() {
            return Math.random();
        },
        triggers: {trigger1: 'super', trigger2: 'different easy'},
    });
}

example();
```
