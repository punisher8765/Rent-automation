import React from 'react';
import { Formik, Form, Field, FieldArray } from 'formik';
import * as Yup from 'yup';
import { TextField, Button, Grid, Typography, IconButton, Box, Paper } from '@mui/material';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import DeleteIcon from '@mui/icons-material/Delete';

const PropertyForm = ({ initialValues, onSubmit, isEdit = false }) => {
  const validationSchema = Yup.object({
    name: Yup.string().required('Property name is required'),
    address: Yup.string().required('Address is required'),
    city: Yup.string().required('City is required'),
    state: Yup.string().required('State is required'),
    zipCode: Yup.string()
      .required('Zip code is required')
      .matches(/^[0-9]{5}(?:-[0-9]{4})?$/, 'Invalid zip code format (e.g., 12345 or 12345-6789)'),
    description: Yup.string().required('Description is required'),
    imageUrls: Yup.array().of(
      Yup.string().url('Must be a valid URL (e.g., http://example.com/image.png)').required('Image URL is required')
    ).min(1, 'At least one image URL is required'),
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
                  {isEdit ? 'Edit Property Details' : 'Add New Property'}
                </Typography>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Field
                  as={TextField}
                  name="name"
                  label="Property Name"
                  fullWidth
                  required
                  error={touched.name && Boolean(errors.name)}
                  helperText={touched.name && errors.name}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Field
                  as={TextField}
                  name="address"
                  label="Street Address"
                  fullWidth
                  required
                  error={touched.address && Boolean(errors.address)}
                  helperText={touched.address && errors.address}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <Field
                  as={TextField}
                  name="city"
                  label="City"
                  fullWidth
                  required
                  error={touched.city && Boolean(errors.city)}
                  helperText={touched.city && errors.city}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <Field
                  as={TextField}
                  name="state"
                  label="State/Province"
                  fullWidth
                  required
                  error={touched.state && Boolean(errors.state)}
                  helperText={touched.state && errors.state}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <Field
                  as={TextField}
                  name="zipCode"
                  label="Zip/Postal Code"
                  fullWidth
                  required
                  error={touched.zipCode && Boolean(errors.zipCode)}
                  helperText={touched.zipCode && errors.zipCode}
                />
              </Grid>
              <Grid item xs={12}>
                <Field
                  as={TextField}
                  name="description"
                  label="Property Description"
                  fullWidth
                  multiline
                  rows={4}
                  required
                  error={touched.description && Boolean(errors.description)}
                  helperText={touched.description && errors.description}
                />
              </Grid>

              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom sx={{ mt: 1 }}>Image URLs</Typography>
                <FieldArray name="imageUrls">
                  {({ push, remove }) => (
                    <Box>
                      {values.imageUrls && values.imageUrls.length > 0 ? (
                        values.imageUrls.map((url, index) => (
                          <Grid container spacing={1} alignItems="center" key={index} sx={{ mb: 1 }}>
                            <Grid item xs={10} sm={11}>
                              <Field
                                as={TextField}
                                name={`imageUrls.${index}`}
                                label={`Image URL ${index + 1}`}
                                fullWidth
                                size="small"
                                error={touched.imageUrls && touched.imageUrls[index] && errors.imageUrls && Boolean(errors.imageUrls[index])}
                                helperText={touched.imageUrls && touched.imageUrls[index] && errors.imageUrls && errors.imageUrls[index]}
                              />
                            </Grid>
                            <Grid item xs={2} sm={1}>
                              <IconButton onClick={() => remove(index)} color="error">
                                <DeleteIcon />
                              </IconButton>
                            </Grid>
                          </Grid>
                        ))
                      ) : null}
                      <Button
                        type="button"
                        variant="outlined"
                        startIcon={<AddPhotoAlternateIcon />}
                        onClick={() => push('')}
                      >
                        Add Image URL
                      </Button>
                       {typeof errors.imageUrls === 'string' && ( // To display array-level errors like "min 1"
                            <Typography color="error" variant="caption" display="block" sx={{mt:1}}>
                                {errors.imageUrls}
                            </Typography>
                        )}
                    </Box>
                  )}
                </FieldArray>
              </Grid>

              <Grid item xs={12} sx={{ mt: 3 }}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={isSubmitting}
                  fullWidth
                >
                  {isSubmitting ? (isEdit ? 'Updating Property...' : 'Adding Property...') : (isEdit ? 'Update Property' : 'Add Property')}
                </Button>
              </Grid>
            </Grid>
          </Form>
        )}
      </Formik>
    </Paper>
  );
};

export default PropertyForm;
