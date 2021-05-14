import { TOKEN_KEY } from './config';

export const setToken = (token?: string) => {
    if (token) {
        window.localStorage.setItem(TOKEN_KEY, token)
    }
    else {
        window.localStorage.removeItem(TOKEN_KEY);
    }
};

export const getToken = (): string => {
    return window.localStorage.getItem(TOKEN_KEY) || '';
};
