import React, { useState } from "react";

// Material-UI
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";

// Custom Styles
import useStyles from "./styles/toko";
import isURL from "validator/lib/isURL";

function Toko() {

    const [form, setForm] = useState({
        nama: '',
        alamat: '',
        telepon: '',
        website: '',
    });

    const [error, setError] = useState({
        nama: '',
        alamat: '',
        telepon: '',
        website: '',
    });

    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    }

    const validate = () => {
        const newError = { ...error };

        if (!form.nama) {
            newError.nama = 'Nama Toko wajib diisi';
        }

        if (!form.alamat) {
            newError.alamat = 'Alamat Toko wajib diisi';
        }

        if (!form.telepon) {
            newError.telepon = "No Telepon Toko wajib diisi";
        }

        if (!form.website) {
            newError.website = "Website Toko wajib diisi";
        } else if (!isURL(form.website)) {
            newError.website = "Website Toko tidak valid";
        }

        return newError;
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        const findErrors = validate();

        if (Object.values(findErrors).some(err => err !== '')) {
            setError(findErrors);
        }
    }

    const styles = useStyles.props.children

    return (
        <Box style={styles.pengaturanToko}>
            <form onSubmit={handleSubmit} noValidate>
                <TextField
                    required
                    fullWidth
                    variant="standard"
                    id="nama"
                    name="nama"
                    label="Nama Toko"
                    margin="normal"
                    value={form.nama}
                    onChange={handleChange}
                    helperText={error.nama}
                    error={error.nama ? true : false}
                    disabled={isSubmitting}

                />
                <TextField
                    required
                    fullWidth
                    variant="standard"
                    id="alamat"
                    name="alamat"
                    label="Alamat Toko"
                    margin="normal"
                    multiline
                    maxRows={3}
                    value={form.alamat}
                    onChange={handleChange}
                    helperText={error.alamat}
                    error={error.alamat ? true : false}
                    disabled={isSubmitting}
                />
                <TextField
                    required
                    fullWidth
                    variant="standard"
                    id="telepon"
                    name="telepon"
                    label="No Telepon Toko"
                    margin="normal"
                    value={form.telepon}
                    onChange={handleChange}
                    helperText={error.telepon}
                    error={error.telepon ? true : false}
                    disabled={isSubmitting}
                />
                <TextField
                    required
                    fullWidth
                    variant="standard"
                    id="website"
                    name="website"
                    label="Website Toko"
                    margin="normal"
                    value={form.website}
                    onChange={handleChange}
                    helperText={error.website}
                    error={error.website ? true : false}
                    disabled={isSubmitting}
                />
                <Grid container style={styles.buttons}>
                    <Grid item xs>
                        <Button
                            variant="contained"
                            type="reset"
                            color="error"
                            disabled={isSubmitting}
                        >
                            Reset
                        </Button>
                    </Grid>
                    <Grid item>
                        <Button
                            variant="contained"
                            type="submit"
                            color="primary"
                            disabled={isSubmitting}
                        >
                            Sumbit
                        </Button>
                    </Grid>
                </Grid>
            </form>
        </Box>
    );
}

export default Toko;