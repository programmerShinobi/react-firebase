import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";

// komponen halaman pengaturan
import Pengguna from "./pengguna";
import Toko from "./toko";
import Paper from "@mui/material/Paper";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import useStyles from "./styles";

function Pengaturan(props) {
  const { location, history } = props;
  const handleChangeTab = (event, value) => {
    history.push(value);
  }
  const styles = useStyles.props.children;
  return (
    <Paper >
      <Tabs
        value={location.pathname}
        indicatorColor="primary"
        textColor="primary"
        onChange={handleChangeTab}
      >
        <Tab label="Pengguna" value="/pengaturan/pengguna" />
        <Tab label="Toko" value="/pengaturan/toko" />
      </Tabs>
      <div style={styles.tabContent}>
        <Switch>
          <Route path="/pengaturan/pengguna" component={Pengguna} />
          <Route path="/pengaturan/toko" component={Toko} />
          <Redirect to="/pengaturan/pengguna" />
        </Switch>
      </div>
    </Paper>
  )
}

export default Pengaturan;