import {JsonCompatibleValue, areJsonEqual} from '@augment-vir/common';

type CreatePromiseCallback<ValueType> = () => Promise<ValueType>;

type GetParams<ValueType> = {
    createPromise: CreatePromiseCallback<ValueType>;
    triggers: JsonCompatibleValue;
};

export type CachedPromise<ValueType> = {
    /**
     * Only updates if the given trigger is different than the previous one. Returns the promise, so
     * it is chainable.
     */
    get: (inputs: GetParams<ValueType>) => Promise<ValueType>;
};

export function createCachedPromise<ValueType>(): CachedPromise<ValueType> {
    let hasBeenSet = false;
    let lastValue: Promise<ValueType> | undefined;
    let lastTriggers: JsonCompatibleValue | undefined;

    function get(inputs: GetParams<ValueType>): Promise<ValueType> {
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
