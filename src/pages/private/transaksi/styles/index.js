import { StyledEngineProvider } from "@mui/material";

const useStyles = (
    <StyledEngineProvider>
        {
            {
                card: {
                    display: 'flex'
                },
                transaksiSummary: {
                    flex: '2 0 auto'
                },
                transaksiActions: {
                    flexDirection: 'column',
                    alignSelf: 'center',
                    textAlign: 'center',
                }
            }
        }
    </StyledEngineProvider>
);

export default useStyles;

