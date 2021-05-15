import React, { useContext, createContext, useState, useEffect } from 'react';

import { useAuth } from '../auth/use-auth';
import type { Todo, TodoEditData } from '../Types';
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

async function saveTodo(data: TodoEditData): Promise<Todo> {
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

async function apiDeleteTodo(id: Todo['id']): Promise<void> {
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

function useProvideTodos() {
    const { user } = useAuth();
    const [todos, setTodos] = useState<Todo[]>([]);
    const [isLoading, setLoading] = useState(false);
    const [todoToEdit, setTodoToEdit] = useState<TodoEditData>();

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

    function updateTodo(todo: Pick<Todo, 'id' | 'title' | 'is_done'>) {
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

    function createTodo(todo: Pick<Todo, 'title' | 'is_done'>) {
        (async () => {
            try {
                setLoading(true);
                const data = await saveTodo(todo);
                setTodos(prev => [data].concat(prev));
            } finally {
                setLoading(false);
            }
        })();
    }

    function deleteTodo(id: Todo['id']) {
        (async () => {
            try {
                setLoading(true);
                await apiDeleteTodo(id);
                setTodos(prev => prev.filter(td => td.id !== id));
            } finally {
                setLoading(false);
            }
        })();
    }

    return {
        todos,
        isLoading,
        updateTodo,
        todoToEdit,
        setTodoToEdit,
        createTodo,
        deleteTodo,
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
 