import theme from "../../../../config/theme";
import { StyledEngineProvider } from "@mui/material";

const useStyles = (
    <StyledEngineProvider>
        {
            {
                hideInputFile: {
                    display: "none"
                },

                uploadFotoProduk: {
                    textAlign: "center",
                    padding: theme.spacing(3)
                },
                button: {
                    marginTop: theme.spacing(3)
                },
                previewFotoProduk: {
                    textAlign: 'center',
                    width: '100%',
                    height: '350px',
                    'border-radius': '5px'
                },
            }
        }
    </StyledEngineProvider>
);

export default useStyles;

