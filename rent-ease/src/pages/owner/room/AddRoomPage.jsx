import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams, Link as RouterLink } from 'react-router-dom';
import RoomForm from '../../../components/room/RoomForm';
import { addRoom } from '../../../store/slices/roomSlice';
import { Container, Typography, Box, Button } from '@mui/material';

const AddRoomPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { propertyId } = useParams(); 

  const { properties } = useSelector(state => state.property);
  const property = properties.find(p => p.id === propertyId);

  const initialValues = {
    roomNumber: '',
    size: '',
    rentAmount: '',
    maintenanceCharge: 0, 
    rentCycleStartDay: 1, 
    status: 'vacant', 
    renterName: '',
    renterEmail: '',
    renterPhone: '',
    propertyId: propertyId, 
  };

  const handleSubmit = (values, { setSubmitting }) => {
    dispatch(addRoom({ ...values, propertyId })); 
    setSubmitting(false);
    alert('Room added successfully!'); // Consider Snackbar
    navigate(`/owner/property/${propertyId}`); 
  };

  if (!propertyId) {
    return (
      <Container>
        <Typography color="error" variant="h6">Error: Property ID is missing.</Typography>
        <Button component={RouterLink} to="/owner/dashboard" variant="outlined" sx={{mt:2}}>
            Back to Dashboard
        </Button>
      </Container>
    );
  }
  
  if (!property) {
     return (
      <Container>
        <Typography color="error" variant="h6">Error: Property not found.</Typography>
        <Button component={RouterLink} to="/owner/dashboard" variant="outlined" sx={{mt:2}}>
            Back to Dashboard
        </Button>
      </Container>
    );
  }


  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
         <Typography variant="h5" component="h1" gutterBottom>
            Add New Room to Property: {property.name}
        </Typography>
        <RoomForm initialValues={initialValues} onSubmit={handleSubmit} isEdit={false} />
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

export default AddRoomPage;
