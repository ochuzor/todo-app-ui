import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';

type IProps = {
    message: string;
    open: boolean;
    onConfirm: (isYes: boolean) => void;
};

export default function ConfirmDialog({ message, open, onConfirm }: IProps) {

    return(<Dialog
        open={open}
        onClose={() => onConfirm(false)}
    >
        <DialogContent>
            <DialogContentText>
                {message}
            </DialogContentText>
        </DialogContent>
        <DialogActions>
            <Button onClick={e => onConfirm(false)} color="primary">
            Cancel
            </Button>
            <Button onClick={e => onConfirm(true)} color="primary" autoFocus>
            Yes
            </Button>
        </DialogActions>
    </Dialog>);
}

export function useConfirmDialog({message, onConfirm}: Pick<IProps, 'message' | 'onConfirm' >) {
    const [isOpen, setOpen] = useState(false);

    const dialog = <ConfirmDialog
        open={isOpen}
        message={message}
        onConfirm={onConfirm}
    />;

    return {
        setOpen,
        dialog,
    };
}
