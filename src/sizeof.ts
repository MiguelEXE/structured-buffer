import { isCountedType } from "./types";
import type { Struct, CountedType } from "./types";

/**
 * Returns the size of the `something`
 * @param something A struct or a type
 * @returns The size of the `something` in bytes
 */
function sizeof(something: Struct | CountedType<string | number | bigint | boolean>): number{
    if(isCountedType in something){
        // If the CountedType is a Type. count will always be undefined
        // (in another words. If the person uses `type` instead `type(size)`).
        // count will be undefined,
        // this is done so we dont treat `type(1)` as not being an array
        // or `type` being an array
        return something.byteLength * (something.count ?? 1);
    }
    let size = 0;
    for(const key in something){
        size += sizeof(something[key]);
    }
    return size;
}

export default sizeof;