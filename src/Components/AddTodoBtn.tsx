import React from 'react';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import Grid from '@material-ui/core/Grid';

import { useTodos } from '../todos/use-todos';

export default function AddTodoBtn() {
    const { setTodoToEdit } = useTodos();

    const createNewTodo = () => {
        setTodoToEdit({
            title: '',
            is_done: false,
        });
    };

    return (<Grid
        container
        direction="row"
        justify="flex-end"
        alignItems="center"
    >
        <Fab color="primary" aria-label="add" onClick={createNewTodo}>
            <AddIcon />
        </Fab>
    </Grid>);
}
