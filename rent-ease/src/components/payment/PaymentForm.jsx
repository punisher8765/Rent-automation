import React from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { 
  TextField, Button, Grid, Typography, Box, 
  FormControl, InputLabel, Select, MenuItem, FormHelperText 
} from '@mui/material';

const PaymentForm = ({ initialValues, onSubmit, billAmountDue }) => {
  const validationSchema = Yup.object({
    paymentDate: Yup.date()
      .required('Payment date is required')
      .max(new Date(), "Payment date cannot be in the future"),
    amountPaid: Yup.number()
      .typeError('Amount must be a number')
      .positive('Amount paid must be positive')
      .required('Amount paid is required')
      .test(
        'maxAmount',
        `Amount cannot exceed the amount due (${parseFloat(billAmountDue || 0).toFixed(2)})`,
        (value) => {
            if (billAmountDue === undefined || billAmountDue === null) return true; // No limit if billAmountDue is not set
            return value <= parseFloat(billAmountDue);
        }
      ),
    paymentMethod: Yup.string().required('Payment method is required'),
    paymentMethodOther: Yup.string().when('paymentMethod', {
      is: 'Other',
      then: schema => schema.required('Please specify the payment method'),
      otherwise: schema => schema.optional(),
    }),
    notes: Yup.string().optional(),
  });

  return (
    // No Paper component here as it's typically used within a Modal which provides its own Paper
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
              <Field
                as={TextField}
                type="date"
                name="paymentDate"
                label="Payment Date"
                fullWidth
                required
                InputLabelProps={{ shrink: true }} // Ensures label is always visible for date type
                error={touched.paymentDate && Boolean(errors.paymentDate)}
                helperText={touched.paymentDate && errors.paymentDate}
              />
            </Grid>
            <Grid item xs={12}>
              <Field
                as={TextField}
                type="number"
                name="amountPaid"
                label="Amount Paid"
                fullWidth
                required
                error={touched.amountPaid && Boolean(errors.amountPaid)}
                helperText={touched.amountPaid && errors.amountPaid}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl 
                fullWidth 
                variant="outlined" 
                required 
                error={touched.paymentMethod && Boolean(errors.paymentMethod)}
              >
                <InputLabel id="paymentMethod-label">Payment Method</InputLabel>
                <Field
                  as={Select}
                  labelId="paymentMethod-label"
                  name="paymentMethod"
                  label="Payment Method"
                  value={values.paymentMethod} // Ensure value is controlled
                >
                  <MenuItem value=""><em>Select Method</em></MenuItem>
                  <MenuItem value="Cash">Cash</MenuItem>
                  <MenuItem value="Bank Transfer">Bank Transfer</MenuItem>
                  <MenuItem value="UPI">UPI</MenuItem>
                  <MenuItem value="Credit Card">Credit Card</MenuItem>
                  <MenuItem value="Debit Card">Debit Card</MenuItem>
                  <MenuItem value="Other">Other</MenuItem>
                </Field>
                {touched.paymentMethod && errors.paymentMethod && <FormHelperText>{errors.paymentMethod}</FormHelperText>}
              </FormControl>
            </Grid>
            
            {values.paymentMethod === 'Other' && (
              <Grid item xs={12}>
                <Field
                  as={TextField}
                  name="paymentMethodOther"
                  label="Specify Other Method"
                  fullWidth
                  required={values.paymentMethod === 'Other'}
                  error={touched.paymentMethodOther && Boolean(errors.paymentMethodOther)}
                  helperText={touched.paymentMethodOther && errors.paymentMethodOther}
                />
              </Grid>
            )}

            <Grid item xs={12}>
              <Field
                as={TextField}
                name="notes"
                label="Notes (Optional)"
                fullWidth
                multiline
                rows={3}
                error={touched.notes && Boolean(errors.notes)}
                helperText={touched.notes && errors.notes}
              />
            </Grid>

            <Grid item xs={12} sx={{ mt: 2 }}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={isSubmitting}
                fullWidth
              >
                {isSubmitting ? 'Recording Payment...' : 'Record Payment'}
              </Button>
            </Grid>
          </Grid>
        </Form>
      )}
    </Formik>
  );
};

export default PaymentForm;
