import React, { useEffect, useState } from "react";
import { Prompt } from "react-router-dom";
import { useSnackbar } from "notistack";

// Firebase
import { useFirebase } from "../../../components/FirebaseProvider";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";
import { useDocument } from "react-firebase-hooks/firestore";

// Material-UI
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import AppPageLoading from "../../../components/AppPageLoading";

// Custom Styles
import useStyles from "./styles/edit";

function EditProduk({ match }) {
    const [form, setForm] = useState({
        nama: '',
        sku: '',
        harga: 0,
        stok: 0,
        deskripsi: '',
        foto: '',
    });

    const [error, setError] = useState({
        nama: '',
        sku: '',
        harga: '',
        stok: '',
        deskripsi: '',
        foto: '',
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSomethingChange, setSomeThingChange] = useState(false);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });

        setError({
            [e.target.name]: ''
        });
    }
    const firebase = useFirebase();

    const produkDoc = doc(firebase.firestore, `toko/${firebase.user.uid}/produk/${match.params.produkId}`);

    const produkRef = ref(firebase.storage, `toko/${firebase.user.uid}/produk/${match.params.produkId}`);

    const [snapshot, loading] = useDocument(produkDoc);

    useEffect(() => {

        if (snapshot) {
            setForm((currentForm) => ({
                ...currentForm,
                ...snapshot.data()
            }));
        }
    }, [snapshot]);

    const validate = () => {
        const newError = { ...error };

        if (!form.nama) {
            newError.nama = 'Nama Produk wajib diisi';
        }

        if (!form.harga || form.harga == 0) {
            newError.harga = "Harga Produk wajib diisi atau tidak boleh \"0\"";
        }

        if (!form.stok || form.harga == 0) {
            newError.stok = "Stok Produk wajib diisi atau tidak boleh \"0\"";
        }

        return newError;
    }

    const { enqueueSnackbar } = useSnackbar();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const findErrors = validate();

        if (Object.values(findErrors).some(err => err !== '')) {
            setError(findErrors);
        } else {
            setIsSubmitting(true);
            setSomeThingChange(true);
            await setDoc(produkDoc, form, { merge: true })
                .then(() => {
                    setIsSubmitting(false);
                    setSomeThingChange(false);
                    enqueueSnackbar('Data produk berhasil disimpan', { variant: 'success' });
                })
                .catch((e) => {
                    setIsSubmitting(false);
                    setSomeThingChange(false);
                    enqueueSnackbar('Data toko gagal disimpan, ' + e.message, { variant: 'error' });
                });
        }
    }

    const handleUploadFile = (e) => {
        const file = e.target.files && e.target.files[0];
        setError(error => ({
            ...error,
            foto: '',
        }));
        if (!['image/png', 'image/jpeg'].includes(file?.type)) {

            setError(error => ({
                ...error,
                foto: `Tipe file tidak didukung: ${file.type}`,
            }));
        } if (file?.size >= 512000) {
            setError(error => ({
                error,
                foto: `Ukuran file terlalu besar > 500KB`
            }));
        } else {
            setError(error => ({
                error,
                foto: ""
            }));
            setIsSubmitting(true);
            setSomeThingChange(true);

            const storageRef = ref(firebase.storage, `toko/${firebase.user.uid}/produk/${match.params.produkId}/${file.name}`);

            const uploadTask = uploadBytesResumable(storageRef, file);

            // Listen for state changes, errors, and completion of the upload.
            uploadTask.on('state_changed',
                (snapshot) => {
                    // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    if (progress) {
                        setIsSubmitting(false);
                        setSomeThingChange(false);
                        enqueueSnackbar('Foto produk berhasil disimpan', { variant: 'success' });
                    }
                    console.info('Upload is ' + progress + '% done');
                    switch (snapshot.state) {
                        case 'paused':
                            console.log('Upload is paused');
                            break;
                        case 'running':
                            console.log('Upload is running');
                            break;
                        default:
                            break;
                    }
                },
                (e) => {
                    setIsSubmitting(false);
                    setSomeThingChange(false);
                    setError(error => ({
                        error,
                        foto: e.message
                    }));
                },
                () => {
                    // Upload completed successfully, now we can get the download URL
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                        console.log('File available at', downloadURL);
                        setForm(currentForm => ({
                            ...currentForm,
                            foto: downloadURL
                        }));
                    });
                }
            );
        }
    }

    if (loading) {
        return (<AppPageLoading />)
    }

    const styles = useStyles.props.children
    return (
        <div>
            <Typography variant="h5" component="h1">Edit Produk: {form.nama}</Typography>
            <Grid container alignItems="center" justifyItems="center">
                <Grid item xs={12} sm={6}>
                    <form
                        noValidate
                        id="form-produk"
                        onSubmit={handleSubmit} >
                        <TextField
                            disabled={isSubmitting}
                            required
                            fullWidth
                            margin="normal"
                            variant="standard"
                            id="nama"
                            name="nama"
                            label="Nama Produk"
                            value={form.nama}
                            onChange={handleChange}
                            helperText={error.nama}
                            error={error.nama ? true : false}
                        />
                        <TextField
                            disabled={isSubmitting}
                            fullWidth
                            margin="normal"
                            variant="standard"
                            id="sku"
                            name="sku"
                            label="SKU Produk"
                            value={form.sku}
                            onChange={handleChange}
                            helperText={error.sku}
                            error={error.sku ? true : false}
                        />
                        <TextField
                            disabled={isSubmitting}
                            required
                            fullWidth
                            margin="normal"
                            variant="standard"
                            id="harga"
                            name="harga"
                            label="Harga Produk"
                            type="number"
                            value={form.harga}
                            onChange={handleChange}
                            helperText={error.harga}
                            error={error.harga ? true : false}
                        />
                        <TextField
                            disabled={isSubmitting}
                            required
                            fullWidth
                            margin="normal"
                            variant="standard"
                            id="stok"
                            name="stok"
                            label="Stok Produk"
                            type="number"
                            value={form.stok}
                            onChange={handleChange}
                            helperText={error.stok}
                            error={error.stok ? true : false}
                        />
                        <TextField
                            disabled={isSubmitting}
                            fullWidth
                            margin="normal"
                            variant="standard"
                            multiline
                            maxRows={3}
                            id="deskripsi"
                            name="deskripsi"
                            label="Deskripsi Produk"
                            value={form.deskripsi}
                            onChange={handleChange}
                            helperText={error.deskripsi}
                            error={error.deskripsi ? true : false}
                        />
                    </form>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <div style={styles.uploadFotoProduk}>
                        {form.foto && <img
                            style={styles.previewFotoProduk}
                            src={form.foto != '' ? form.foto : 'https://firebasestorage.googleapis.com/v0/b/aplikasi-penjualan-6fced.appspot.com/o/toko%2F1ExRhN5KPSepD34eJ3Ry76Vekfx1%2Fproduk%2F8ZFdCL95i042Hjjt4q0Q%2Fichiraku-ramen.jpg?alt=media&token=b4e92229-da33-4fbc-b54c-b17725e249af'}
                            alt={`Foto Produk ${form.nama}`}
                        />}
                        <input
                            style={styles.hideInputFile}
                            type="file"
                            id="upload-foto-produk"
                            accept="image/jpeg, image/png"
                            onChange={handleUploadFile}
                        />
                        <label
                            htmlFor="upload-foto-produk"
                        >
                            <Button
                                style={styles.button}
                                disabled={isSubmitting}
                                component="span"
                                variant="outlined"
                            >
                                Upload Foto Produk
                            </Button>
                        </label>
                        {error.foto && (
                            <Typography
                                color="error"
                            >
                                {error.foto}
                            </Typography>
                        )}
                    </div>
                </Grid>
                <Grid style={styles.button} item xs={12} sm={6}>
                    <Button
                        fullWidth
                        form="form-produk"
                        type="submit"
                        color="primary"
                        variant="contained"
                        disabled={isSubmitting}
                    >
                        Simpan
                    </Button>
                </Grid>
            </Grid>
            <Prompt
                when={isSomethingChange}
                message="Terdapat perubahan data yang belum disimpan, apakah Anda yakin ingin meninggalkan halaman ini?"
            />
        </div>
    );
}

export default EditProduk;