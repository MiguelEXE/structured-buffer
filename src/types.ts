import { SmartBuffer } from "smart-buffer";
import { ok as assert } from "assert/strict";

const isCountedType: unique symbol = Symbol("IS_COUNTED_TYPE");

type ParserFunction<T> = (smartBuf: SmartBuffer) => T;
type WriterFunction<T> = (smartBuf: SmartBuffer, value: T) => void;
interface CountedType<T> {
    count: number | undefined;
    parser: ParserFunction<T>;
    writer: WriterFunction<T>;
    [isCountedType]: any;
}
type SingleType<T> = (count: number) => CountedType<T>;
type Type<T> = SingleType<T> & CountedType<T>;
function createType<T>(parser: ParserFunction<T>, writer: WriterFunction<T>): Type<T> {
    function singleTypeFunc(count: number): CountedType<T>{
        assert(count > 0, new RangeError("Count needs to be greather than zero"));
        return {
            count,
            parser,
            writer,
            [isCountedType]: true
        }
    }
    singleTypeFunc.count = undefined;
    singleTypeFunc.parser = parser;
    singleTypeFunc.writer = writer;
    singleTypeFunc[isCountedType] = true;
    return singleTypeFunc;
}

export const uint8 = createType((smartBuf: SmartBuffer): number => {
    return smartBuf.readUInt8();
}, function(smartBuf, value){
    smartBuf.writeUInt8(value);
});
export const int8 = createType((smartBuf: SmartBuffer): number => {
    return smartBuf.readInt8();
}, function(smartBuf, value){
    smartBuf.writeInt8(value);
});
export const uint16_be = createType((smartBuf: SmartBuffer): number => {
    return smartBuf.readUInt16BE();
}, function(smartBuf, value){
    smartBuf.writeUInt16BE(value);
});
export const uint16_le = createType((smartBuf: SmartBuffer): number => {
    return smartBuf.readUInt16LE();
}, function(smartBuf, value){
    smartBuf.writeUInt16LE(value);
});
export const int16_le = createType((smartBuf: SmartBuffer): number => {
    return smartBuf.readInt16LE();
}, function(smartBuf, value){
    smartBuf.writeInt16LE(value);
});
export const int16_be = createType((smartBuf: SmartBuffer): number => {
    return smartBuf.readUInt16BE();
}, function(smartBuf, value){
    smartBuf.writeInt16BE(value);
});
export const uint32_be = createType((smartBuf: SmartBuffer): number => {
    return smartBuf.readUInt32BE();
}, function(smartBuf, value){
    smartBuf.writeUInt32BE(value);
});
export const uint32_le = createType((smartBuf: SmartBuffer): number => {
    return smartBuf.readUInt32LE();
}, function(smartBuf, value){
    smartBuf.writeUInt32LE(value);
});
export const int32_le = createType((smartBuf: SmartBuffer): number => {
    return smartBuf.readInt32LE();
}, function(smartBuf, value){
    smartBuf.writeInt32LE(value);
});
export const int32_be = createType((smartBuf: SmartBuffer): number => {
    return smartBuf.readInt32BE();
}, function(smartBuf, value){
    smartBuf.writeInt32BE(value);
});
export const uint64_be = createType((smartBuf: SmartBuffer): bigint => {
    return smartBuf.readBigUInt64BE();
}, function(smartBuf, value){
    smartBuf.writeBigUInt64BE(value);
});
export const uint64_le = createType((smartBuf: SmartBuffer): bigint => {
    return smartBuf.readBigUInt64LE();
}, function(smartBuf, value){
    smartBuf.writeBigUInt64LE(value);
});
export const int64_le = createType((smartBuf: SmartBuffer): bigint => {
    return smartBuf.readBigInt64LE();
}, function(smartBuf, value){
    smartBuf.writeBigInt64LE(value);
});
export const int64_be = createType((smartBuf: SmartBuffer): bigint => {
    return smartBuf.readBigInt64BE();
}, function(smartBuf, value){
    smartBuf.writeBigInt64BE(value);
});
export const char = createType((smartBuf: SmartBuffer): string => {
    return smartBuf.readString(1);
}, function(smartBuf, value){
    smartBuf.writeString(value);
});
export { isCountedType };

interface Struct<T extends string | number | bigint>{
    [key: string]: CountedType<T> | Struct<T>;
}

export type { Type, CountedType, ParserFunction, SingleType, Struct };