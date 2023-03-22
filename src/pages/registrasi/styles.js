import { StyledEngineProvider } from '@mui/material/styles';

const useStyles = () => {
    return (
        <StyledEngineProvider>
            {{
                blue: '#2196f3'
            }}
        </StyledEngineProvider>
    );
};

export default useStyles;