import {JsonCompatibleValue, areJsonEqual} from '@augment-vir/common';

export type CreatePromiseCallback<ValueType> = () => Promise<ValueType>;

export type GetCachedPromiseInput<ValueType> = {
    createPromise: CreatePromiseCallback<ValueType>;
    triggers: JsonCompatibleValue;
};

export type CachedPromise<ValueType> = {
    /**
     * Only updates if the given trigger is different than the previous one. Returns the promise, so
     * it is chainable.
     */
    get: (inputs: GetCachedPromiseInput<ValueType>) => Promise<ValueType>;
};

export function createCachedPromise<ValueType>(): CachedPromise<ValueType> {
    let hasBeenSet = false;
    let lastValue: Promise<ValueType> | undefined;
    let lastTriggers: JsonCompatibleValue | undefined;

    function get(inputs: GetCachedPromiseInput<ValueType>): Promise<ValueType> {
        const shouldCalculate = !hasBeenSet || !areJsonEqual(inputs.triggers, lastTriggers);
        lastTriggers = inputs.triggers;

        if (shouldCalculate) {
            lastValue = inputs.createPromise();
        }
        hasBeenSet = true;
        return lastValue!;
    }

    return {
        get,
    };
}
