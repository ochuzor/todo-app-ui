import React, { useContext, createContext, useState, useEffect } from 'react';

import { useAuth } from '../auth/use-auth';
import type { Todo } from '../Types';
import { API_URL } from '../config';
import { getToken } from '../token-handler';

async function loadTodos(): Promise<Todo[]> {
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

function useProvideTodos() {
    const { user } = useAuth();
    const [todos, setTodos] = useState<Todo[]>([]);
    const [isLoading, setLoading] = useState(false);

    useEffect(() => {
        (async () => {
            try {
                setLoading(true);
                if (Boolean(user)) {
                    setTodos(await loadTodos());
                } else {
                    setTodos([]);
                }
            } finally {
                setLoading(false);
            }
        })();
    }, [user]);

    return {
        todos,
        isLoading,
    }
}

/** For more details on
 * `authContext`, `ProvideAuth`, `useAuth` and `useProvideAuth`
 * refer to: https://usehooks.com/useAuth/
 */
 type TodosContext = ReturnType<typeof useProvideTodos>;
const todosContext = createContext<TodosContext>({} as TodosContext);
 
export const ProvideTodos: React.FC = ({ children }) => {
    const todos = useProvideTodos();
    return <todosContext.Provider value={todos}>{children}</todosContext.Provider>;
};
 
export function useTodos() {
    return useContext(todosContext);
}
 