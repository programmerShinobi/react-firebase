import theme from "../../config/theme";
import { StyledEngineProvider } from "@mui/material";

const useStyles = (
    <StyledEngineProvider>
        {
            {
                paper: {
                    marginTop: theme.spacing(8),
                    padding: theme.spacing(6),
                    textAlign: 'center'
                },

                labelLink: {
                    color: theme.palette.primary.main
                }
            }
        }
    </StyledEngineProvider>
);

export default useStyles;