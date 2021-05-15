import React, { useContext, createContext, useState, useEffect } from 'react';

import { UserInfo } from '../Types';
import { getToken, setToken } from '../token-handler';
import * as API from '../API';

function useProvideAuth() {
    const [user, setUser] = useState<UserInfo | null>(null);

    useEffect(() => {
        (async () => {
            if (getToken()) {
                const user = await API.getUserData();
                setUser(user);
            }
        })();
    }, []);

    const signin = async (username: string, password: string) => {
        const token = await API.signIn(username, password);
        setToken(token);
        const user = await API.getUserData();
        setUser(user);
    };

    const signout = async () => {
        setUser(null);
        return API.signOut();
    };

    const registerUser = async (username: string, password: string) => {
        return API.signUp(username, password).then((user) => setUser(user));
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
