// run this code using:
// - npx tsx examples/calculating-struct-size.ts
// - yarn tsx examples/calculating-struct-size.ts
import { sizeof, char, uint32_be, uint8, uint64_be } from "../src/lib";

// A UNIX-like file metadata
const FileMetadata = {
    name: char(20),                 // 20 bytes
    createdAt: uint32_be,           // 4 bytes
    updatedAt: uint32_be,           // 4 bytes
    lastAccessed: uint32_be,        // 4 bytes
    owner: char(20),                // 20 bytes
    group: char(20),                // 20 bytes
    userPermissions: uint8,         // 1 byte  
    groupPermissions: uint8,        // 1 byte
    everyoneElsePermissions: uint8, // 1 byte
    size: uint64_be                 // 8 bytes
};

const expectedSum = 20 + 4 + 4 + 4 + 20 + 20 + 1 + 1 + 1 + 8;
console.log("Expected sum:", expectedSum);
console.log("Calculated sum:", sizeof(FileMetadata));