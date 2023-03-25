import {createCachedPromise} from '..';

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
