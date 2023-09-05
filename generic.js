/**
 * Check if the type can be treated as an array
 * @param {string} type Integer type
 * @returns {boolean} If the type should be treated as an array
 */
function isArrayType(type){
    return type.indexOf(";") + 1
}

module.exports = {isArrayType};