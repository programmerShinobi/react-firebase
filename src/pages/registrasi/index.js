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
import { createUserWithEmailAndPassword } from 'firebase/auth';
import AppLoading from '../../components/AppLoading';

function Registrasi() {
    const styles = useStyles.props.children;

    const [form, setForm] = useState({
        email: '',
        password: '',
        ulangi_password: '',
    });

    const [error, setError] = useState({
        email: '',
        password: '',
        ulangi_password: '',
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
            ulangi_password: '',
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
        } else if (!form.ulangi_password) {
            newError.ulangi_password = 'Ulangi Password wajib diisi';
        } else if (form.ulangi_password !== form.password) {
            newError.ulangi_password = 'Password tidak sama';
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
            createUserWithEmailAndPassword(firebase.auth, form.email, form.password)
                .then((userCredential) => {
                    const user = userCredential.user;
                    if (!user) {
                        throw new Error();
                    }
                    return (<Redirect to='/' />);
                })
                .catch((e) => {
                    const newError = {};
                    switch (e.code) {
                        case 'auth/email-already-in-use':
                            newError.email = 'Email sudah terdaftar';
                            break;
                        case 'auth/invalid-email':
                            newError.email = 'Email tidak valid';
                            break;
                        case 'auth/weak-password':
                            newError.password = 'Password terlalu lemah';
                            break;
                        case 'auth/operation-not-allowed':
                            newError.email = 'Metode email dan password tidak didukung';
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

    const [showPassword, setShowPassword] = useState(false);
    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const handleMouseDownConfirmPassword = (event) => {
        event.preventDefault();
    };

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
                    Buat Akun Baru
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
                    <TextField
                        id="ulangi_password"
                        type={showConfirmPassword ? 'text' : 'password'}
                        name="ulangi_password"
                        label="Ulangi Password"
                        margin="normal"
                        variant="standard"
                        fullWidth
                        required
                        value={form.ulangi_password}
                        onChange={handleChange}
                        helperText={error.ulangi_password}
                        error={error.ulangi_password ? true : false}
                        disabled={isSubmitting}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        onMouseDown={handleMouseDownConfirmPassword}
                                    >
                                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
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
                            <Button disabled={isSubmitting} size="large" type="submit" color="primary" variant="contained">Daftar</Button>
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

export default Registrasi;