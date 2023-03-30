import React from "react";
import { Route, Redirect } from "react-router-dom";
// firebase provider
import { useFirebase } from "./FirebaseProvider";

function PrivateRoute({ component: Component, ...restProps }) {
    const firebase = useFirebase();
    return (
        <Route
            {...restProps}
            render={props => {
                return firebase.auth.currentUser
                    ?
                    <Component {...props} />
                    :
                    <Redirect
                        to={{
                            pathname: '/login',
                            state: {
                                from: props.location
                            }
                        }}
                    />
            }}
        />
    )
}

export default PrivateRoute;