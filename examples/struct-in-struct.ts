import { write, parse, char, uint8 } from "../src/lib";
const bool = uint8; // as of v2.0.0, theres no such a thing as booleans

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
    isBarking: 0
};
console.log(write(Canine, dog));
console.log(parse(Feline, Buffer.of(67, 97, 116, 0, 0, 0, 0, 0, 0, 0, 66, 117, 114, 103, 101, 114, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 1)));