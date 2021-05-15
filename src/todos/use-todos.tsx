import React, { useContext, createContext, useState, useEffect } from 'react';

import type { Todo, TodoEditData } from '../Types';
import { useAuth } from '../auth/use-auth';
import * as API from '../API';

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
                    setTodos(await API.loadTodos());
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
                const data = await API.saveTodo(todo);
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
                const data = await API.saveTodo(todo);
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
                await API.deleteTodo(id);
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
 