import React from 'react';
import { Container, Box, Typography, Paper } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom'; // For internal navigation

const AuthLayout = ({ children, title }) => {
  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <RouterLink to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
          <Typography component="h1" variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
            RentEase
          </Typography>
        </RouterLink>
        <Paper elevation={3} sx={{ padding: 4, marginTop: 2, width: '100%' }}>
          <Typography component="h2" variant="h5" align="center" gutterBottom>
            {title}
          </Typography>
          {children}
        </Paper>
      </Box>
    </Container>
  );
};

export default AuthLayout;
