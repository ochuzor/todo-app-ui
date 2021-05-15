import React from 'react';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import { makeStyles } from '@material-ui/core/styles';

import type { TodoItemUI } from '../Types';
import { useTodos } from '../todos/use-todos';
import {useConfirmDialog} from './ConfirmDialog';

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

    const {dialog, setOpen} = useConfirmDialog({
        message: 'Are you sure you want to delete todo?',
        onConfirm: (yes: boolean) => {
            if (yes) {
                deleteTodo(todo.id);
            }

            setOpen(false);
        },
    });

    const onTodoDelete = () => {
        setOpen(true);
    };

    return (<div className={classes.root}>
        {dialog}
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
