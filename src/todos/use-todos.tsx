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

async function saveTodo(data: Partial<Todo>): Promise<Todo> {
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

    function updateTodo(todo: Todo) {
        (async () => {
            try {
                setLoading(true);
                const data = await saveTodo(todo);
                setTodos(prev => prev.map(td => td.id === data.id ? data : td));
            } finally {
                setLoading(false);
            }
        })();
    }

    return {
        todos,
        isLoading,
        updateTodo,
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
 