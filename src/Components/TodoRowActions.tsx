import React from 'react';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import { makeStyles } from '@material-ui/core/styles';

import type { TodoItemUI } from '../Types';
import { useTodos } from '../todos/use-todos';

const useStyles = makeStyles((theme) => ({
    root: {
        '& > *': {
            margin: theme.spacing(1),
        },
    },
}));

type IProps = {
    todo: TodoItemUI,
};

export default function TodoRowActions({todo}: IProps) {
    const classes = useStyles();
    const { setTodoToEdit, deleteTodo, isLoading } = useTodos();

    const onTodoDelete = () => {
        if (window.confirm('you sure you want to delete todo?')) {
            deleteTodo(todo.id);
        }
    };

    return (<div className={classes.root}>
        <IconButton
            color="primary"
            aria-label="edit"
            onClick={e => setTodoToEdit({...todo})}
            disabled={isLoading}
        >
            <EditIcon />
        </IconButton>

        <IconButton
            color="secondary"
            aria-label="delete"
            onClick={onTodoDelete}
            disabled={isLoading}
        >
            <DeleteIcon />
        </IconButton>
    </div>);
}
