import * as React from 'react';

// import komponen material UI
import Button from '@mui/material/Button';
import useStyles from './styles';

function Registrasi() {
    const classes = useStyles;
    return (
        <>
            <h1 style={{ color: classes.blue }}>Halaman Registrasi</h1>
            <Button color="primary" variant="contained">Click</Button>
        </>
    );
}

export default Registrasi;