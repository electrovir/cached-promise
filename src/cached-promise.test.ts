import {randomString} from '@augment-vir/browser';
import {assertThrows} from '@augment-vir/browser-testing';
import {JsonCompatibleValue} from '@augment-vir/common';
import {assert} from '@open-wc/testing';
import {createCachedPromise} from './cached-promise';

describe(createCachedPromise.name, () => {
    function setupTest<T>(promiseCreator: () => Promise<T>) {
        let callCount = 0;
        const cachedPromise = createCachedPromise();

        return {
            getCallCount: () => callCount,
            getValue: ({triggers}: {triggers: JsonCompatibleValue}) => {
                return cachedPromise.get({
                    createPromise: () => {
                        callCount += 1;
                        return promiseCreator();
                    },
                    triggers,
                });
            },
        };
    }

    it('has correct test setup', async () => {
        const {getValue, getCallCount} = setupTest(async () => {
            return randomString();
        });

        assert.strictEqual(
            getCallCount(),
            0,
            'call count has already incremented before anything happened',
        );

        getValue({triggers: {}});

        assert.strictEqual(
            getCallCount(),
            1,
            'call count was not incremented once after a single get',
        );
    });

    it('skips creating a new promise if triggers are equal', async () => {
        const {getValue, getCallCount} = setupTest(async () => {
            return randomString();
        });

        const originalTriggers = {what: 5, who: 'me', hello: {there: 'I am nested'}};

        for (let index = 0; index < 100; index++) {
            getValue({triggers: {...originalTriggers}});
        }

        assert.strictEqual(getCallCount(), 1, 'call count should only have incremented once');
    });

    it('passes the inner value', async () => {
        const innerValue = randomString();
        const {getValue} = setupTest(async () => {
            return innerValue;
        });

        assert.strictEqual(
            await getValue({triggers: {}}),
            innerValue,
            'inner value was not propagated',
        );
    });

    it('propagates errors', async () => {
        const {getValue} = setupTest(async () => {
            throw new Error('intentional error');
        });

        await assertThrows(() => getValue({triggers: {}}), {
            matchConstructor: Error,
        });
    });
});
