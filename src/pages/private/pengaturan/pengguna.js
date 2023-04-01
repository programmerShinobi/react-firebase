import React, { useRef, useState } from "react";
import TextField from "@mui/material/TextField";
import { useFirebase } from "../../../components/FirebaseProvider";
import { updateProfile } from "firebase/auth";
import { useSnackbar } from "notistack";

function Pengguna() {
    const displayNameRef = useRef();
    const firebase = useFirebase();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState({
        displayName: ''
    });

    const { enqueueSnackbar } = useSnackbar()

    const saveDisplayName = async (e) => {

        const displayName = displayNameRef.current.value;
        setError({
            displayName: ''
        });

        if (!displayName) {
            setError({
                displayName: 'Nama Wajib diisi'
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
    return (
        <>
            <TextField
                fullWidth
                variant="standard"
                id="displayName"
                name="displayName"
                label="Nama"
                defaultValue={firebase.auth.currentUser.displayName}
                inputProps={{
                    ref: displayNameRef,
                    onBlur: saveDisplayName
                }}
                disabled={isSubmitting}
                helperText={error.displayName}
                error={error.displayName ? true : false}
            />
        </>
    );
}

export default Pengguna;