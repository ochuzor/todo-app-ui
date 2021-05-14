import React, { useContext, createContext, useState, useEffect } from 'react';

import { UserInfo } from '../Types';
import { API_URL } from '../config';
import { getToken, setToken } from '../token-handler';

const fakeUsers: UserInfo[] = [
    { username: 'john', id: 1 },
    { username: 'jane', id: 2 },
];

const authentication = {
    signIn: async (username: string, password: string): Promise<string> => {
        const url = `${API_URL}/auth/token/login/`;
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json; charset=UTF-8', // Indicates the content
            },
            body: JSON.stringify({ username, password }),
        });

        if (!response.ok) {
            const msg = (await response.json()).non_field_errors[0]
            throw new Error(msg);
        }

        const data = await response.json();
        return data.auth_token;
    },

    signOut: async (): Promise<void> => {
        const url = `${API_URL}/auth/token/logout/`;
        const token = getToken();

        await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Token ${token}`
            },
        });
    
        setToken(undefined);
    },

    signUp: async (username: string, _password: string): Promise<UserInfo> => {
        const existingUser = fakeUsers.find((u) => u.username === username);
        if (existingUser) {
            throw new Error('User already exists');
        }

        const user = {
            username,
            id:
                Math.max.apply(
                    null,
                    fakeUsers.map((u) => u.id)
                ) + 1,
        };

        fakeUsers.push(user);
        return user;
    },

    getUserData: async (): Promise<UserInfo> => {
        const url = `${API_URL}/auth/users/me/`;
        const token = getToken();
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
                'Authorization': `Token ${token}`
            },
        });

        if (!response.ok) {
            const msg = (await response.json()).detail;
            throw new Error(msg);
        }

        return response.json();
    }
};

function useProvideAuth() {
    const [user, setUser] = useState<UserInfo | null>(null);

    useEffect(() => {
        (async () => {
            if (getToken()) {
                const user = await authentication.getUserData();
                setUser(user);
            }
        })();
    }, []);

    const signin = async (username: string, password: string) => {
        const token = await authentication.signIn(username, password);
        setToken(token);
        const user = await authentication.getUserData();
        setUser(user);
    };

    const signout = async () => {
        setUser(null);
        return authentication.signOut();
    };

    const registerUser = async (username: string, password: string) => {
        return authentication.signUp(username, password).then((user) => setUser(user));
    };

    return {
        user,
        signin,
        signout,
        registerUser,
    };
}

/** For more details on
 * `authContext`, `ProvideAuth`, `useAuth` and `useProvideAuth`
 * refer to: https://usehooks.com/useAuth/
 */
type AuthContext = ReturnType<typeof useProvideAuth>;
const authContext = createContext<AuthContext>({} as AuthContext);

export const ProvideAuth: React.FC = ({ children }) => {
    const auth = useProvideAuth();
    return <authContext.Provider value={auth}>{children}</authContext.Provider>;
};

export function useAuth() {
    return useContext(authContext);
}
