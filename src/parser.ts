import { SmartBuffer } from "smart-buffer";
import type {CountedType, Struct} from "./types";

import {uint8} from "./types"

function parse<T extends string | number | bigint>(struct: Struct<T>, buf: Buffer){
    const smartBuf = SmartBuffer.fromBuffer(buf);
    const keys = Object.keys(struct);
    for(const key of keys){
        const value = struct[key];
        if(value.isCountedType === true){ // gore code but works
            
        }
    }
}

parse({
    hello: 
}, Buffer.of(20, 40));