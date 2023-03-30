import React, { useState } from 'react';

// import komponen material UI
import Button from '@mui/material/Button';
import useStyles from './styles';
import { Container, Grid, IconButton, InputAdornment, Paper, TextField, Typography } from '@mui/material';
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

// import react router dom
import { Link, Redirect } from 'react-router-dom';
import isEmail from 'validator/lib/isEmail';
import isStrongPassword from 'validator/lib/isStrongPassword';

// import firebase hook
import { useFirebase } from '../../components/FirebaseProvider';
import { signInWithEmailAndPassword } from 'firebase/auth';
import AppLoading from '../../components/AppLoading';

function Login() {
    const styles = useStyles.props.children;

    const [form, setForm] = useState({
        email: '',
        password: '',
    });

    const [error, setError] = useState({
        email: '',
        password: '',
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    const firebase = useFirebase();

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
            password: '',
        });
    }

    const validate = () => {
        const newError = { ...error };
        if (!form.email) {
            newError.email = 'Email wajib diisi';
        } else if (!isEmail(form.email)) {
            newError.email = 'Email tidak valid';
        } else if (!form.password) {
            newError.password = 'Password wajib diisi';
        } else if (!isStrongPassword(form.password)) {
            newError.password = 'Kata sandi minimal harus 8 karakter dan mengandung setidaknya satu huruf kecil, satu huruf besar, satu angka, dan satu simbol';
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
            signInWithEmailAndPassword(firebase.auth, form.email, form.password)
                .then((userCredential) => {
                    const user = userCredential.user;
                    if (!user) {
                        throw new Error('auth/user-not-found');
                    }
                })
                .catch((e) => {
                    const newError = {};
                    switch (e.code) {
                        case 'auth/user-not-found':
                            newError.email = 'Email belum terdatar';
                            break;
                        case 'auth/invalid-email':
                            newError.email = 'Email tidak valid';
                            break;
                        case 'auth/wrong-password':
                            newError.password = 'Password salah';
                            break;
                        case 'auth/user-disabled':
                            newError.email = 'Email telah diblokir';
                            break;
                        default:
                            newError.email = 'Terjadi kesalahan silahkan coba lagi, error : ' + e;
                            break;
                    }
                    setError(newError);
                    setIsSubmitting(false);
                });
        }
    }

    const [showPassword, setShowPassword] = useState(false);
    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    if (firebase.loading) {
        return (<AppLoading />)
    }

    if (firebase.user) {
        return (<Redirect to='/' />)
    }

    return (
        <Container maxWidth="xs">
            <Paper style={styles.paper} >
                <Typography
                    variant="h5"
                    component="h1"
                    style={styles.title}>
                    Login
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
                    <TextField
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        label="Password"
                        margin="normal"
                        variant="standard"
                        fullWidth
                        required
                        value={form.password}
                        onChange={handleChange}
                        helperText={error.password}
                        error={error.password ? true : false}
                        disabled={isSubmitting}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={() => setShowPassword(!showPassword)}
                                        onMouseDown={handleMouseDownPassword}
                                    >
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />
                    <Grid container style={styles.buttons} >
                        <Grid item xs>
                            <Button disabled={isSubmitting} size="large" onClick={handleReset} color="error" variant="contained">Cancle</Button>
                        </Grid>
                        <Grid item>
                            <Button disabled={isSubmitting} size="large" type="submit" color="primary" variant="contained">Login</Button>
                        </Grid>
                    </Grid>
                    <Typography style={styles.label}>
                        <Link style={styles.labelLink} to="/lupa-password">
                            Lupa Password?
                        </Link><hr />
                        Belum punya Akun?&nbsp;
                        <Link disabled={isSubmitting} to="/registrasi" style={styles.labelLink}>Registrasi</Link>
                    </Typography>
                </form>
            </Paper>
        </Container >
    );
}

export default Login;