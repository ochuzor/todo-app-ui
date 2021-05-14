import React, { useState, useEffect } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { Link as RouterLink, useHistory } from 'react-router-dom';

import { useAuth } from '../auth/use-auth';
import Copyright from './Copyright';

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

type ValidateText = (text: string) => string;

const validateUserName: ValidateText = (userName: string) => {
    const text = userName.trim().toLowerCase();
    if (text.length < 3) throw new Error('Invalid Username');

    return text;
};

const validatePassword: ValidateText = (password: string) => {
    if (password.length < 6) throw new Error('Invalid Password');

    return password;
};

export default function SignIn() {
    const classes = useStyles();
    const history = useHistory();
    const { signin, user } = useAuth();

    const [userData, setUserData] = useState({ username: '', password: '' });

    useEffect(() => {
        if (Boolean(user)) {
            history.replace('/dashboard');
        }
    }, [user, history]);

    const submit = async (event: React.FormEvent) => {
        try {
            event.preventDefault();
            const username = validateUserName(userData.username);
            const password = validatePassword(userData.password);
            
            await signin(username, password);
        } catch (err) {
            console.error(err);
        }
    };

    const onDataChange = (name: 'username' | 'password', value: string) => {
        const data = { ...userData };
        data[name] = value;
        setUserData({ ...data });
    };

    return (
        <Container component="main" maxWidth="xs">
            <div className={classes.paper}>
                <Avatar className={classes.avatar}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                Sign in
                </Typography>
                <form onSubmit={submit} className={classes.form} noValidate>
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        label="Username"
                        name="email"
                        autoComplete="email"
                        autoFocus
                        onChange={(e) => onDataChange('username', e.target.value)}
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        autoComplete="current-password"
                        onChange={(e) => onDataChange('password', e.target.value)}
                    />
                    {/* <FormControlLabel
                        control={<Checkbox value="remember" color="primary" />}
                        label="Remember me"
                    /> */}
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                    >
                        Sign In
                    </Button>
                    <Grid container>
                        {/* <Grid item xs>
                            <Link href="#" variant="body2">
                                Forgot password?
                            </Link>
                        </Grid> */}
                        <Grid item>
                            <Link component={RouterLink} to="/signup" variant="body2">
                                {'Don\'t have an account? Sign Up'}
                            </Link>
                        </Grid>
                    </Grid>
                </form>
            </div>
            <Box mt={8}>
                <Copyright />
            </Box>
        </Container>
    );
}
