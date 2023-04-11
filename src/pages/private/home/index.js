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
import Table from "@mui/material/Table";
import TableRow from "@mui/material/TableRow";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";

// icon
import ListItemIcon from "@mui/material/ListItemIcon";
import ImageIcon from "@mui/icons-material/Image";

// page
import AppPageLoading from "../../../components/AppPageLoading";

// styles
import useStyles from "./styles";
import { useSnackbar } from "notistack";
import { currency } from "../../../utils/formatter";

function Home() {
    const firebase = useFirebase();

    const produkCol = collection(firebase.firestore, `toko/${firebase.user.uid}/produk`);

    const [snapshotProduk, loadingProduk] = useCollection(produkCol);

    const [produkItems, setProdukItems] = useState([]);

    const [filterProduk, setFilterProduk] = useState('');

    const [transaksi, setTransaksi] = useState({
        items: {

        },
        total: 0
    })

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

    const { enqueueSnackbar } = useSnackbar();

    const addItem = (produkDoc) => (e) => {
        let newItem = { ...transaksi.items[produkDoc.id] };
        const produkData = produkDoc.data();

        if (newItem.jumlah) {
            newItem.jumlah = newItem.jumlah + 1;
            newItem.subtotal = produkData.harga * newItem.jumlah;
        } else {
            newItem.jumlah = 1;
            newItem.harga = produkData.harga;
            newItem.subtotal = produkData.harga;
            newItem.nama = produkData.nama;
        }

        const newItems = {
            ...transaksi.items,
            [produkDoc.id]: newItem
        };
        if (newItem.jumlah > produkData.stok) {

            enqueueSnackbar('Jumlah melebihi stok produk', { variant: 'error' })
        } else {

            setTransaksi({
                ...transaksi,
                items: newItems,
                total: Object.keys(newItems).reduce((total, k) => {
                    const item = newItems[k];
                    return total + parseInt(item.subtotal);
                }, 0)

            })
        }

    }

    const handleChangeJumlah = (k) => (e) => {
        let newItem = { ...transaksi.items[k] };

        newItem.jumlah = parseInt(e.target.value) > 0 ? parseInt(e.target.value) : 1;
        newItem.subtotal = newItem.harga * newItem.jumlah;

        const newItems = {
            ...transaksi.items,
            [k]: newItem
        };

        const produkDoc = produkItems.find((item) => item.id === k);

        const produkData = produkDoc.data();

        if (newItem.jumlah > produkData.stok) {

            enqueueSnackbar('Jumlah melebihi stok produk', { variant: 'error' })
        } else {

            setTransaksi({
                ...transaksi,
                items: newItems,
                total: Object.keys(newItems).reduce((total, k) => {
                    const item = newItems[k];
                    return total + parseInt(item.subtotal);
                }, 0)

            })
        }
    }

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
                    <Table>
                        <TableHead>
                            <TableCell>Item</TableCell>
                            <TableCell>Jumlah</TableCell>
                            <TableCell>Harga</TableCell>
                            <TableCell>Total</TableCell>
                        </TableHead>
                        <TableBody>
                            {
                                Object.keys(transaksi.items).map(k => {
                                    const item = transaksi.items[k];
                                    return (
                                        <TableRow key={k}>
                                            <TableCell>
                                                {item.nama}
                                            </TableCell>
                                            <TableCell>
                                                <TextField
                                                    size="small"
                                                    variant="standard"
                                                    type="number"
                                                    style={styles.inputJumlah}
                                                    value={item.jumlah}
                                                    onChange={handleChangeJumlah(k)}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                {currency(item.harga)}
                                            </TableCell>
                                            <TableCell>
                                                {currency(item.subtotal)}
                                            </TableCell>
                                        </TableRow>
                                    )
                                })
                            }
                            <TableRow>
                                <TableCell colSpan={3}>
                                    <Typography
                                        variant="subtitle2"
                                    >
                                        Total
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography
                                        variant="h6"
                                    >
                                        {currency(transaksi.total)}
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </Grid>
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
                                    autoFocus
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
                                        onClick={addItem(produkDoc)}
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
