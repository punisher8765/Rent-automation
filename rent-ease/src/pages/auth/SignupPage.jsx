import React from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { signupUser, clearAuthError } from '../../store/slices/authSlice';
import { 
  TextField, Button, Typography, Box, Grid, Link, CircularProgress, 
  FormControl, InputLabel, Select, MenuItem, FormHelperText 
} from '@mui/material';
import AuthLayout from '../../components/common/AuthLayout'; // Import AuthLayout

const SignupPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);

  const initialValues = {
    name: '',
    email: '',
    password: '',
    userType: 'tenant',
  };

  const validationSchema = Yup.object({
    name: Yup.string().required('Required'),
    email: Yup.string().email('Invalid email format').required('Required'),
    password: Yup.string().min(6, 'Password must be at least 6 characters').required('Required'),
    userType: Yup.string().oneOf(['owner', 'tenant'], 'Invalid user type').required('Required'),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    dispatch(clearAuthError());
    try {
      const action = await dispatch(signupUser(values));
      if (signupUser.fulfilled.match(action)) {
        const user = action.payload.user;
        navigate(user.userType === 'owner' ? '/owner/dashboard' : '/tenant/dashboard');
      }
    } catch (err) {
      console.error("Signup submission error:", err);
    }
    setSubmitting(false);
  };

  return (
    <AuthLayout title="Sign Up"> {/* Use AuthLayout */}
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, errors, touched, values }) => (
          <Form>
            <Box sx={{ mt: 1 }}>
              <Field
                as={TextField}
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="name"
                label="Full Name"
                name="name"
                autoComplete="name"
                error={touched.name && Boolean(errors.name)}
                helperText={touched.name && errors.name}
              />
              <Field
                as={TextField}
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                error={touched.email && Boolean(errors.email)}
                helperText={touched.email && errors.email}
              />
              <Field
                as={TextField}
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="new-password"
                error={touched.password && Boolean(errors.password)}
                helperText={touched.password && errors.password}
              />
              <FormControl 
                fullWidth 
                variant="outlined" 
                margin="normal" 
                required 
                error={touched.userType && Boolean(errors.userType)}
              >
                <InputLabel id="userType-label">I am a:</InputLabel>
                <Field
                  as={Select}
                  labelId="userType-label"
                  id="userType"
                  name="userType"
                  label="I am a:"
                  value={values.userType}
                >
                  <MenuItem value="tenant">Tenant</MenuItem>
                  <MenuItem value="owner">Owner</MenuItem>
                </Field>
                {touched.userType && errors.userType && <FormHelperText>{errors.userType}</FormHelperText>}
              </FormControl>

              {error && (
                <Typography color="error" variant="body2" align="center" sx={{ mt: 1 }}>
                  {error}
                </Typography>
              )}
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                sx={{ mt: 3, mb: 2 }}
                disabled={isSubmitting || loading}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Sign Up'}
              </Button>
              <Grid container justifyContent="flex-end">
                <Grid item>
                  <Link component={RouterLink} to="/auth/login" variant="body2">
                    Already have an account? Login
                  </Link>
                </Grid>
              </Grid>
            </Box>
          </Form>
        )}
      </Formik>
    </AuthLayout>
  );
};

export default SignupPage;
