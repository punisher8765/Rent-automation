import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link as RouterLink } from 'react-router-dom';
import { setRooms, setLoading as setRoomLoading, setError as setRoomError, clearError as clearRoomError } from '../../../store/slices/roomSlice';
import { setProperties, setLoading as setPropertyLoading, setError as setPropertyError, clearError as clearPropertyError } from '../../../store/slices/propertySlice';
import { 
  Container, Grid, Typography, Box, CircularProgress, Card, CardContent, CardMedia, CardActions, Button 
} from '@mui/material';

const TenantDashboardPage = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { rooms, loading: roomsLoading, error: roomsError } = useSelector((state) => state.room);
  const { properties, loading: propertiesLoading, error: propertiesError } = useSelector((state) => state.property);

  useEffect(() => {
    const loadInitialData = (data, dataKey, setFn, setLoadingFn, setErrorFn, clearErrorFn) => {
      if (!data.length) {
        dispatch(setLoadingFn(true));
        try {
          const storedData = JSON.parse(localStorage.getItem(dataKey)) || [];
          dispatch(setFn(storedData));
          dispatch(clearErrorFn());
        } catch (e) {
          dispatch(setErrorFn(e.toString()));
        } finally {
          dispatch(setLoadingFn(false));
        }
      }
    };
    loadInitialData(rooms, 'rooms', setRooms, setRoomLoading, setRoomError, clearRoomError);
    loadInitialData(properties, 'properties', setProperties, setPropertyLoading, setPropertyError, clearPropertyError);
  }, [dispatch, rooms.length, properties.length]);

  if (roomsLoading || propertiesLoading) {
    return (
      <Container>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
          <CircularProgress />
          <Typography variant="h6" sx={{ ml: 2 }}>Loading your dashboard...</Typography>
        </Box>
      </Container>
    );
  }

  if (roomsError) return <Container><Typography color="error">Error loading room information: {roomsError}</Typography></Container>;
  if (propertiesError) return <Container><Typography color="error">Error loading property information: {propertiesError}</Typography></Container>;

  const tenantRooms = user ? rooms.filter(room => room.renterEmail === user.email && room.status === 'occupied') : [];
  const assignedPropertiesMap = new Map();
  tenantRooms.forEach(room => {
    const property = properties.find(p => p.id === room.propertyId);
    if (property) {
      if (!assignedPropertiesMap.has(property.id)) {
        assignedPropertiesMap.set(property.id, { ...property, rooms: [] });
      }
      assignedPropertiesMap.get(property.id).rooms.push(room);
    }
  });
  const assignedProperties = Array.from(assignedPropertiesMap.values());

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Tenant Dashboard
        </Typography>
        {assignedProperties.length > 0 ? (
          <Grid container spacing={3}>
            {assignedProperties.map(property => (
              <Grid item xs={12} md={6} key={property.id}>
                <Card sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                  {property.imageUrls && property.imageUrls.length > 0 && (
                    <CardMedia
                      component="img"
                      height="140"
                      image={property.imageUrls[0]}
                      alt={property.name}
                    />
                  )}
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography gutterBottom variant="h5" component="div">
                      Property: {property.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {property.address}, {property.city}, {property.state} {property.zipCode}
                    </Typography>
                    <Typography variant="h6" component="div" sx={{ mt: 2 }}>
                      Your Room(s):
                    </Typography>
                    {property.rooms.map(room => (
                      <Box key={room.id} sx={{ border: '1px solid #eee', p: 1.5, my: 1, borderRadius: 1 }}>
                        <Typography variant="subtitle1">Room: {room.roomNumber}</Typography>
                        <Typography variant="body2">Size: {room.size}</Typography>
                        <Typography variant="body2">Rent: ${room.rentAmount}</Typography>
                        <CardActions sx={{ p: 0, mt: 1 }}>
                           <Button 
                             size="small" 
                             variant="outlined"
                             component={RouterLink} 
                             to={`/tenant/property/${property.id}/room/${room.id}/details`}
                           >
                             View Room & Bills
                           </Button>
                        </CardActions>
                      </Box>
                    ))}
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Box sx={{ mt: 4, textAlign: 'center' }}>
            <Typography variant="subtitle1">
              You have not been assigned to any rooms yet. Please contact your property owner.
            </Typography>
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default TenantDashboardPage;
