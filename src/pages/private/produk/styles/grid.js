import theme from "../../../../config/theme";
import { StyledEngineProvider } from "@mui/material";

const useStyles = (
    <StyledEngineProvider>
        {
            {
                fab: {
                    position: 'absolute',
                    bottom: theme.spacing(2),
                    right: theme.spacing(2)
                }
            }
        }
    </StyledEngineProvider>
);

export default useStyles;

