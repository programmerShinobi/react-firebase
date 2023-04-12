import React, { useEffect, useState } from "react";
import { Prompt } from "react-router-dom";

// firebase
import { useFirebase } from "../../../components/FirebaseProvider";
import { collection, deleteDoc, doc } from "firebase/firestore";
import { useCollection } from "react-firebase-hooks/firestore";

// material-ui
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";

// icon
import DeleteIcon from "@mui/icons-material/Delete";
import ViewIcon from "@mui/icons-material/Visibility";

// styles
import { currency } from "../../../utils/formatter";
import { format } from "date-fns";
import useStyles from "./styles";
import { useSnackbar } from "notistack";

// page
import AppPageLoading from "../../../components/AppPageLoading";
import DetailsDialog from "./details";

function Transaksi() {
    const firebase = useFirebase();
    console.info(firebase.user);
    const transaksiCol = collection(firebase.firestore, `toko/${firebase.user.uid}/transaksi`);
    const [snapshot, loading] = useCollection(transaksiCol);
    const [transaksiItems, setTransaksiItems] = useState([]);

    useEffect(() => {
        if (snapshot) {
            setTransaksiItems(snapshot.docs);
        }
    }, [snapshot]);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSomethingChange, setIsSomeThingChange] = useState(false);

    const { enqueueSnackbar } = useSnackbar();

    const handleDelete = (transaksiDoc) => async (e) => {
        if (window.confirm('Anda yakin ingin menghapus transaksi ini?')) {
            setIsSubmitting(true);
            setIsSomeThingChange(true);
            const transaksi = await doc(firebase.firestore, `toko/${firebase.user.uid}/transaksi/${transaksiDoc.id}`);
            await deleteDoc(transaksi).then(() => {
                setIsSubmitting(false);
                setIsSomeThingChange(false);
                enqueueSnackbar('Data transaksi berhasil dihapus', { variant: 'success' });
            }).catch((error) => {
                setIsSubmitting(false);
                setIsSomeThingChange(false);
                enqueueSnackbar('Data transaksi gagal dihapus, ' + error.message, { variant: 'error' });
            });
        }
    }

    const [details, setDetails] = useState({
        open: false,
        transaksi: {}
    });

    const handleCloseDetails = (e) => {
        setDetails({
            open: false,
            transaksi: {}
        })
    }

    const handleOpenDetails = transaksiDoc => (e) => {
        setDetails({
            open: true,
            transaksi: transaksiDoc.data()
        })
    }

    if (loading) {
        return (<AppPageLoading />);
    }

    const styles = useStyles.props.children
    return (
        <>
            <Typography
                variant="h5"
                component="h1"
                paragraph
            >
                Daftar Transaksi
            </Typography>
            {
                transaksiItems.length <= 0 && (
                    <Typography>Belum ada transaksi</Typography>
                )
            }

            <Grid container spacing={5}>
                {
                    transaksiItems.map((transaksiDoc) => {
                        const transaksiData = transaksiDoc.data();
                        return (
                            <Grid
                                key={transaksiDoc.id}
                                item
                                xs={12}
                                sm={12}
                                md={6}
                                lg={4}
                            >
                                <Card
                                    style={styles.card}
                                >
                                    <CardContent
                                        style={styles.transaksiSummary}
                                    >
                                        <Typography
                                            variant="h5"
                                            noWrap
                                        >
                                            {transaksiData.no}
                                        </Typography>
                                        <Typography>
                                            Total: {currency(transaksiData.total)}
                                        </Typography>
                                        <Typography>
                                            Tanggal: {format(new Date(transaksiData.timestamp), 'dd-MM-yyyy hh:mm')}
                                        </Typography>
                                    </CardContent>
                                    <CardActions
                                        style={styles.transaksiActions}
                                    >
                                        <IconButton
                                            onClick={handleOpenDetails(transaksiDoc)}
                                            disabled={isSubmitting}
                                        >
                                            <ViewIcon />
                                        </IconButton>
                                        <IconButton
                                            onClick={handleDelete(transaksiDoc)}
                                            disabled={isSubmitting}
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    </CardActions>
                                </Card>
                            </Grid>
                        )
                    })
                }
            </Grid>
            <Prompt
                when={isSomethingChange}
                message="Terdapat perubahan data yang belum disimpan, apakah Anda yakin ingin meninggalkan halaman ini?"
            />
            <DetailsDialog
                open={details.open}
                handleClose={handleCloseDetails}
                transaksi={details.transaksi}
            />
        </>
    );
}

export default Transaksi;