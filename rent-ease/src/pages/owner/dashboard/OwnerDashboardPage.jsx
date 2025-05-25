import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link as RouterLink } from 'react-router-dom';
import PropertyCard from '../../../components/property/PropertyCard';
import { setProperties, setLoading, setError, clearError } from '../../../store/slices/propertySlice';
import { Container, Grid, Typography, Button, Box, CircularProgress } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

const OwnerDashboardPage = () => {
  const dispatch = useDispatch();
  const { properties, loading, error } = useSelector((state) => state.property);
  // const { user } = useSelector((state) => state.auth); // For future owner-specific filtering

  useEffect(() => {
    // This effect simulates loading properties if they aren't already in the store.
    // In a real app, this might be an API call if properties weren't loaded on App init.
    if (!properties.length) { // Only load if properties are empty
        dispatch(setLoading(true));
        try {
          const storedProperties = JSON.parse(localStorage.getItem('properties')) || [];
          // Future: Filter properties by ownerId if 'user' object and 'ownerId' on property exist
          // const ownerProperties = storedProperties.filter(p => p.ownerId === user?.id);
          // dispatch(setProperties(ownerProperties));
          dispatch(setProperties(storedProperties)); // For now, load all
          dispatch(clearError());
        } catch (e) {
          dispatch(setError(e.toString()));
        } finally {
          dispatch(setLoading(false));
        }
    }
  }, [dispatch, properties.length]); // Removed 'user' from deps for now

  if (loading) {
    return (
      <Container>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
          <CircularProgress />
          <Typography variant="h6" sx={{ ml: 2 }}>Loading properties...</Typography>
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Typography color="error" variant="h6">Error loading properties: {error}</Typography>
      </Container>
    );
  }

  // const ownerProperties = properties; // Assuming all properties in slice are for this owner for now

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Grid container justifyContent="space-between" alignItems="center" spacing={2}>
          <Grid item>
            <Typography variant="h4" component="h1" gutterBottom>
              Owner Dashboard
            </Typography>
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              component={RouterLink}
              to="/owner/property/add"
            >
              Add New Property
            </Button>
          </Grid>
        </Grid>
        
        {properties && properties.length > 0 ? (
          <Grid container spacing={3} sx={{ mt: 2 }}>
            {properties.map((property) => (
              <Grid item xs={12} sm={6} md={4} key={property.id}>
                <PropertyCard property={property} />
              </Grid>
            ))}
          </Grid>
        ) : (
          <Box sx={{ mt: 4, textAlign: 'center' }}>
            <Typography variant="subtitle1">
              You haven't added any properties yet. Click "Add New Property" to get started.
            </Typography>
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default OwnerDashboardPage;
