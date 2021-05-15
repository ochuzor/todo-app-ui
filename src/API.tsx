import type { Todo, TodoEditData, UserInfo } from './Types';
import { API_URL } from './config';
import { getToken, setToken } from './token-handler';

export const signIn = async (username: string, password: string): Promise<string> => {
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
};

export const signOut = async (): Promise<void> => {
    const url = `${API_URL}/auth/token/logout/`;
    const token = getToken();

    await fetch(url, {
        method: 'POST',
        headers: {
            'Authorization': `Token ${token}`
        },
    });

    setToken(undefined);
};

const fakeUsers: UserInfo[] = [
    { username: 'john', id: 1 },
    { username: 'jane', id: 2 },
];

export const signUp = async (username: string, _password: string): Promise<UserInfo> => {
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
};

export const getUserData = async (): Promise<UserInfo> => {
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
};

export async function loadTodos(): Promise<Todo[]> {
    const url = `${API_URL}/todos/`;
    const token = getToken();
    const resp = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
            'Authorization': `Token ${token}`
        },
    });

    if (!resp.ok) {
        throw new Error(await resp.json());
    }

    return (await resp.json()).results;
}

export async function saveTodo(data: TodoEditData): Promise<Todo> {
    const url = data.id ? `${API_URL}/todos/${data.id}/` : `${API_URL}/todos/`;
    // these are the only fields one is allowed to updated/create from
    const { title, is_done } = data;
    const token = getToken();
    
    const resp = await fetch(url, {
        method: data.id ? 'PUT' : 'POST',
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
            'Authorization': `Token ${token}`
        },
        body: JSON.stringify({title, is_done}),
    });

    if (!resp.ok) {
        throw new Error(await resp.json());
    }

    return await resp.json();
}

export async function deleteTodo(id: Todo['id']): Promise<void> {
    const url = `${API_URL}/todos/${id}/`;
    const token = getToken();

    const resp = await fetch(url, {
        method: 'DELETE',
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
            'Authorization': `Token ${token}`
        },
    });

    if (!resp.ok) {
        throw new Error(await resp.json());
    }
}
