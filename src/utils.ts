type ValidateText = (text: string) => string;

const MIN_TEXT_LEN = 3;
const MAX_TEXT_LEN = 50;

export const validateUserName: ValidateText = (userName: string) => {
    const text = userName.trim().toLowerCase();
    if (text.length < MIN_TEXT_LEN || text.length > MAX_TEXT_LEN) {
        throw new Error(`Username must be between ${MIN_TEXT_LEN} and ${MAX_TEXT_LEN}`);
    }

    if (!text.match(/^[0-9a-z]+$/)) {
        throw new Error('Username must be alphanumeric');
    }

    return text;
};

export const validatePassword: ValidateText = (password: string) => {
    if (password.length < MIN_TEXT_LEN || password.length > MAX_TEXT_LEN) {
        throw new Error(`Password must be between ${MIN_TEXT_LEN} and ${MAX_TEXT_LEN}`);
    }

    return password;
};
