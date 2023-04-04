import React from 'react';
import { StyledEngineProvider } from '@mui/material';

const useStyles = (
    <StyledEngineProvider>
        {
            {
                loadingBox: {
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '50vh',
                }
            }
        }
    </StyledEngineProvider>
);

export default useStyles;