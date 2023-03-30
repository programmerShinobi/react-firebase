import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

// komponent halaman
import Registrasi from "./pages/registrasi";
import Login from "./pages/login";
import LupaPassword from "./pages/lupa-password";
import NotFound from "./pages/404";
import Private from "./pages/private";
import PrivateRoute from "./components/PrivateRoute";

// firebase context provider
import FirebaseProvider from "./components/FirebaseProvider";

import { ThemeProvider } from '@mui/material';
import theme from './config/theme';
import { SnackbarProvider } from 'notistack';

function App() {
  return (
    <React.Fragment>
      <CssBaseline />
      <ThemeProvider theme={theme}>
        <SnackbarProvider maxSnack={3} autoHideDuration={3000}>
          <FirebaseProvider>
            <Router>
              <Switch>
                <PrivateRoute exact path="/" component={Private} />
                <PrivateRoute path="/transaksi" component={Private} />
                <PrivateRoute path="/produk" component={Private} />
                <PrivateRoute path="/pengaturan" component={Private} />
                <Route path="/registrasi" component={Registrasi} />
                <Route path="/login" component={Login} />
                <Route path="/lupa-password" component={LupaPassword} />
                <Route component={NotFound} />
              </Switch>
            </Router>
          </FirebaseProvider>
        </SnackbarProvider>
      </ThemeProvider>
    </React.Fragment>
  );
}

export default App;
