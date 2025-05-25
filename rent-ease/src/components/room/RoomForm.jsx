import React from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { 
  TextField, Button, Grid, Typography, Box, Paper, 
  FormControl, InputLabel, Select, MenuItem, FormHelperText 
} from '@mui/material';

const RoomForm = ({ initialValues, onSubmit, isEdit = false }) => {
  const validationSchema = Yup.object({
    roomNumber: Yup.string().required('Room name/number is required'),
    size: Yup.string().required('Room size is required (e.g., "10x12 sq ft", "2BHK")'),
    rentAmount: Yup.number()
      .typeError('Rent must be a number')
      .positive('Rent amount must be positive')
      .required('Rent amount is required'),
    maintenanceCharge: Yup.number()
      .typeError('Maintenance charge must be a number')
      .min(0, 'Maintenance charge cannot be negative')
      .required('Maintenance charge is required'),
    rentCycleStartDay: Yup.number()
      .typeError('Day must be a number')
      .integer('Day must be an integer')
      .min(1, 'Day must be between 1 and 31')
      .max(31, 'Day must be between 1 and 31')
      .required('Rent cycle start day is required'),
    status: Yup.string()
      .oneOf(['vacant', 'occupied'], 'Invalid status')
      .required('Status is required'),
    renterName: Yup.string().when('status', {
      is: 'occupied',
      then: schema => schema.required('Renter name is required when room is occupied'),
      otherwise: schema => schema.optional(),
    }),
    renterEmail: Yup.string().email('Invalid email format').when('status', {
      is: 'occupied',
      then: schema => schema.required('Renter email is required when room is occupied'),
      otherwise: schema => schema.optional(),
    }),
    renterPhone: Yup.string().matches(/^[0-9]{10}$/, 'Phone number must be 10 digits (e.g. 1234567890)').when('status', {
      is: 'occupied',
      then: schema => schema.required('Renter phone is required when room is occupied'),
      otherwise: schema => schema.optional(),
    }),
  });

  return (
    <Paper elevation={2} sx={{ p: 3 }}>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
        enableReinitialize 
      >
        {({ isSubmitting, values, errors, touched }) => (
          <Form>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  {isEdit ? 'Edit Room Details' : 'Add New Room'}
                </Typography>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Field
                  as={TextField}
                  name="roomNumber"
                  label="Room Name/Number"
                  fullWidth
                  required
                  error={touched.roomNumber && Boolean(errors.roomNumber)}
                  helperText={touched.roomNumber && errors.roomNumber}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Field
                  as={TextField}
                  name="size"
                  label="Size (e.g., 10x12 sq ft, 2BHK)"
                  fullWidth
                  required
                  error={touched.size && Boolean(errors.size)}
                  helperText={touched.size && errors.size}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Field
                  as={TextField}
                  type="number"
                  name="rentAmount"
                  label="Rent Amount (per cycle)"
                  fullWidth
                  required
                  error={touched.rentAmount && Boolean(errors.rentAmount)}
                  helperText={touched.rentAmount && errors.rentAmount}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Field
                  as={TextField}
                  type="number"
                  name="maintenanceCharge"
                  label="Maintenance Charge (per cycle)"
                  fullWidth
                  required
                  error={touched.maintenanceCharge && Boolean(errors.maintenanceCharge)}
                  helperText={touched.maintenanceCharge && errors.maintenanceCharge}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Field
                  as={TextField}
                  type="number"
                  name="rentCycleStartDay"
                  label="Rent Cycle Start Day (1-31)"
                  fullWidth
                  required
                  error={touched.rentCycleStartDay && Boolean(errors.rentCycleStartDay)}
                  helperText={touched.rentCycleStartDay && errors.rentCycleStartDay}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl 
                  fullWidth 
                  variant="outlined" 
                  required 
                  error={touched.status && Boolean(errors.status)}
                >
                  <InputLabel id="status-label">Status</InputLabel>
                  <Field
                    as={Select}
                    labelId="status-label"
                    name="status"
                    label="Status"
                    value={values.status} // Ensure value is controlled
                  >
                    <MenuItem value="vacant">Vacant</MenuItem>
                    <MenuItem value="occupied">Occupied</MenuItem>
                  </Field>
                  {touched.status && errors.status && <FormHelperText>{errors.status}</FormHelperText>}
                </FormControl>
              </Grid>

              {values.status === 'occupied' && (
                <>
                  <Grid item xs={12}>
                    <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>Tenant Information</Typography>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Field
                      as={TextField}
                      name="renterName"
                      label="Renter Name"
                      fullWidth
                      required={values.status === 'occupied'}
                      error={touched.renterName && Boolean(errors.renterName)}
                      helperText={touched.renterName && errors.renterName}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Field
                      as={TextField}
                      name="renterEmail"
                      label="Renter Email"
                      type="email"
                      fullWidth
                      required={values.status === 'occupied'}
                      error={touched.renterEmail && Boolean(errors.renterEmail)}
                      helperText={touched.renterEmail && errors.renterEmail}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Field
                      as={TextField}
                      name="renterPhone"
                      label="Renter Phone (10 digits)"
                      fullWidth
                      required={values.status === 'occupied'}
                      error={touched.renterPhone && Boolean(errors.renterPhone)}
                      helperText={touched.renterPhone && errors.renterPhone}
                    />
                  </Grid>
                </>
              )}

              <Grid item xs={12} sx={{ mt: 3 }}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={isSubmitting}
                  fullWidth
                >
                  {isSubmitting ? (isEdit ? 'Updating Room...' : 'Adding Room...') : (isEdit ? 'Update Room' : 'Add Room')}
                </Button>
              </Grid>
            </Grid>
          </Form>
        )}
      </Formik>
    </Paper>
  );
};

export default RoomForm;
