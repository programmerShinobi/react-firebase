import * as React from 'react';

// import button komponen material UI
import Button from '@mui/material/Button';
import Styles from './styles.module.css';
import useStyles from './styles';

function Registrasi() {
    const classes = useStyles();
    console.info(classes.props.children.blue)
    return (
        <>
            <h1 className={Styles.blue}>Halaman Registrasi</h1>
            <Button color="primary" variant="contained">Click</Button>
        </>
    );
}

export default Registrasi;