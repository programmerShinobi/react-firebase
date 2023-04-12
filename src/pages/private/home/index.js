import React, { useEffect, useState } from "react";

// firebase
import { useFirebase } from "../../../components/FirebaseProvider";
import { addDoc, collection, doc, query, runTransaction, where } from "firebase/firestore";
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
import Button from "@mui/material/Button";

// icon
import ListItemIcon from "@mui/material/ListItemIcon";
import ImageIcon from "@mui/icons-material/Image";
import SaveIcon from "@mui/icons-material/Save";

// page
import AppPageLoading from "../../../components/AppPageLoading";

// styles
import useStyles from "./styles";
import { useSnackbar } from "notistack";
import { currency } from "../../../utils/formatter";
import format from "date-fns/format";
import { Prompt } from "react-router-dom";

function Home() {

    const todayDateString = format(new Date(), 'yyyy-MM-dd');

    const firebase = useFirebase();

    const produkCol = collection(firebase.firestore, `toko/${firebase.user.uid}/produk`);
    const [snapshotProduk, loadingProduk] = useCollection(produkCol);
    const [produkItems, setProdukItems] = useState([]);
    const [filterProduk, setFilterProduk] = useState('');

    const transaksiCol = collection(firebase.firestore, `toko/${firebase.user.uid}/transaksi`);
    const queryTransaksiCol = query(transaksiCol, where("tanggal", "==", todayDateString));
    const [snapshotTransaksi, loadingTransaksi] = useCollection(queryTransaksiCol);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSomethingChange, setIsSomeThingChange] = useState(false);

    const initialTransaksi = {
        no: '',
        tanggal: todayDateString,
        items: {

        },
        total: 0
    }
    const [transaksi, setTransaksi] = useState(initialTransaksi);

    useEffect(() => {
        if (snapshotProduk) {
            setProdukItems(snapshotProduk?.docs.filter((produkDoc) => {
                if (filterProduk) {
                    return produkDoc.data().nama.toLowerCase().includes(filterProduk.toLowerCase())
                }
                return true;
            }));
        }
    }, [snapshotProduk, filterProduk]);

    useEffect(() => {
        if (snapshotTransaksi) {
            setTransaksi(transaksi => ({
                ...transaksi,
                no: `${transaksi.tanggal}/${snapshotTransaksi.docs.length + 1}`
            }));
        } else {
            setTransaksi((transaksi) => ({
                ...transaksi,
                no: `${transaksi.tanggal}/1`
            }));
        }
    }, [snapshotTransaksi]);

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

        newItem.jumlah = parseInt(e.target.value)
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

    const simpanTransaksi = async (e) => {
        if (Object.keys(transaksi.items).length <= 0) {
            enqueueSnackbar('Tidak ada transaksi untuk disimpan', { variant: 'error' });
            return false;
        } else {
            setIsSubmitting(true);
            setIsSomeThingChange(true);
            await addDoc(transaksiCol, {
                ...transaksi,
                timestamp: Date.now()
            })
                .then(async () => {
                    setIsSubmitting(false);
                    setIsSomeThingChange(false);
                    setTransaksi(transaksi => ({
                        ...initialTransaksi,
                        no: transaksi.no
                    }));
                    enqueueSnackbar('Transaksi berhasil disimpan', { variant: 'success' });
                    const produkIDs = Object.keys(transaksi.items);
                    return Promise.all(produkIDs.map(async (produkId) => {
                        const produkRef = doc(firebase.firestore, `toko/${firebase.user.uid}/produk/${produkId}`);
                        try {
                            await runTransaction(firebase.firestore, async (transaction) => {
                                const produkDoc = await transaction.get(produkRef);
                                if (!produkDoc.exists()) {
                                    throw "Produk tidak ada!";
                                }

                                let newStok = parseInt(produkDoc.data().stok) - parseInt(transaksi.items[produkId].jumlah);
                                if (newStok < 0) {
                                    newStok = 0;
                                }
                                transaction.update(produkRef, { stok: newStok });
                            });
                        } catch (e) {
                            enqueueSnackbar(e.message, { variant: 'error' });
                        }
                    }));
                })
                .catch((e) => {
                    setIsSubmitting(false);
                    setIsSomeThingChange(false);
                    enqueueSnackbar(e.message, { variant: 'error' });
                });
        }

    }

    if (loadingProduk || loadingTransaksi) {
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

            <Grid container spacing={5}>
                <Grid item xs>
                    <TextField
                        variant="standard"
                        size="small"
                        label='No Transaksi'
                        value={transaksi.no}
                        InputProps={{
                            readOnly: true
                        }}
                        disabled={isSubmitting}
                    />
                </Grid>
                <Grid item>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={simpanTransaksi}
                        disabled={isSubmitting}
                    >
                        <SaveIcon style={styles.iconSimpanTransaksi} />
                        Simpan Transaksi
                    </Button>
                </Grid>
            </Grid>
            <Grid container spacing={5}>
                <Grid item
                    xs={12}
                    md={8}
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
                                                    disabled={isSubmitting}
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
                    md={4}
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
                                    disabled={isSubmitting}
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
                                        disabled={!produkData.stok || isSubmitting}
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
            <Prompt
                when={isSomethingChange}
                message="Terdapat perubahan data yang belum disimpan, apakah Anda yakin ingin meninggalkan halaman ini?"
            />
        </>
    );
}

export default Home;
