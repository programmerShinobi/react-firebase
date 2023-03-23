import * as React from 'react';

// import komponen material UI
import Button from '@mui/material/Button';
import useStyles from './styles';
import { Container, Grid, Paper, TextField, Typography } from '@mui/material';

// import react router dom
import { Link } from 'react-router-dom'

function Registrasi() {
    const styles = useStyles.props.children;
    return (
        <Container maxWidth="xs">
            <Paper style={styles.paper} >
                <Typography
                    variant="h5"
                    component="h1"
                    style={styles.title}>
                    Buat Akun Baru
                </Typography>

                <form>
                    <TextField
                        id="email"
                        type="email"
                        name="email"
                        label="Alamat Email"
                        margin="normal"
                        variant="standard"
                        fullWidth
                        required
                    />
                    <TextField
                        id="password"
                        type="password"
                        name="password"
                        label="Password"
                        margin="normal"
                        variant="standard"
                        fullWidth
                        required
                    />
                    <TextField
                        id="ulangi_password"
                        type="password"
                        name="ulangi_password"
                        label="Ulangi Password"
                        margin="normal"
                        variant="standard"
                        fullWidth
                        required
                    />
                    <Grid container style={styles.buttons} >
                        <Grid item xs>
                            <Button size="large" type="reset" color="error" variant="contained">Cancle</Button>
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