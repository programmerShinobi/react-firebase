import * as React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Container from '@mui/material/Container';
import Link from '@mui/material/Link';
import MenuIcon from '@mui/icons-material/Menu';
import SignOutIcon from '@mui/icons-material/ExitToApp';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import HomeIcon from '@mui/icons-material/Home';
import StoreIcon from '@mui/icons-material/Store';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';

import ListItemText from '@mui/material/ListItemText';
import Switch from "react-router-dom/Switch";
import Route from "react-router-dom/Route";

// komponen halaman private
import Pengaturan from "./pengaturan";
import Produk from "./produk";
import Transaksi from "./transaksi";
import Home from "./home";
import { AppBar, Drawer } from './styles';
import { useFirebase } from '../../components/FirebaseProvider';
import { signOut } from 'firebase/auth';
import { Settings } from '@mui/icons-material';
import theme from '../../config/theme';

function Copyright(props) {
    return (
        <Typography variant="body2" color="text.secondary" align="center" {...props}>
            {'Copyright © '}
            <Link color="inherit" href="https://mui.com/">
                SaleApp
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}

function PrivateContent() {
    const [open, setOpen] = React.useState(false);
    const toggleDrawer = () => {
        setOpen(!open);
    };
    const firebase = useFirebase();
    const handleSignOut = (e) => {
        if (window.confirm('Apakah yakin keluar dari aplikasi?')) {
            signOut(firebase.auth)
                .then(() => {
                    // Sign-out successful.
                }).catch((error) => {
                    // An error happened.
                });
        }
    }

    return (
        <ThemeProvider theme={theme}>
            <Box sx={{ display: 'flex' }}>
                <AppBar position="absolute" open={open}>
                    <Toolbar
                        sx={{
                            pr: '24px', // keep right padding when drawer closed
                        }}
                    >
                        <IconButton
                            edge="start"
                            color="inherit"
                            aria-label="open drawer"
                            onClick={toggleDrawer}
                            sx={{
                                marginRight: '24px',
                                ...(open && { display: 'none' }),
                            }}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Typography
                            component="h1"
                            variant="h6"
                            color="inherit"
                            noWrap
                            sx={{ flexGrow: 1 }}
                        >
                            <Switch>
                                <Route children="Produk" path="/produk" />
                                <Route children="Transaksi" path="/transaksi" />
                                <Route children="Pengaturan" path="/pengaturan" />
                                <Route children="Home" />
                            </Switch>
                        </Typography>
                        <IconButton color="inherit" onClick={handleSignOut}>
                            <SignOutIcon />
                        </IconButton>
                    </Toolbar>
                </AppBar>
                <Drawer variant="permanent" open={open}>
                    <Toolbar
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'flex-end',
                            px: [1],
                        }}
                    >
                        <IconButton onClick={toggleDrawer}>
                            <ChevronLeftIcon />
                        </IconButton>
                    </Toolbar>
                    <Divider />
                    <List component='nav'>
                        <Route
                            path='/'
                            exact
                            children={({ match, history }) => {
                                return (
                                    <ListItem
                                        button
                                        onClick={() => { history.push('/') }}
                                        selected={match ? true : false}>
                                        <ListItemIcon>
                                            <HomeIcon />
                                        </ListItemIcon>
                                        <ListItemText primary="Home" />
                                    </ListItem>
                                );
                            }} />
                        <Route
                            path='/produk'
                            children={({ match, history }) => {
                                return (
                                    <ListItem
                                        button
                                        onClick={() => { history.push('/produk') }}
                                        selected={match ? true : false}>
                                        <ListItemIcon>
                                            <StoreIcon />
                                        </ListItemIcon>
                                        <ListItemText primary="Produk" />
                                    </ListItem>
                                );
                            }} />
                        <Route
                            path='/transaksi'
                            children={({ match, history }) => {
                                return (
                                    <ListItem
                                        button
                                        onClick={() => { history.push('/transaksi') }}
                                        selected={match ? true : false}>
                                        <ListItemIcon>
                                            <ShoppingCartIcon />
                                        </ListItemIcon>
                                        <ListItemText primary="Transaksi" />
                                    </ListItem>
                                );
                            }} />
                        <Route
                            path='/pengaturan'
                            children={({ match, history }) => {
                                return (
                                    <ListItem
                                        button
                                        onClick={() => { history.push('/pengaturan') }}
                                        selected={match ? true : false}>
                                        <ListItemIcon>
                                            <Settings />
                                        </ListItemIcon>
                                        <ListItemText primary="Pengaturan" />
                                    </ListItem>
                                );
                            }} />
                    </List>
                </Drawer>
                <Box
                    component="main"
                    sx={{
                        backgroundColor: (theme) =>
                            theme.palette.mode === 'light'
                                ? theme.palette.grey[100]
                                : theme.palette.grey[900],
                        flexGrow: 1,
                        height: '100vh',
                        overflow: 'auto',
                    }}
                >
                    <Toolbar />
                    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                        <Switch>
                            <Route path="/pengaturan" component={Pengaturan} />
                            <Route path="/produk" component={Produk} />
                            <Route path="/transaksi" component={Transaksi} />
                            <Route component={Home} />
                        </Switch>
                        <Copyright sx={{ pt: 4 }} />
                    </Container>
                </Box>
            </Box>
        </ThemeProvider >
    );
}

export default function Private() {
    return <PrivateContent />;
}
