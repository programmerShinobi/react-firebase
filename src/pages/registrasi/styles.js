import theme from "../../config/theme";
import { StyledEngineProvider } from "@mui/material";

const useStyles = (
    <StyledEngineProvider>
        {
            {
                title: {
                    // color: theme.palette.primary.main
                    textAlign: 'center',
                    marginBottom: theme.spacing(3),
                },

                paper: {
                    marginTop: theme.spacing(8),
                    padding: theme.spacing(6)
                },

                buttons: {
                    marginTop: theme.spacing(6)
                },

                label: {
                    marginTop: theme.spacing(6),
                    textAlign: 'center',
                    color: 'gray'
                },

                labelLink: {
                    color: theme.palette.primary.main
                }

            }
        }
    </StyledEngineProvider>
)




export default useStyles;

