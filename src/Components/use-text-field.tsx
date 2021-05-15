import React, { useState } from 'react';
import TextField from '@material-ui/core/TextField';

type IProps = {
    type: string;
    label: string;
};

export function useTextField({ type, label }: IProps): [string, JSX.Element] {
    const [value, setValue] = useState<string>('');
    const textField = <TextField
        variant="outlined"
        required
        fullWidth
        type={type}
        label={label}
        value={value}
        onChange={e => setValue(e.target.value)}
    />;

    return [value, textField];
}
