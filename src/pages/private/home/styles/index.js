import theme from "../../../../config/theme";
import { StyledEngineProvider } from "@mui/material";

const useStyles = (
    <StyledEngineProvider>
        {
            {
                produkList: {
                    backgroundColor: theme.palette.background.paper,
                    maxHeight: 500,
                    overflow: 'auto',
                    'border-radius': '5px'
                },
                foto: {
                    width: 40
                },
                fotoPlaceholder: {
                    width: 40,
                    alignSelf: 'center',
                    textAlign: 'center'
                },
                inputJumlah: {
                    width: 35
                },
            }
        }
    </StyledEngineProvider>
);

export default useStyles;

