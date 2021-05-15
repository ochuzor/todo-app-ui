import React, { useEffect, useState } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import { useSnackbar } from 'notistack';

import { useTodos } from '../todos/use-todos';

const MIN_TEXT_LEN = 3;
const MAX_TEXT_LEN = 50;

const getValidTodoText = (input: string) => {
    const text = input.trim();
    if (text.length < MIN_TEXT_LEN || text.length > MAX_TEXT_LEN) {
        throw new Error(`Todo text must be between ${MIN_TEXT_LEN} and ${MAX_TEXT_LEN}`);
    }

    return text;
};

export default function EditTodoDialog() {
    const { enqueueSnackbar } = useSnackbar();
    const { todoToEdit, setTodoToEdit, createTodo, updateTodo, isLoading } = useTodos();

    const [text, setText] = useState('');
    const [isDone, setIsDone] = useState(false);

    const open = Boolean(todoToEdit);

    useEffect(() => {
        setText(todoToEdit?.title || '');
        setIsDone(todoToEdit?.is_done || false);
    }, [todoToEdit]);

    const handleSave = () => {
        try {
            const data = {
                title: getValidTodoText(text),
                is_done: isDone,
            };
    
            if (todoToEdit?.id) {
                updateTodo({...data, id: todoToEdit.id});
            } else {
                createTodo(data);
            }

            setTodoToEdit(undefined);
        } catch (err) {
            enqueueSnackbar(err.message, { 
                variant: 'error',
            });
        }
    };

    const handleCancel = () => {
        setTodoToEdit(undefined);
    };

    return (
        <Dialog
            open={open}
            onClose={handleCancel}
            fullWidth maxWidth='sm'>

            <DialogTitle>Edit Todo</DialogTitle>
            <DialogContent>
                <DialogContentText> {text} </DialogContentText>
                <TextField
                    autoFocus
                    label="todo text"
                    type="email"
                    fullWidth
                    value={text}
                    onChange={e => setText(e.target.value)}
                    disabled={isLoading}
                />

                <FormGroup row>
                    <FormControlLabel
                        control={
                            <Switch
                                checked={isDone}
                                onChange={event => setIsDone(event.target.checked)}
                                name="checkedB"
                                color="primary"
                            />
                        }
                        label="Is Done"
                    />
                </FormGroup>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleCancel} color="primary">
                    Cancel
                </Button>
                <Button
                    onClick={handleSave}
                    color="primary"
                    disabled={isLoading}
                >
                    Save
                </Button>
            </DialogActions>
        </Dialog>);
}
