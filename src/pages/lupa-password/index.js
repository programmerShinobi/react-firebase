import React, { useState } from 'react';

// import komponen material UI
import Button from '@mui/material/Button';
import useStyles from './styles';
import { Container, Grid, Paper, TextField, Typography } from '@mui/material';

// import react router dom
import { Link, Redirect } from 'react-router-dom';
import isEmail from 'validator/lib/isEmail';

// import firebase hook
import { useFirebase } from '../../components/FirebaseProvider';
import { sendPasswordResetEmail } from 'firebase/auth';
import AppLoading from '../../components/AppLoading';

// import notistack hook
import { useSnackbar } from 'notistack';

function LupaPassword() {
    const styles = useStyles.props.children;

    const [form, setForm] = useState({
        email: '',
    });

    const [error, setError] = useState({
        email: '',
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    const firebase = useFirebase();

    const { enqueueSnackbar } = useSnackbar();

    const handleChange = e => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
        setError({
            ...error,
            [e.target.name]: '',
        });
    }

    const handleReset = () => {
        setForm({
            ...form,
            email: '',
        });
    }

    const validate = () => {
        const newError = { ...error };
        if (!form.email) {
            newError.email = 'Email wajib diisi';
        } else if (!isEmail(form.email)) {
            newError.email = 'Email tidak valid';
        }
        return newError;
    }

    const handleSubmit = e => {
        e.preventDefault();
        const findErrors = validate();
        if (Object.values(findErrors).some(err => err !== '')) {
            setError(findErrors);
        } else {
            setIsSubmitting(true);
            const actionCodeSettings = {
                url: `${window.location.origin}/login`
            }
            sendPasswordResetEmail(firebase.auth, form.email, actionCodeSettings)
                .then(() => {
                    setIsSubmitting(false);
                    enqueueSnackbar(
                        `Cek kotak masuk email : ${form.email}, sebuah tautan untuk me-reset password telah terkirim`,
                        { variant: 'success' }
                    );
                    return (<Redirect to='/login' />);
                })
                .catch((e) => {
                    const newError = {};
                    switch (e.code) {
                        case 'auth/user-not-found':
                            newError.email = 'Email belum terdaftar';
                            break;
                        case 'auth/invalid-email':
                            newError.email = 'Email tidak valid';
                            break;
                        case 'auth/internal-error':
                            newError.email = 'Jaringan internet tidak stabil';
                            break;
                        default:
                            newError.email = 'Terjadi kesalahan silahkan coba lagi, ' + e.message;
                            break;
                    }
                    setError(newError);
                    setIsSubmitting(false);
                });
        }
    }

    if (firebase.loading) {
        return (<AppLoading />);
    }

    if (firebase.user) {
        return (<Redirect to='/' />);
    }

    return (
        <Container maxWidth="xs">
            <Paper style={styles.paper} >
                <Typography
                    variant="h5"
                    component="h1"
                    style={styles.title}>
                    Lupa Password
                </Typography>

                <form onSubmit={handleSubmit} noValidate>
                    <TextField
                        id="email"
                        type="email"
                        name="email"
                        label="Alamat Email"
                        margin="normal"
                        variant="standard"
                        fullWidth
                        required
                        value={form.email}
                        onChange={handleChange}
                        helperText={error.email}
                        error={error.email ? true : false}
                        disabled={isSubmitting}
                    />
                    <Grid container style={styles.buttons} >
                        <Grid item xs>
                            <Button disabled={isSubmitting} size="large" onClick={handleReset} color="error" variant="contained">Cancle</Button>
                        </Grid>
                        <Grid item>
                            <Button disabled={isSubmitting} size="large" type="submit" color="primary" variant="contained">Kirim</Button>
                        </Grid>
                    </Grid>
                    <Typography style={styles.label}>
                        Punya akun lain?&nbsp;
                        <Link disabled={isSubmitting} to="/login" style={styles.labelLink}>Login</Link>
                    </Typography>
                </form>
            </Paper>
        </Container >
    );
}

export default LupaPassword;