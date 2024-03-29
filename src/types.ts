import { SmartBuffer } from "smart-buffer";
import { ok as assert } from "assert/strict";

const isCountedType: unique symbol = Symbol("IS_COUNTED_TYPE");

type ParserFunction<T> = (smartBuf: SmartBuffer) => T;
type WriterFunction<T> = (smartBuf: SmartBuffer, value: T) => void;
interface CountedType<T> {
    count: number | undefined;
    parser: ParserFunction<T>;
    writer: WriterFunction<T>;
    valueType: "string" | "bigint" | "number" | "boolean";
    byteLength: number;
    [isCountedType]: any;
}
type SingleType<T> = (count: number) => CountedType<T>;
type Type<T> = SingleType<T> & CountedType<T>;
function createType<T>(parser: ParserFunction<T>, writer: WriterFunction<T>, valueType: "string" | "bigint" | "number" | "boolean", byteLength: number): Type<T> {
    function singleTypeFunc(count: number): CountedType<T>{
        assert(count > 0, new RangeError("Count needs to be greather than zero"));
        return {
            count,
            parser,
            writer,
            valueType,
            byteLength,
            [isCountedType]: true
        }
    }
    singleTypeFunc.count = undefined;
    singleTypeFunc.parser = parser;
    singleTypeFunc.writer = writer;
    singleTypeFunc.valueType = valueType;
    singleTypeFunc.byteLength = byteLength;
    singleTypeFunc[isCountedType] = true;
    return singleTypeFunc;
}

const __true = 1;
const __false = 0;

/**
 * Unsigned 8-bit integer
 */
export const uint8 = createType((smartBuf: SmartBuffer): number => {
    return smartBuf.readUInt8();
}, function(smartBuf, value){
    smartBuf.writeUInt8(value);
}, "number", 1);
/**
 * Signed 8-bit integer
 */
export const int8 = createType((smartBuf: SmartBuffer): number => {
    return smartBuf.readInt8();
}, function(smartBuf, value){
    smartBuf.writeInt8(value);
}, "number", 1);
/**
 * Unsigned 16-bit long big endian integer
 */
export const uint16_be = createType((smartBuf: SmartBuffer): number => {
    return smartBuf.readUInt16BE();
}, function(smartBuf, value){
    smartBuf.writeUInt16BE(value);
}, "number", 2);
/**
 * Unsigned 16-bit long little endian integer
 */
export const uint16_le = createType((smartBuf: SmartBuffer): number => {
    return smartBuf.readUInt16LE();
}, function(smartBuf, value){
    smartBuf.writeUInt16LE(value);
}, "number", 2);
/**
 * Signed 16-bit long little endian integer
 */
export const int16_le = createType((smartBuf: SmartBuffer): number => {
    return smartBuf.readInt16LE();
}, function(smartBuf, value){
    smartBuf.writeInt16LE(value);
}, "number", 2);
/**
 * Signed 16-bit long big endian integer
 */
export const int16_be = createType((smartBuf: SmartBuffer): number => {
    return smartBuf.readUInt16BE();
}, function(smartBuf, value){
    smartBuf.writeInt16BE(value);
}, "number", 2);
/**
 * Unsigned 32-bit long big endian integer
 */
export const uint32_be = createType((smartBuf: SmartBuffer): number => {
    return smartBuf.readUInt32BE();
}, function(smartBuf, value){
    smartBuf.writeUInt32BE(value);
}, "number", 4);
/**
 * Unsigned 32-bit long little endian integer
 */
export const uint32_le = createType((smartBuf: SmartBuffer): number => {
    return smartBuf.readUInt32LE();
}, function(smartBuf, value){
    smartBuf.writeUInt32LE(value);
}, "number", 4);
/**
 * Unsigned 32-bit long little endian integer
 */
export const int32_le = createType((smartBuf: SmartBuffer): number => {
    return smartBuf.readInt32LE();
}, function(smartBuf, value){
    smartBuf.writeInt32LE(value);
}, "number", 4);
/**
 * Signed 32-bit long big endian integer
 */
export const int32_be = createType((smartBuf: SmartBuffer): number => {
    return smartBuf.readInt32BE();
}, function(smartBuf, value){
    smartBuf.writeInt32BE(value);
}, "number", 4);
/**
 * Unsigned 64-bit long big endian integer
 */
export const uint64_be = createType((smartBuf: SmartBuffer): bigint => {
    return smartBuf.readBigUInt64BE();
}, function(smartBuf, value){
    smartBuf.writeBigUInt64BE(value);
}, "bigint", 8);
/**
 * Unsigned 64-bit long little endian integer
 */
export const uint64_le = createType((smartBuf: SmartBuffer): bigint => {
    return smartBuf.readBigUInt64LE();
}, function(smartBuf, value){
    smartBuf.writeBigUInt64LE(value);
}, "bigint", 8);
/**
 * Signed 64-bit long little endian integer
 */
export const int64_le = createType((smartBuf: SmartBuffer): bigint => {
    return smartBuf.readBigInt64LE();
}, function(smartBuf, value){
    smartBuf.writeBigInt64LE(value);
}, "bigint", 8);
/**
 * Signed 64-bit long big endian integer
 */
export const int64_be = createType((smartBuf: SmartBuffer): bigint => {
    return smartBuf.readBigInt64BE();
}, function(smartBuf, value){
    smartBuf.writeBigInt64BE(value);
}, "bigint", 8);
/**
 * A string version of `int8`
 */
export const char = createType((smartBuf: SmartBuffer): string => {
    return smartBuf.readString(1);
}, function(smartBuf, value){
    smartBuf.writeString(value);
}, "string", 1);
/**
 * Standard C99 bool
 */
export const bool = createType((smartBuf: SmartBuffer): boolean => { // Reading or writing UInt8 doesnt matter since we are comparing with not strict equal operator/writing 1 (__true) or 0 (__false)
    return smartBuf.readUInt8() !== __false;
}, function(smartBuf, value){
    smartBuf.writeUInt8(value ? __true : __false);
}, "boolean", 1);
export { isCountedType };

interface Struct{
    [key: string]: CountedType<string> | CountedType<bigint> | CountedType<number> | CountedType<boolean> | Struct;
}

export type { Type, CountedType, ParserFunction, SingleType, Struct };