import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, Link as RouterLink, useNavigate } from 'react-router-dom';
import { setRooms } from '../../../store/slices/roomSlice'; 
import RoomCard from '../../../components/room/RoomCard'; 
import { 
  Container, Typography, Box, Grid, Button, Paper, CircularProgress, CardMedia, ImageList, ImageListItem 
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit'; // For future edit property button

const PropertyDetailPage = () => {
  const { propertyId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate(); 

  const { properties, loading: propertyLoading, error: propertyError } = useSelector((state) => state.property);
  const property = properties.find(p => p.id === propertyId);

  const { rooms, loading: roomsLoading, error: roomsError } = useSelector((state) => state.room);

  useEffect(() => {
    // Assuming properties are loaded by dashboard or App.js.
    // Load rooms if not present in store
    if (!rooms.length && propertyId) { // Only load if rooms are empty and propertyId is available
      // dispatch(setRoomLoading(true)); // Assuming you have room loading state
      try {
        const allRooms = JSON.parse(localStorage.getItem('rooms')) || [];
        dispatch(setRooms(allRooms)); 
        // dispatch(clearRoomError()); // Assuming you have room error state
      } catch (e) {
        // dispatch(setRoomError(e.toString()));
        console.error("Error loading rooms from localStorage", e);
      } finally {
        // dispatch(setRoomLoading(false));
      }
    }
  }, [dispatch, rooms.length, propertyId]);

  if (propertyLoading || roomsLoading) {
    return (
      <Container>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
          <CircularProgress />
          <Typography variant="h6" sx={{ ml: 2 }}>Loading property details...</Typography>
        </Box>
      </Container>
    );
  }

  if (propertyError) return <Container><Typography color="error">Error loading property: {propertyError}</Typography></Container>;
  if (!property) return <Container><Typography variant="h6">Property not found.</Typography><Button component={RouterLink} to="/owner/dashboard">Back to Dashboard</Button></Container>;
  
  const relevantRooms = rooms.filter(room => room.propertyId === propertyId);

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Grid container spacing={3}>
          {/* Property Information Section */}
          <Grid item xs={12}>
            <Paper elevation={3} sx={{ p: 3 }}>
              <Grid container spacing={2} justifyContent="space-between" alignItems="center">
                <Grid item>
                  <Typography variant="h4" component="h1" gutterBottom>
                    {property.name}
                  </Typography>
                </Grid>
                <Grid item>
                  {/* Placeholder for Edit Property Button */}
                  {/* <Button variant="outlined" startIcon={<EditIcon />} onClick={() => navigate(`/owner/property/${propertyId}/edit`)}>
                    Edit Property
                  </Button> */}
                </Grid>
              </Grid>
              <Typography variant="h6" color="text.secondary">
                {property.address}, {property.city}, {property.state} {property.zipCode}
              </Typography>
              <Typography variant="body1" sx={{ mt: 2 }}>
                {property.description}
              </Typography>
            </Paper>
          </Grid>

          {/* Property Images Section */}
          {property.imageUrls && property.imageUrls.length > 0 && (
            <Grid item xs={12}>
              <Paper elevation={2} sx={{ p: 2 }}>
                <Typography variant="h5" component="h2" gutterBottom sx={{ mb: 2 }}>
                  Property Images
                </Typography>
                <ImageList sx={{ width: '100%' }} cols={3} rowHeight={200} gap={10}>
                  {property.imageUrls.map((url, index) => (
                    <ImageListItem key={index}>
                      <img
                        src={`${url}?w=164&h=164&fit=crop&auto=format`}
                        srcSet={`${url}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
                        alt={`${property.name} - Image ${index + 1}`}
                        loading="lazy"
                        style={{ borderRadius: '4px', objectFit: 'cover', width: '100%', height: '100%' }}
                      />
                    </ImageListItem>
                  ))}
                </ImageList>
              </Paper>
            </Grid>
          )}

          {/* Rooms Section */}
          <Grid item xs={12}>
            <Paper elevation={2} sx={{ p: 3, mt: 2 }}>
              <Grid container justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                <Grid item>
                  <Typography variant="h5" component="h2">
                    Rooms
                  </Typography>
                </Grid>
                <Grid item>
                  <Button 
                    variant="contained" 
                    color="primary" 
                    startIcon={<AddIcon />} 
                    onClick={() => navigate(`/owner/property/${propertyId}/room/add`)}
                  >
                    Add New Room
                  </Button>
                </Grid>
              </Grid>
              {roomsError && <Typography color="error" sx={{my:1}}>{roomsError}</Typography>}
              {relevantRooms.length > 0 ? (
                <Grid container spacing={2}>
                  {relevantRooms.map(room => (
                    <Grid item xs={12} md={6} lg={4} key={room.id}>
                      <RoomCard room={room} propertyId={propertyId} />
                    </Grid>
                  ))}
                </Grid>
              ) : (
                <Typography variant="body1" color="text.secondary" sx={{mt:2}}>
                  No rooms have been added to this property yet.
                </Typography>
              )}
            </Paper>
          </Grid>
          
          <Grid item xs={12} sx={{ mt: 3, textAlign: 'center' }}>
            <Button variant="outlined" component={RouterLink} to="/owner/dashboard">
              Back to Dashboard
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default PropertyDetailPage;
