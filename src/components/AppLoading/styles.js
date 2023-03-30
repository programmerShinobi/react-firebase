import React from 'react';
import theme from '../../config/theme';
import { StyledEngineProvider } from '@mui/material';

const useStyles = (
    <StyledEngineProvider>
        {
            {
                title: {
                    color: theme.palette.primary.main,
                    textAlign: 'center'
                },

                loadingBox: {
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    height: '100vh',
                }
            }
        }
    </StyledEngineProvider>
);

export default useStyles;