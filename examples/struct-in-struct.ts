// run this code using:
// - npx tsx examples/struct-in-struct.ts
// - yarn tsx examples/struct-in-struct.ts
import { write, parse, char, uint8, bool } from "../src/lib";

enum Emotion {
    Happy = 0x0,
    Sad = 0x1,
    Angry = 0x2
}
const Animal = {
    type: char(10),
    name: char(20),
    emotion: uint8
};
const Canine = {
    animal: Animal,
    isBarking: bool,
};
const Feline = {
    animal: Animal,
    isMeowing: bool
};

const dog = {
    animal: {
        type: "Dog\0\0\0\0\0\0\0",
        name: "Cupcake\0\0\0\0\0\0\0\0\0\0\0\0\0",
        emotion: Emotion.Happy
    },
    isBarking: false
};
console.log(write(Canine, dog));
console.log(parse(Feline, Buffer.of(67, 97, 116, 0, 0, 0, 0, 0, 0, 0, 66, 117, 114, 103, 101, 114, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 1)));