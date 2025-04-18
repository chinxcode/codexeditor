import { customAlphabet } from "nanoid";

export const generateCode = () => {
    const nanoid = customAlphabet("123456789abcdefghijklmnopqrstuvwxyz", 8);
    return nanoid();
};

export const generateProjectCodes = () => {
    return {
        editCode: generateCode(),
        viewCode: generateCode(),
    };
};
