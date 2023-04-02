import theme from "../../../../config/theme";
import { StyledEngineProvider } from "@mui/material";

const useStyles = (
    <StyledEngineProvider>
        {
            {
                pengaturanToko: {
                    display: 'flex',
                    flexDirection: 'column',
                    width: 300
                },
                buttons: {
                    marginTop: theme.spacing(3),
                },
            }
        }
    </StyledEngineProvider>
);

export default useStyles;

