import React from "react";
import PropTypes from "prop-types";

// material-ui
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Table from "@mui/material/Table";
import TableRow from "@mui/material/TableRow";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import { currency } from "../../../utils/formatter";

function DetailsDialog({ open, handleClose, transaksi }) {
    return (
        <Dialog
            open={open}
            onClose={handleClose}
        >
            <DialogTitle>Transaksi No. {transaksi.no}</DialogTitle>
            <DialogContent dividers>
                <Table>
                    <TableHead>
                        <TableCell>Item</TableCell>
                        <TableCell>Jumlah</TableCell>
                        <TableCell>Harga</TableCell>
                        <TableCell>Total</TableCell>
                    </TableHead>
                    <TableBody>
                        {transaksi.items &&
                            Object.keys(transaksi.items).map(k => {
                                const item = transaksi.items[k];
                                return (
                                    <TableRow key={k}>
                                        <TableCell>
                                            {item.nama}
                                        </TableCell>
                                        <TableCell>
                                            {item.jumlah}
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
            </DialogContent>
            <DialogActions>
                <Button
                    color="error"
                    variant="outlined"
                    onClick={handleClose}
                >
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    )
}

DetailsDialog.propTypes = {
    open: PropTypes.bool.isRequired,
    handleClose: PropTypes.func.isRequired
}

export default DetailsDialog;