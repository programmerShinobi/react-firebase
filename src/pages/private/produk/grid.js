import React, { useEffect, useState } from "react";

// material-ui
import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";
import useStyles from "./styles/grid";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions"
import Typography from "@mui/material/Typography";
import ImageIcon from "@mui/icons-material/Image";

// page
import AddDialog from "./add";
import AppPageLoading from "../../../components/AppPageLoading";

// firebase
import { useFirebase } from "../../../components/FirebaseProvider";
import { collection } from "firebase/firestore";
import { useCollection } from "react-firebase-hooks/firestore"
import { currency } from "../../../utils/formatter";

function GridProduk() {
    const [openAddDialog, setOpenAddDialog] = useState(false);

    const firebase = useFirebase();

    const produkCol = collection(firebase.firestore, `toko/${firebase.user.uid}/produk`)

    const [snapshot, loading] = useCollection(produkCol);

    const [produkItems, setProdukItems] = useState([]);

    useEffect(() => {
        setProdukItems(snapshot?.docs);
    }, [snapshot]);

    console.info(produkItems);

    if (loading) {
        return (<AppPageLoading />);
    }

    const styles = useStyles.props.children;
    return (
        <>
            <Typography
                variant="h5"
                component="h1"
            >
                Daftar Produk
            </Typography>
            {
                produkItems?.length <= 0 && (
                    <Typography>Belum ada produk</Typography>
                )
            }

            <Grid container spacing={5}>
                {
                    produkItems?.map((produkDoc) => {
                        const produkData = produkDoc.data();
                        return (
                            <Grid
                                key={produkDoc.id}
                                item={true}
                                xs={12}
                                sm={12}
                                md={6}
                                lg={4}
                            >
                                <Card style={styles.card}>
                                    {produkData?.foto && (
                                        <CardMedia
                                            style={styles.foto}
                                            image={produkData.foto}
                                            title={produkData.nama}
                                        />
                                    )}
                                    {!produkData?.foto && (
                                        <div style={styles.fotoPlaceholder}>
                                            <ImageIcon
                                                fontSize="large"
                                                color="disabled"
                                            />
                                        </div>
                                    )}
                                    <CardContent>
                                        <Typography
                                            variant="h5"
                                            noWrap
                                        >
                                            {produkData.nama}
                                        </Typography>
                                        <Typography
                                            variant="subtitle1"
                                        >
                                            Stok : {produkData.stok}
                                        </Typography>
                                        <Typography
                                            variant="subtitle1"
                                        >
                                            {currency(produkData.harga)}
                                        </Typography>

                                    </CardContent>
                                </Card>
                            </Grid>
                        );
                    })
                }
            </Grid>
            <Fab
                style={styles.fab}
                color="primary"
                onClick={(e) => {
                    setOpenAddDialog(true);
                }}
            >
                <AddIcon />
            </Fab>
            <AddDialog
                open={openAddDialog}
                handleClose={() => {
                    setOpenAddDialog(false);
                }}
            />
        </>
    );
}

export default GridProduk;