import React from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { useNavigate, Link as RouterLink, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, clearAuthError } from '../../store/slices/authSlice';
import { TextField, Button, Typography, Box, Grid, Link, CircularProgress } from '@mui/material';
import AuthLayout from '../../components/common/AuthLayout'; // Import AuthLayout

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation(); // Call useLocation
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);

  const initialValues = {
    email: '',
    password: '',
  };

  const validationSchema = Yup.object({
    email: Yup.string().email('Invalid email format').required('Required'),
    password: Yup.string().required('Required'),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    dispatch(clearAuthError());
    try {
      const action = await dispatch(loginUser(values));
      if (loginUser.fulfilled.match(action)) {
        const user = action.payload.user;
        const from = location.state?.from?.pathname;
        const defaultDashboard = user.userType === 'owner' ? '/owner/dashboard' : '/tenant/dashboard';
        let redirectTo = defaultDashboard;
        if (from && from !== '/auth/login' && from !== '/auth/signup') {
          redirectTo = from;
        }
        navigate(redirectTo, { replace: true });
      }
    } catch (err) {
      console.error("Login submission error:", err);
    }
    setSubmitting(false);
  };

  return (
    <AuthLayout title="Login"> {/* Use AuthLayout */}
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, errors, touched }) => (
          <Form>
            <Box sx={{ mt: 1 }}>
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
                autoFocus
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
                autoComplete="current-password"
                error={touched.password && Boolean(errors.password)}
                helperText={touched.password && errors.password}
              />
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
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Login'}
              </Button>
              <Grid container justifyContent="flex-end">
                <Grid item>
                  <Link component={RouterLink} to="/auth/signup" variant="body2">
                    Don't have an account? Sign Up
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

export default LoginPage;
