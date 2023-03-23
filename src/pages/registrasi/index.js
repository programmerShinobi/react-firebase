import React, { useState } from 'react';

// import komponen material UI
import Button from '@mui/material/Button';
import useStyles from './styles';
import { Container, Grid, IconButton, InputAdornment, Paper, TextField, Typography } from '@mui/material';
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

// import react router dom
import { Link } from 'react-router-dom'
import isEmail from 'validator/lib/isEmail';
import isStrongPassword from 'validator/lib/isStrongPassword';

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

        if (Object.keys(findErrors).some(err => err !== '')) {
            setError(findErrors);
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
                            <Button size="large" onClick={handleReset} color="error" variant="contained">Cancle</Button>
                        </Grid>
                        <Grid item>
                            <Button size="large" type="submit" color="primary" variant="contained">Daftar</Button>
                        </Grid>
                    </Grid>
                    <Typography style={styles.label}>
                        Anda punya akun lain?&nbsp;
                        <Link to="/login" style={styles.labelLink}>Login</Link>
                    </Typography>
                </form>
            </Paper>
        </Container >
    );
}

export default Registrasi;