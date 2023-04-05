import React, { useState } from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';

// firebase
import { useFirebase } from "../../../components/FirebaseProvider";
import { addDoc, collection } from 'firebase/firestore';

// material-ui
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

function AddDialog({ history, open, handleClose }) {
    const [nama, setNama] = useState('');
    const [error, setError] = useState('');

    const firebase = useFirebase();

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSomethingChange, setIsSomeThingChange] = useState(false);

    const handleSimpan = async (e) => {

        setIsSubmitting(true);
        await addDoc(collection(firebase.firestore, `toko/${firebase.user.uid}/produk`), { nama })
            .then((result) => {
                setIsSubmitting(false);
                setIsSomeThingChange(false);
                history.push(`/produk/edit/${result.id}`);

            })
            .catch((e) => {
                setIsSubmitting(false);
                setIsSomeThingChange(false);
                setError(e.message);
            });
    }

    return (
        <div>
            <Dialog
                disableBackdropClick={isSubmitting}
                disableEscapeKeyDown={isSubmitting}
                open={open}
                onClose={handleClose}
            >
                <DialogTitle>Buat Produk Baru</DialogTitle>
                <DialogContent dividers>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="nama"
                        label="Nama Produk"
                        variant="standard"
                        value={nama}
                        onChange={(e) => {
                            setError('');
                            setIsSomeThingChange(true);
                            setNama(e.target.value);
                        }}
                        helperText={error}
                        error={error ? true : false}
                        disabled={isSubmitting}
                    />
                </DialogContent>
                <DialogActions>
                    <Button
                        color="error"
                        disabled={isSubmitting}
                        onClick={handleClose}
                    >
                        Batal
                    </Button>
                    <Button
                        onClick={handleSimpan}
                        color="primary"
                        disabled={isSubmitting || !isSomethingChange}
                    >
                        Simpan
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

AddDialog.propTypes = {
    open: PropTypes.bool.isRequired,
    handleClose: PropTypes.func.isRequired
}

export default withRouter(AddDialog);