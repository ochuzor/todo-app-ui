import React, { useEffect } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { Link as RouterLink, useHistory } from 'react-router-dom';
import { useSnackbar } from 'notistack';

import { validatePassword, validateUserName } from '../utils';
import { useAuth } from '../auth/use-auth';
import { useTextField } from './use-text-field';
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
        marginTop: theme.spacing(3),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
}));

export default function SignUp() {
    const classes = useStyles();
    const { enqueueSnackbar } = useSnackbar();
    const { registerUser, user } = useAuth();
    const history = useHistory();

    const [username, usernameField] = useTextField({type: 'text', label: 'username'});
    const [password, passwordField] = useTextField({type: 'password', label: 'password'});
    const [confirmPassword, confirmPasswordField] = useTextField({type: 'password', label: 'confirm password'});

    useEffect(() => {
        if (Boolean(user)) {
            history.replace('/dashboard');
        }
    }, [user, history]);

    const submit = async (event: React.FormEvent) => {
        try {
            event.preventDefault();
            const u = validateUserName(username);
            const p = validatePassword(password);

            if (p !== confirmPassword) {
                throw new Error('Password mismatch');
            }
            
            await registerUser(u, p);
        } catch (err) {
            enqueueSnackbar(err.message, { 
                variant: 'error',
            });
        }
    };

    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <div className={classes.paper}>
                <Avatar className={classes.avatar}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Sign up
                </Typography>
                <form onSubmit={submit} className={classes.form} noValidate>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            {usernameField}
                        </Grid>
                        <Grid item xs={12}>
                            {passwordField}
                        </Grid>
                        <Grid item xs={12}>
                            {confirmPasswordField}
                        </Grid>
                    </Grid>
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                    >
                        Sign Up
                    </Button>
                    <Grid container justify="flex-end">
                        <Grid item>
                            <Link component={RouterLink} to="/signin" variant="body2">
                                Already have an account? Sign in
                            </Link>
                        </Grid>
                    </Grid>
                </form>
            </div>
            <Box mt={5}>
                <Copyright />
            </Box>
        </Container>
    );
}
