import { SmartBuffer } from "smart-buffer";

const isCountedType: unique symbol = Symbol("IS_COUNTED_TYPE");

type ParserFunction<T> = (smartBuf: SmartBuffer) => T;
interface CountedType<T> {
    count: number | undefined;
    parser: ParserFunction<T>;
    [isCountedType]: any;
}
type SingleType<T> = (count: number) => CountedType<T>;
type Type<T> = SingleType<T> & CountedType<T>;
function createType<T>(type: ParserFunction<T>): Type<T> {
    function singleTypeFunc(count: number): CountedType<T>{
        if(count < 1){
            throw new RangeError("count cannot be less than 1");
        }
        return {
            count,
            parser: type,
            [isCountedType]: true
        }
    }
    singleTypeFunc.count = undefined;
    singleTypeFunc.parser = type;
    singleTypeFunc[isCountedType] = true;
    return singleTypeFunc;
}

export const uint8 = createType((smartBuf: SmartBuffer): number => {
    return smartBuf.readUInt8();
});
export const int8 = createType((smartBuf: SmartBuffer): number => {
    return smartBuf.readInt8();
});
export const uint16_be = createType((smartBuf: SmartBuffer): number => {
    return smartBuf.readUInt16BE();
});
export const uint16_le = createType((smartBuf: SmartBuffer): number => {
    return smartBuf.readUInt16LE();
});
export const int16_le = createType((smartBuf: SmartBuffer): number => {
    return smartBuf.readInt16LE();
});
export const int16_be = createType((smartBuf: SmartBuffer): number => {
    return smartBuf.readUInt16BE();
});
export const uint32_be = createType((smartBuf: SmartBuffer): number => {
    return smartBuf.readUInt32BE();
});
export const uint32_le = createType((smartBuf: SmartBuffer): number => {
    return smartBuf.readUInt32LE();
});
export const int32_le = createType((smartBuf: SmartBuffer): number => {
    return smartBuf.readInt32LE();
});
export const int32_be = createType((smartBuf: SmartBuffer): number => {
    return smartBuf.readUInt32BE();
});
export const uint64_be = createType((smartBuf: SmartBuffer): bigint => {
    return smartBuf.readBigInt64BE();
});
export const uint64_le = createType((smartBuf: SmartBuffer): bigint => {
    return smartBuf.readBigUInt64LE();
});
export const int64_le = createType((smartBuf: SmartBuffer): bigint => {
    return smartBuf.readBigInt64LE();
});
export const int64_be = createType((smartBuf: SmartBuffer): bigint => {
    return smartBuf.readBigInt64BE();
});
export const char = createType((smartBuf: SmartBuffer): string => {
    return smartBuf.readString(1);
});
export { isCountedType };

interface Struct<T extends string | number | bigint>{
    [key: string]: CountedType<T> | Struct<T>;
}

export type { Type, CountedType, ParserFunction, SingleType, Struct };