import React, { useState } from "react";

// material-ui
import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";
import useStyles from "./styles/grid";

// page
import AddDialog from "./add";

function GridProduk() {
    const [openAddDialog, setOpenAddDialog] = useState(false);

    const styles = useStyles.props.children;
    return (
        <>
            <h1>Halaman Grid Produk</h1>
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