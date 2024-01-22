import { SmartBuffer } from "smart-buffer";

type ParserFunction<T> = (smartBuf: SmartBuffer) => T;
interface CountedType<T> {
    count: number;
    parser: ParserFunction<T>;
}
type SingleType<T> = (count: number) => CountedType<T>;
type Type<T> = SingleType<T> & CountedType<T>;
function createType<T>(type: ParserFunction<T>): Type<T> {
    function singleTypeFunc(count: number): CountedType<T>{
        return {
            count,
            parser: type
        }
    }
    singleTypeFunc.count = 1;
    singleTypeFunc.parser = type;
    return singleTypeFunc;
}

interface DeclaredTypes {
    uint8: Type<number>;
    int8: Type<number>

    uint16_le: Type<number>;
    uint16_be: Type<number>;
    int16_le: Type<number>;
    int16_be: Type<number>;

    uint32_le: Type<number>;
    uint32_be: Type<number>;
    int32_le: Type<number>;
    int32_be: Type<number>;
    
    uint64_le: Type<bigint>;
    uint64_be: Type<bigint>;
    int64_le: Type<bigint>;
    int64_be: Type<bigint>;

    char: Type<string>;
}

const types: DeclaredTypes = {
    uint8: createType((smartBuf: SmartBuffer): number => {
        return smartBuf.readUInt8();
    }),

    int8: createType((smartBuf: SmartBuffer): number => {
        return smartBuf.readInt8();
    }),

    uint16_be: createType((smartBuf: SmartBuffer): number => {
        return smartBuf.readUInt16BE();
    }),

    uint16_le: createType((smartBuf: SmartBuffer): number => {
        return smartBuf.readUInt16LE();
    }),

    int16_le: createType((smartBuf: SmartBuffer): number => {
        return smartBuf.readInt16LE();
    }),
    int16_be: createType((smartBuf: SmartBuffer): number => {
        return smartBuf.readUInt16BE();
    }),

    uint32_be: createType((smartBuf: SmartBuffer): number => {
        return smartBuf.readUInt32BE();
    }),
    uint32_le: createType((smartBuf: SmartBuffer): number => {
        return smartBuf.readUInt32LE();
    }),

    int32_le: createType((smartBuf: SmartBuffer): number => {
        return smartBuf.readInt32LE();
    }),
    int32_be: createType((smartBuf: SmartBuffer): number => {
        return smartBuf.readUInt32BE();
    }),

    uint64_be: createType((smartBuf: SmartBuffer): bigint => {
        return smartBuf.readBigInt64BE();
    }),
    uint64_le: createType((smartBuf: SmartBuffer): bigint => {
        return smartBuf.readBigUInt64LE();
    }),

    int64_le: createType((smartBuf: SmartBuffer): bigint => {
        return smartBuf.readBigInt64LE();
    }),
    int64_be: createType((smartBuf: SmartBuffer): bigint => {
        return smartBuf.readBigInt64BE();
    }),

    char: createType((smartBuf: SmartBuffer): string => {
        return smartBuf.readString(1);
    })
};
export default types;

interface Struct{
    [key: string]: CountedType<bigint> | CountedType<string> | CountedType<number> | Struct;
}

export type { Type, CountedType, ParserFunction, SingleType, Struct };