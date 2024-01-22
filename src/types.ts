import { SmartBuffer } from "smart-buffer";

type ParserFunction<T> = (smartBuf: SmartBuffer) => T;
interface CountedType<T> {
    count: number;
    parser: ParserFunction<T>;
    isCountedType: boolean;
}
type SingleType<T> = (count: number) => CountedType<T>;
type Type<T> = SingleType<T> & CountedType<T>;
function createType<T>(type: ParserFunction<T>): Type<T> {
    function singleTypeFunc(count: number): CountedType<T>{
        return {
            count,
            parser: type,
            isCountedType: true
        }
    }
    singleTypeFunc.count = 1;
    singleTypeFunc.parser = type;
    singleTypeFunc.isCountedType = true;
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

interface Struct<T extends string | number | bigint>{
    [key: string]: CountedType<T> | Struct<T>;
}

export type { Type, CountedType, ParserFunction, SingleType, Struct };