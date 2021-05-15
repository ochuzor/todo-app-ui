import React from 'react';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import { DataGrid, GridColDef, GridValueGetterParams } from '@material-ui/data-grid';
import { makeStyles } from '@material-ui/core/styles';

import type { Todo } from '../Types';
import { useTodos } from '../todos/use-todos';
import TodoStatus from './TodoStatus';
import AddTodoBtn from './AddTodoBtn';

const useStyles = makeStyles((theme) => ({
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(1),
    },
    fabContainer: {
        margin: theme.spacing(1),
    }
}));

const columns: GridColDef[] = [
    {
        field: 'is_done', 
        headerName: 'Status', 
        width: 90,
        renderCell: (params: GridValueGetterParams) => <TodoStatus todo={params.row as Todo} />
    },
    { field: 'title', headerName: 'Title', width: 350 },
    {
        field: 'created_at',
        headerName: 'Created',
        type: 'dateTime',
        width: 200,
    },
    // todo actions field
];

export default function Dashboard() {
    const classes = useStyles();
    const { todos, isLoading } = useTodos();

    return (
        <Container component="main" maxWidth="md">
            <div className={classes.paper}>
                <Typography component="h1" variant="h5">
                    My Todos
                </Typography>
                <Paper className={classes.form}>
                    <div style={{ height: 400, width: '100%' }}>
                        <DataGrid
                            rows={todos}
                            columns={columns}
                            pageSize={5}
                            disableColumnMenu
                            disableSelectionOnClick
                            disableColumnSelector
                            loading={isLoading}
                        />
                    </div>
                </Paper>
            </div>

            <Container className={classes.fabContainer}>
                <AddTodoBtn />
            </Container>
        </Container>);
}
