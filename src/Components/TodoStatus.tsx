import React from 'react';
import Checkbox from '@material-ui/core/Checkbox';

import type { Todo } from '../Types';

type IProps = {
    todo: Todo;
};

export default function TodoStatus({ todo }: IProps) {
    return (<Checkbox
        checked={todo.is_done}
        color="primary"
    />);
}
