import React from "react";
import { useFirebase } from "../../components/FirebaseProvider";
import { Redirect } from "react-router-dom";
import AppLoading from "../../components/AppLoading";

function LupaPassword() {
    const firebase = useFirebase();
    if (firebase.loading) {
        return (<AppLoading />)
    }
    if (firebase.user) {
        return (<Redirect to='/' />)
    }
    return (<h1>Halaman Lupa Password</h1>);
}

export default LupaPassword;