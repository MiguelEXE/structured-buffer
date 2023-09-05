const generic_handler = function(type){
    return new Proxy([], {
        get(_, index, __){
            const indexNum = parseInt(index);
            return `${type};${indexNum}`;
        }
    });
}
const objects = {
    int8:       generic_handler("int8"),
    int16_le:   generic_handler("int16_le"),
    int32_le:   generic_handler("int32_le"),
    int64_le:   generic_handler("int64_le"),
    int16_be:   generic_handler("int16_be"),
    int32_be:   generic_handler("int32_be"),
    int64_be:   generic_handler("int64_be"),
    
    uint8:      generic_handler("uint8"),
    uint16_le:  generic_handler("uint16_le"),
    uint32_le:  generic_handler("uint32_le"),
    uint64_le:  generic_handler("uint64_le"),
    uint16_be:  generic_handler("uint16_be"),
    uint32_be:  generic_handler("uint32_be"),
    uint64_be:  generic_handler("uint64_be")
};
module.exports = objects;