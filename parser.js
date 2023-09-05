const {SmartBuffer} = require("smart-buffer");
const generic = require("./generic.js");

const parsers = {
    /**
     * 8-bit signed integer
     * @param {SmartBuffer} sbuf 
     * @returns {number}
     */
    int8(sbuf){
        return sbuf.readInt8();
    },
    /**
     * 16-bit signed little endian integer
     * @param {SmartBuffer} sbuf 
     * @returns {number}
     */
    int16_le(sbuf){
        return sbuf.readInt16LE();
    },
    /**
     * 32-bit signed little endian integer
     * @param {SmartBuffer} sbuf 
     * @returns {number}
     */
    int32_le(sbuf){
        return sbuf.readInt32LE();
    },
    /**
     * 64-bit signed little endian integer
     * @param {SmartBuffer} sbuf 
     * @returns {BigInt}
     */
    int64_le(sbuf){
        return sbuf.readBigInt64LE();
    },
    /**
     * 16-bit signed big endian integer
     * @param {SmartBuffer} sbuf 
     * @returns {number}
     */
    int16_be(sbuf){
        return sbuf.readInt16BE();
    },
    /**
     * 32-bit signed bit endian integer
     * @param {SmartBuffer} sbuf 
     * @returns {number}
     */
    int32_be(sbuf){
        return sbuf.readInt32BE();
    },
    /**
     * 64-bit signed bit endian integer
     * @param {SmartBuffer} sbuf 
     * @returns {BigInt}
     */
    int64_be(sbuf){
        return sbuf.readBigInt64BE();
    },

    /**
     * 8-bit unsigned integer
     * @param {SmartBuffer} sbuf 
     * @returns {number}
     */
    uint8(sbuf){
        return sbuf.readUInt8();
    },
    /**
     * 16-bit unsigned little endian integer
     * @param {SmartBuffer} sbuf 
     * @returns {number}
     */
    uint16_le(sbuf){
        return sbuf.readUInt16LE();
    },
    /**
     * 32-bit unsigned little endian integer
     * @param {SmartBuffer} sbuf 
     * @returns {number}
     */
    uint32_le(sbuf){
        return sbuf.readUInt32LE();
    },
    /**
     * 64-bit unsigned little endian integer
     * @param {SmartBuffer} sbuf 
     * @returns {BigInt}
     */
    uint64_le(sbuf){
        return sbuf.readBigUInt64LE();
    },
    /**
     * 16-bit unsigned big endian integer
     * @param {SmartBuffer} sbuf 
     * @returns {number}
     */
    uint16_be(sbuf){
        return sbuf.readUInt16BE();
    },
    /**
     * 32-bit unsigned big endian integer
     * @param {SmartBuffer} sbuf 
     * @returns {number}
     */
    uint32_be(sbuf){
        return sbuf.readUInt32BE();
    },
    /**
     * 64-bit unsigned big endian integer
     * @param {SmartBuffer} sbuf 
     * @returns {BigInt}
     */
    uint64_be(sbuf){
        return sbuf.readBigUInt64BE();
    },
};
/**
 * Parses an integer by it's type
 * @param {SmartBuffer} sbuf Smart buffer instance
 * @param {string} type The integer type
 * @returns {number | bigint} The parsed integer
 */
function parse(sbuf, type){
    const result = parsers[type]?.(sbuf);
    return result;
}
/**
 * Parses an integer array type
 * @param {SmartBuffer} sbuf Smart buffer instance
 * @param {string} typeCount The type followed by the length
 * @returns {Array<number | bigint>} An array of parsed integers
 */
function parseArray(sbuf, typeCount){
    const [type, count] = typeCount.split(";");
    const array = [];
    for(let i=0;i<count;i++)
        array.push(parse(sbuf, type));
    return array;
}


/**
 * Parses an buffer using the struct as a model
 * @param {Buffer} buf Buffer
 * @param {Object} struct Struct
 * @returns {Object} The parsed struct
 */
function parseObject(buf, struct){
    const new_obj = {};
    const sbuf = SmartBuffer.fromBuffer(buf);
    for(const key in struct)
        new_obj[key] = generic.isArrayType(struct[key]) ? parseArray(sbuf, struct[key]) : parse(sbuf, struct[key]);
    sbuf.destroy();
    return new_obj;
}

module.exports = {
    parse_normal: parse,
    parseArray,
    parse: parseObject,
};