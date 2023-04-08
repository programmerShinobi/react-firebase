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

// Custom Styles
import useStyles from "./styles/edit";
import AppPageLoading from "../../../components/AppPageLoading";

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

    const [isSubmitting, setSubmitting] = useState(false);
    const [isSomethingChange, setSomethingChange] = useState(false);

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

    const produkStorageRef = ref(firebase.storage, `toko/${firebase.user.uid}/produk/${match.params.produkId}`);

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

        // if (!form.foto) {
        //     newError.foto = "Foto wajib diunggah";
        // }

        return newError;
    }

    const { enqueueSnackbar } = useSnackbar();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const findErrors = validate();

        if (Object.values(findErrors).some(err => err !== '')) {
            setError(findErrors);
        } else {
            setSubmitting(true);
            setSomethingChange(true);
            await setDoc(produkDoc, form, { merge: true })
                .then(() => {
                    setSubmitting(false);
                    setSomethingChange(false);
                    enqueueSnackbar('Data produk berhasil disimpan', { variant: 'success' });
                })
                .catch((e) => {
                    setSubmitting(false);
                    setSomethingChange(false);
                    enqueueSnackbar('Data toko gagal disimpan, ' + e.message, { variant: 'error' });
                });
        }
    }


    const handleUploadFile = (e) => {
        const file = e.target.files && e.target.files[0];
        if (!['image/png', 'image/jpeg'].includes(file?.type)) {
            setError(error => ({
                ...error,
                foto: `Tipe file tidak didukung: ${file?.type}`,
            }));
        } else if (file?.size >= 512000) {
            setError(error => ({
                error,
                foto: `Ukuran file terlalu besar > 500KB`
            }));
        } else {
            setSubmitting(true);
            setSomethingChange(true);
            const fotoExt = file.name.substring(file?.name.lastIndexOf('.'));
            const fotoRef = `${match.params.produkId}${fotoExt}`;
            const fotoSnapshot = produkStorageRef._location.path_ + fotoRef;

            const storageRef = ref(firebase.storage, fotoSnapshot);

            const uploadTask = uploadBytesResumable(storageRef, file);
            // Listen for state changes, errors, and completion of the upload.
            uploadTask.on('state_changed',
                (snapshot) => {
                    // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.info('Upload is ' + progress + '% done');
                    switch (snapshot.state) {
                        case 'paused':
                            console.info('Upload is paused');
                            break;
                        case 'running':
                            console.info('Upload is running');
                            break;
                        default:
                            break;
                    }
                },
                (e) => {
                    setSubmitting(false);
                    setSomethingChange(false);
                    setError(error => ({
                        error,
                        foto: e.message
                    }));
                },
                () => {
                    // Upload completed successfully, now we can get the download URL
                    getDownloadURL(uploadTask.snapshot.ref)
                        .then((downloadURL) => {
                            console.info('File available at', downloadURL);
                            setForm(currentForm => ({
                                ...currentForm,
                                foto: downloadURL.toString()
                            }));
                            setError(error => ({
                                error,
                                foto: ''
                            }));
                            setSubmitting(false);
                            setSomethingChange(false);
                        })
                        .catch((e) => {
                            setSubmitting(false);
                            setSomethingChange(false);
                            setError(error => ({
                                ...error,
                                foto: e.message,
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
                        onSubmit={handleSubmit}>
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
                            src={form.foto}
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