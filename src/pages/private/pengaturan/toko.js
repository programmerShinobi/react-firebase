import React, { useEffect, useState } from "react";

// react-router
import { Prompt } from "react-router-dom";

// firebase
import { useFirebase } from "../../../components/FirebaseProvider";
import { useDocument } from "react-firebase-hooks/firestore";
import { doc, setDoc } from "firebase/firestore";

// Material-UI
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";

// Custom Styles
import useStyles from "./styles/toko";
import isURL from "validator/lib/isURL";
import { useSnackbar } from "notistack";
import AppPageLoading from "../../../components/AppPageLoading";

function Toko() {
    const firebase = useFirebase();

    const tokoDoc = doc(firebase.firestore, `toko/${firebase.user.uid}`);
    const [snapshot, loading] = useDocument(tokoDoc);

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
    const [isSomethingChange, setSomeThingChange] = useState(false);

    useEffect(() => {

        if (snapshot) {
            setForm(snapshot.data());
        }
    }, [snapshot]);

    const { enqueueSnackbar } = useSnackbar();

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });

        setError({
            [e.target.name]: ''
        });

        setSomeThingChange(true);
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        const findErrors = validate();

        if (Object.values(findErrors).some(err => err !== '')) {
            setError(findErrors);
        } else {
            setIsSubmitting(true);
            await setDoc(tokoDoc, form, { merge: true })
                .then(() => {
                    setIsSubmitting(false);
                    setSomeThingChange(false);
                    enqueueSnackbar('Data toko berhasil disimpan', { variant: 'success' });
                })
                .catch((e) => {
                    setIsSubmitting(false);
                    setSomeThingChange(false);
                    enqueueSnackbar('Data toko gagal disimpan, ' + e.message, { variant: 'error' });
                });
        }
    }

    const handleReset = (e) => {
        e.preventDefault();

        if (snapshot) {
            setForm(snapshot.data());
        }
    }

    if (loading) {
        return (<AppPageLoading />)
    }

    const styles = useStyles.props.children;
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
                    value={form?.nama}
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
                    value={form?.alamat}
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
                    value={form?.telepon}
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
                    value={form?.website}
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
                            onClick={handleReset}
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
                            disabled={isSubmitting || !isSomethingChange}
                        >
                            Simpan
                        </Button>
                    </Grid>
                </Grid>
            </form>
            <Prompt
                when={isSomethingChange}
                message="Terdapat perubahan data yang belum disimpan, apakah Anda yakin ingin meninggalkan halaman ini?"
            />
        </Box>
    );
}

export default Toko;