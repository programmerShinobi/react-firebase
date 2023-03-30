import React from "react";
import { useFirebase } from "../../../components/FirebaseProvider";
import { signOut } from "firebase/auth";
import { Button } from "@mui/material";

function Home() {
    const firebase = useFirebase();
    return (
        <>
            <h1>Halaman Home (Transaksi)</h1>
            <Button
                onClick={
                    (e) => signOut(firebase.auth)
                        .then(() => {
                            // Sign-out successful.
                        }).catch((error) => {
                            // An error happened.
                        })
                }
                color="error"
                variant="contained"
            >
                Sign Out
            </Button>
        </>
    );
}

export default Home;
