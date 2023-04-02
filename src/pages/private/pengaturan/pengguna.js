import React, { useRef, useState } from "react";
import TextField from "@mui/material/TextField";
import { useFirebase } from "../../../components/FirebaseProvider";
import { updateProfile, updateEmail, sendEmailVerification } from "firebase/auth";
import { useSnackbar } from "notistack";
import isEmail from "validator/lib/isEmail";
import useStyles from "./styles/pengguna";
import Box from "@mui/material/Box/Box";
import Button from "@mui/material/Button/Button";
import Typography from "@mui/material/Typography/Typography";

function Pengguna() {
    const firebase = useFirebase();
    const displayNameRef = useRef();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState({
        displayName: ''
    });

    const { enqueueSnackbar } = useSnackbar();

    const saveDisplayName = async (e) => {

        const displayName = displayNameRef.current.value;
        setError({
            displayName: '',
            email: '',
        });

        if (!displayName) {
            setError({
                displayName: 'Nama wajib diisi'
            });
        } else if (displayName === firebase.auth.currentUser.displayName) {
            setIsSubmitting(false);
        } else {
            setIsSubmitting(true);
            await updateProfile(firebase.auth.currentUser, {
                displayName: displayName
            }).then(() => {
                setIsSubmitting(false);
                enqueueSnackbar('Data pengguna berhasil diperbaharui', { variant: 'success' });
            }).catch((e) => {
                setIsSubmitting(false);
                enqueueSnackbar(`Data pengguna gagal diperbaharui, error :${e}`, { variant: 'error' });
            });
        }
    }

    const emailRef = useRef();
    const saveEmail = async (e) => {
        const email = emailRef.current.value;
        setError({
            email: ''
        });

        if (!email) {
            setError({
                email: 'Email wajib diisi'
            });
        } else if (email === firebase.auth.currentUser.email) {
            setIsSubmitting(false);
        } else if (!isEmail(email)) {
            setError({
                email: 'Email tidak valid'
            });
        } else {
            setIsSubmitting(true);
            await updateEmail(firebase.auth.currentUser, email).then(() => {
                setIsSubmitting(false);
                enqueueSnackbar('Data pengguna berhasil diperbaharui', { variant: 'success' });
            }).catch((e) => {
                setIsSubmitting(false);
                let emailError = '';

                switch (e.code) {
                    case 'auth/email-already-in-use':
                        emailError = 'Email sudah digunakan oleh pengguna lain';
                        break;
                    case 'auth/invalid-email':
                        emailError = 'Email tidak valid';
                        break;
                    case 'auth/requires-recent-login':
                        emailError = 'Silahkan logout, kemudian login kembali untuk memperbarui email'
                        break;
                    default:
                        emailError = 'Terjadi kesalahan silahkan coba lagi, ' + e
                        break;
                }

                setError({
                    email: emailError
                });

            });
        }
    }

    const actionCodeSettings = {
        url: `${window.location.origin}/login`
    };

    const sendEmail = async (e) => {
        setIsSubmitting(true);
        await sendEmailVerification(firebase.auth.currentUser, actionCodeSettings)
            .then(() => {
                setIsSubmitting(false);
                enqueueSnackbar(`Email verifikasi telah dikirim ke ${emailRef.current.value}`, { variant: 'success' });
            })
            .catch((e) => {
                setIsSubmitting(false);
                enqueueSnackbar(`Email verifikasi gagal silahkan coba lagi, ${e}`)
            })
    };

    const styles = useStyles.props.children;
    return (
        <Box style={styles.pengaturanPengguna}>
            <TextField
                variant="standard"
                id="displayName"
                name="displayName"
                label="Nama"
                margin="normal"
                defaultValue={firebase.auth.currentUser.displayName}
                inputProps={{
                    ref: displayNameRef,
                    onBlur: saveDisplayName
                }}
                disabled={isSubmitting}
                helperText={error.displayName}
                error={error.displayName ? true : false}
            />

            <TextField
                variant="standard"
                id="email"
                name="email"
                label="Email"
                margin="normal"
                defaultValue={firebase.auth.currentUser.email}
                inputProps={{
                    ref: emailRef,
                    onBlur: saveEmail
                }}
                disabled={isSubmitting}
                helperText={error.email}
                error={error.email ? true : false}
            />

            {
                firebase.auth.currentUser.emailVerified
                    ? <Typography variant="subtitle1" color="primary">Email sudah terverifikasi</Typography>
                    : <Button
                        onClick={sendEmail}
                        disabled={isSubmitting}
                        variant="outlined"
                        color="primary"
                    >
                        Kirim email verifikasi
                    </Button>
            }
        </Box>
    );
}

export default Pengguna;