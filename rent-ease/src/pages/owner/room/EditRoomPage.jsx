import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams, Link as RouterLink } from 'react-router-dom';
import RoomForm from '../../../components/room/RoomForm';
import { updateRoom } from '../../../store/slices/roomSlice';
import { Container, Typography, Box, Button, CircularProgress } from '@mui/material';

const EditRoomPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { propertyId, roomId } = useParams();

  const { rooms, loading: roomsLoading, error: roomsError } = useSelector((state) => state.room);
  const { properties, loading: propertiesLoading, error: propertiesError } = useSelector((state) => state.property);
  
  const roomToEdit = rooms.find(r => r.id === roomId && r.propertyId === propertyId);
  const property = properties.find(p => p.id === propertyId);

  if (roomsLoading || propertiesLoading) {
    return (
        <Container>
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
                <CircularProgress />
                <Typography variant="h6" sx={{ ml: 2 }}>Loading room data...</Typography>
            </Box>
        </Container>
    );
  }

  if (!roomToEdit) {
    return (
      <Container>
        <Typography color="error" variant="h6" sx={{my:2}}>
            Room not found or does not belong to this property.
        </Typography>
        <Button 
            variant="outlined"
            component={RouterLink} 
            to={propertyId ? `/owner/property/${propertyId}` : '/owner/dashboard'}
        >
            Back to {propertyId ? 'Property Details' : 'Dashboard'}
        </Button>
      </Container>
    );
  }
  
  if (!property) {
    return (
      <Container>
        <Typography color="error" variant="h6" sx={{my:2}}>
            Associated property not found.
        </Typography>
         <Button variant="outlined" component={RouterLink} to="/owner/dashboard">
            Back to Dashboard
        </Button>
      </Container>
    );
  }

  const initialValues = {
    roomNumber: roomToEdit.roomNumber || '',
    size: roomToEdit.size || '',
    rentAmount: roomToEdit.rentAmount || '',
    maintenanceCharge: roomToEdit.maintenanceCharge || 0,
    rentCycleStartDay: roomToEdit.rentCycleStartDay || 1,
    status: roomToEdit.status || 'vacant',
    renterName: roomToEdit.renterName || '',
    renterEmail: roomToEdit.renterEmail || '',
    renterPhone: roomToEdit.renterPhone || '',
    propertyId: roomToEdit.propertyId, 
    id: roomToEdit.id, 
  };

  const handleSubmit = (values, { setSubmitting }) => {
    const finalValues = { ...values };
    if (finalValues.status === 'vacant') {
      finalValues.renterName = '';
      finalValues.renterEmail = '';
      finalValues.renterPhone = '';
    }
    
    dispatch(updateRoom(finalValues));
    setSubmitting(false);
    alert('Room updated successfully!'); // Consider Snackbar
    navigate(`/owner/property/${propertyId}`); 
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Typography variant="h5" component="h1" gutterBottom>
            Edit Room: {roomToEdit.roomNumber} (Property: {property.name})
        </Typography>
        {roomsError && <Typography color="error">Error loading room data: {roomsError}</Typography>}
        {propertiesError && <Typography color="error">Error loading property data: {propertiesError}</Typography>}
        <RoomForm initialValues={initialValues} onSubmit={handleSubmit} isEdit={true} />
        <Button 
            component={RouterLink} 
            to={`/owner/property/${propertyId}`} 
            variant="outlined" 
            sx={{mt:3}}
        >
            Cancel
        </Button>
      </Box>
    </Container>
  );
};

export default EditRoomPage;
