import React, { ReactNode } from 'react';
import { Box, Typography, Paper, Container } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import AppTheme from '../../theme/AppTheme';

interface PageLayoutProps {
  title: string;
  children: ReactNode;
  actions?: ReactNode;
}

const PageLayout: React.FC<PageLayoutProps> = ({ title, children, actions }) => {
  return (
    <ThemeProvider theme={AppTheme}>
      <Container maxWidth={false} sx={{ py: 3 }}>
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h4" component="h1">
              {title}
            </Typography>
            {actions && (
              <Box sx={{ display: 'flex', gap: 1 }}>
                {actions}
              </Box>
            )}
          </Box>
          <Paper 
            elevation={0} 
            sx={{ 
              p: 3, 
              borderRadius: 2,
              boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)'
            }}
          >
            {children}
          </Paper>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default PageLayout; 