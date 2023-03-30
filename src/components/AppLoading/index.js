import { Container, LinearProgress, Typography } from "@mui/material";
import React from "react";
import useStyles from "./styles";

export default function AppLoading() {
    const styles = useStyles.props.children;

    return (
        <Container maxWidth="xs">
            <div style={styles.loadingBox}>
                <Typography
                    variant="h6"
                    component="h2"
                    style={styles.title}
                >
                    Sale App
                </Typography>
                <LinearProgress />
            </div>
        </Container>
    )
}