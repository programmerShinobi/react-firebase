import { createTheme } from "@mui/material";
import blue from "@mui/material/colors/blue";

const theme = createTheme({

    palette: {
        primary: {
            main: blue[500],
            contrastText: 'white',
        }
    }

});

export default theme;