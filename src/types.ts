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
/**
 * PDP-11 (UNIX) Unsigned 32-bit integer
 * 
 * PDP-11 stores both uint32/int32 (longs) into BE and uint16/int16 (shorts) into LE
 * 
 * This creates a situation where the long is split into
 * two shorts which are stored in BE (high 16 bit short first, low 16 bit short last).
 * BUT: the shorts are stored as LE
 * 
 * This is rarely used because of it's weirdeness, but it is used in CPIO archive format (used in linux kernel bootup)
 */
export const pdp_uint32 = createType((smartBuf: SmartBuffer): number => {
    const highShort = smartBuf.readUInt16LE();
    const lowShort = smartBuf.readUInt16LE();
    return (highShort << 16) | lowShort;
}, function(smartBuf, value){
    assert(value > 0 && value < 0xFFFFFFFF, new Error("Value must be greather than zero and smaller than 4294967295"));
    value = Math.round(value);
    const high = value >>> 16;
    const low = value & 0x0000FFFF;
    smartBuf.writeUInt16LE(high);
    smartBuf.writeUInt16LE(low);
}, "number", 4);
/**
 * PDP-11 (UNIX) Signed 32-bit integer
 * 
 * PDP-11 stores both uint32/int32 (longs) into BE and uint16/int16 (shorts) into LE
 * 
 * This creates a situation where the long is split into
 * two shorts which are stored in BE (high 16 bit short first, low 16 bit short last).
 * BUT: the shorts are stored as LE
 * 
 * This is rarely used because of it's weirdeness, but it is used in CPIO archive format (used in linux kernel bootup)
 */
export const pdp_int32 = createType((smartBuf: SmartBuffer): number => {
    const highShort = smartBuf.readUInt16LE();
    const lowShort = smartBuf.readUInt16LE();
    const sign = 1 - ((highShort & 0x8000) >> 15) * 2; // ((highShort & 0x8000) >> 15) * 2 will become 2 if the sign bit is true, otherwise it will become 0
    return (((highShort & 0x7FFF) << 16) | lowShort) * sign;
}, function(smartBuf, value){
    assert(value > -2147483647 && value < 2147483647, new Error("Value must be greather than -2147483647 and smaller than 2147483647"));
    value = Math.round(value);

    const positiveValue = Math.abs(value);
    const high = (positiveValue >> 16) | (value < 0 ? 0x8000 : 0); // set the sign bit if the value is smaller than zero
    const low = positiveValue & 0x0000FFFF;
    smartBuf.writeUInt16LE(high);
    smartBuf.writeUInt16LE(low);
}, "number", 4);
export { isCountedType };

interface Struct{
    [key: string]: CountedType<string> | CountedType<bigint> | CountedType<number> | CountedType<boolean> | Struct;
}

export type { Type, CountedType, ParserFunction, SingleType, Struct };