import React from 'react';
import Checkbox from '@material-ui/core/Checkbox';

import type { Todo } from '../Types';
import { useTodos } from '../todos/use-todos';

type IProps = {
    todo: Todo;
};

export default function TodoStatus({ todo }: IProps) {
    const { updateTodo, isLoading } = useTodos();

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const data: Todo = {
            ...todo,
            is_done: event.target.checked,
        };

        updateTodo(data);
    };

    return (<Checkbox
        checked={todo.is_done}
        color="primary"
        onChange={handleChange}
        disabled={isLoading}
    />);
}
