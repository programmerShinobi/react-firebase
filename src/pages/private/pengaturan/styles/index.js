import theme from "../../../../config/theme";
import { StyledEngineProvider } from "@mui/material";

const useStyles = (
    <StyledEngineProvider>
        {
            {
                tabContent: {
                    padding: theme.spacing(2)
                }

            }
        }
    </StyledEngineProvider>
);

export default useStyles;

