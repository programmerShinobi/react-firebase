import { Container, Paper, Typography } from "@mui/material";
import React from "react";
import { Link } from "react-router-dom";
import useStyles from "./styles";
import { useFirebase } from "../../components/FirebaseProvider";

function NotFound() {
    const styles = useStyles.props.children;
    const firebase = useFirebase();
    return (
        <Container maxWidth="xs">
            <Paper style={styles.paper}>
                <Typography variant="subtitle1">
                    Halaman Tidak Ditemukan
                </Typography>
                <Typography variant="h3">
                    404
                </Typography>
                {firebase.auth.currentUser
                    ? (
                        <Typography component={Link} to="/" style={styles.labelLink}>
                            Kembali kehalaman beranda
                        </Typography>
                    ) : (
                        <Typography component={Link} to="/login" style={styles.labelLink}>
                            Kembali kehalaman login
                        </Typography>
                    )
                }
            </Paper>
        </Container>
    )
}

export default NotFound;