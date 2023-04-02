import theme from "../../../../config/theme";
import { StyledEngineProvider } from "@mui/material";

const useStyles = (
    <StyledEngineProvider>
        {
            {
                pengaturanPengguna: {
                    display: 'flex',
                    flexDirection: 'column',
                    width: 300
                }
            }
        }
    </StyledEngineProvider>
);

export default useStyles;

