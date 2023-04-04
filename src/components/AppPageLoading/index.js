import { CircularProgress } from "@mui/material";
import React from "react";
import useStyles from "./styles";

export default function AppPageLoading() {
    const styles = useStyles.props.children;

    return (
        <div style={styles.loadingBox}>
            <CircularProgress />
        </div>
    )
}