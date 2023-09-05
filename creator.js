const {SmartBuffer} = require("smart-buffer");
const generic = require("./generic.js");

const writers = {
    /**
     * @param {SmartBuffer} sbuf
     * @param {string | number} value 
     */
    int8(sbuf, value){
        switch(typeof value){
            case "number":
                sbuf.writeInt8(value & 0xFF);
                break;
            case "string":
                sbuf.writeInt8(value.charCodeAt(0));
                break;
            default:
                throw new TypeError("Invalid type");
        }
    },
    /**
     * @param {SmartBuffer} sbuf
     * @param {number} value 
     */
    int16_le(sbuf, value){
        sbuf.writeInt16LE(value & 0x7FFF);
    },
    /**
     * @param {SmartBuffer} sbuf
     * @param {number} value 
     */
    int32_le(sbuf, value){
        sbuf.writeInt32LE(value & 0x7FFFFFFF);
    },
    /**
     * @param {SmartBuffer} sbuf
     * @param {BigInt} value 
     */
    int64_le(sbuf, value){
        sbuf.writeBigInt64LE(BigInt(value) & 0x7FFFFFFFFFFFFFFFn);
    },
    /**
     * @param {SmartBuffer} sbuf
     * @param {number} value 
     */
    int16_be(sbuf, value){
        sbuf.writeInt16BE(value & 0x7FFF);
    },
    /**
     * @param {SmartBuffer} sbuf
     * @param {number} value 
     */
    int32_be(sbuf, value){
        sbuf.writeInt32BE(value & 0x7FFFFFFF);
    },
    /**
     * @param {SmartBuffer} sbuf
     * @param {BigInt} value 
     */
    int64_be(sbuf, value){
        sbuf.writeBigInt64BE(BigInt(value) & 0x7FFFFFFFFFFFFFFFn);
    },

    /**
     * @param {SmartBuffer} sbuf
     * @param {string | number} value 
     */
    uint8(sbuf, value){
        switch(typeof value){
            case "number":
                sbuf.writeUInt8(value & 0x7F);
                break;
            case "string":
                sbuf.writeUInt8(value.charCodeAt(0));
                break;
            default:
                throw new TypeError("Invalid type");
        }
    },
    /**
     * @param {SmartBuffer} sbuf
     * @param {number} value 
     */
    uint16_le(sbuf, value){
        sbuf.writeUInt16LE(value & 0xFFFF);
    },
    /**
     * @param {SmartBuffer} sbuf
     * @param {number} value 
     */
    uint32_le(sbuf, value){
        sbuf.writeUInt32LE(value & 0xFFFFFFFF);
    },
    /**
     * @param {SmartBuffer} sbuf
     * @param {BigInt} value 
     */
    uint64_le(sbuf, value){
        sbuf.writeBigUInt64LE(BigInt(value) & 0xFFFFFFFFFFFFFFFFn);
    },
    /**
     * @param {SmartBuffer} sbuf
     * @param {number} value 
     */
    uint16_be(sbuf, value){
        sbuf.writeUInt16BE(value & 0xFFFF);
    },
    /**
     * @param {SmartBuffer} sbuf
     * @param {number} value 
     */
    uint32_be(sbuf, value){
        sbuf.writeUInt32BE(value & 0xFFFFFFFF);
    },
    /**
     * @param {SmartBuffer} sbuf
     * @param {BigInt} value 
     */
    uint64_be(sbuf, value){
        sbuf.writeBigUInt64BE(BigInt(value) & 0xFFFFFFFFFFFFFFFFn);
    },
};
function createNormal(sbuf, type, value){
    return writers[type]?.(sbuf, value);
}
function createArray(sbuf, typeCount, values){
    const [type, count] = typeCount.split(";");
    const array = [];
    for(let i=0;i<count;i++){
        if(values[i] === undefined)
            throw new TypeError("Reached undefined");
        let realValue = values[i] === null ? 0 : values[i]; // NULL in c is 0
        array.push(createNormal(sbuf, type, realValue));
    }
    return array;
}
function create(struct, target){
    const sbuf = new SmartBuffer();
    for(const key in struct){
        if(generic.isArrayType(struct[key])){
            createArray(sbuf, struct[key], target[key]);
        }else{
            createNormal(sbuf, struct[key], target[key]);
        }
    }
    const buf = sbuf.toBuffer();
    sbuf.destroy();
    return buf;
}
module.exports = {
    createArray,
    createNormal,
    create
};