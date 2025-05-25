import React from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import PropertyForm from '../../../components/property/PropertyForm';
import { addProperty } from '../../../store/slices/propertySlice';
import { Container, Typography, Box } from '@mui/material';

const AddPropertyPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const initialValues = {
    name: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    description: '',
    imageUrls: [''], 
  };

  const handleSubmit = (values, { setSubmitting }) => {
    dispatch(addProperty(values)); 
    setSubmitting(false);
    // Consider using a Snackbar for success messages instead of alert
    alert('Property added successfully!'); 
    navigate('/owner/dashboard'); 
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        {/* Typography for page title is now handled by PropertyForm, or can be added here if needed */}
        <PropertyForm initialValues={initialValues} onSubmit={handleSubmit} isEdit={false} />
      </Box>
    </Container>
  );
};

export default AddPropertyPage;
