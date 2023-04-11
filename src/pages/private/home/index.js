import React, { useEffect, useState } from "react";

// firebase
import { useFirebase } from "../../../components/FirebaseProvider";
import { collection } from "firebase/firestore";
import { useCollection } from "react-firebase-hooks/firestore";

// material-ui
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListSubheader from "@mui/material/ListSubheader";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import TextField from "@mui/material/TextField";

// icon
import ListItemIcon from "@mui/material/ListItemIcon";
import ImageIcon from "@mui/icons-material/Image";

// page
import AppPageLoading from "../../../components/AppPageLoading";

// styles
import useStyles from "./styles";

function Home() {
    const firebase = useFirebase();

    const produkCol = collection(firebase.firestore, `toko/${firebase.user.uid}/produk`);

    const [snapshotProduk, loadingProduk] = useCollection(produkCol);

    const [produkItems, setProdukItems] = useState([]);

    const [filterProduk, setFilterProduk] = useState('');

    useEffect(() => {
        if (snapshotProduk) {
            setProdukItems(snapshotProduk?.docs.filter((produkDoc) => {
                if (filterProduk) {
                    return produkDoc.data().nama.toLowerCase().includes(filterProduk.toLowerCase())
                }
                return true;
            }));
        }
    }, [snapshotProduk, filterProduk])

    if (loadingProduk) {
        return (<AppPageLoading />);
    }

    const styles = useStyles.props.children;
    return (
        <>
            <Typography
                variant="h5"
                component="h1"
                paragraph
            >
                Buat Transaksi Baru
            </Typography>

            <Grid container>
                <Grid item
                    xs={12}
                >
                    <List
                        style={styles.produkList}
                        component="nav"
                        subheader={(
                            <ListSubheader
                                component="div"
                            >
                                <TextField
                                    fullWidth
                                    variant="standard"
                                    margin="normal"
                                    label="Cari produk"
                                    onChange={(e) => {
                                        setFilterProduk(e.target.value);
                                    }}
                                />
                            </ListSubheader>
                        )}
                    >
                        {
                            produkItems?.map((produkDoc) => {
                                const produkData = produkDoc.data();
                                return (
                                    <ListItem
                                        key={produkDoc.id}
                                        button
                                        disabled={!produkData.stok}
                                    >
                                        {
                                            produkData.foto
                                                ? <ListItemAvatar>
                                                    <Avatar
                                                        style={styles.foto}
                                                        src={produkData.foto}
                                                        alt={produkData.nama}
                                                    />
                                                </ListItemAvatar>
                                                : <ListItemIcon>
                                                    <ImageIcon
                                                        style={styles.fotoPlaceholder}
                                                        color="disabled"
                                                    />
                                                </ListItemIcon>
                                        }
                                        <ListItemText
                                            primary={produkData.nama}
                                            secondary={`Stok : ${produkData.stok || 0}`}
                                        >

                                        </ListItemText>
                                    </ListItem>
                                )
                            })
                        }
                    </List>
                </Grid>
            </Grid>
        </>
    );
}

export default Home;
