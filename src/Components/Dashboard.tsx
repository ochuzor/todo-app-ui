import React from 'react';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import { DataGrid, GridColDef, GridValueGetterParams } from '@material-ui/data-grid';
import { makeStyles } from '@material-ui/core/styles';

import { useTodos } from '../todos/use-todos';

const useStyles = makeStyles((theme) => ({
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
}));

const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 70, sortable: false },
    { field: 'title', headerName: 'Title', width: 300 },
    {
        field: 'created_at',
        headerName: 'Created',
        type: 'dateTime',
        width: 130,
    },
];

export default function Dashboard() {
    const classes = useStyles();
    const { todos } = useTodos();

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
                        />
                    </div>
                </Paper>
            </div>
        </Container>);
}
