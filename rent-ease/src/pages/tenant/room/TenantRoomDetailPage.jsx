import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, Link as RouterLink, Navigate } from 'react-router-dom';
import { 
  setBills, setLoading as setBillLoading, setError as setBillError, clearError as clearBillError 
} from '../../../store/slices/billSlice';
import { 
  setRooms, setLoading as setRoomLoading, setError as setRoomError, clearError as clearRoomError 
} from '../../../store/slices/roomSlice';
import { 
  setProperties, setLoading as setPropertyLoading, setError as setPropertyError, clearError as clearPropertyError 
} from '../../../store/slices/propertySlice';
import { 
    Container, Typography, Box, Grid, Button, Paper, CircularProgress, Divider, 
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, CardMedia, ImageList, ImageListItem
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PaymentIcon from '@mui/icons-material/Payment'; // For Pay Now
import ReportProblemIcon from '@mui/icons-material/ReportProblem'; // For Dispute Bill

const TenantRoomDetailPage = () => {
  const { propertyId, roomId } = useParams();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);
  const { rooms, loading: roomLoading, error: roomError } = useSelector((state) => state.room);
  const { properties, loading: propertyLoading, error: propertyError } = useSelector((state) => state.property);
  const { bills, loading: billLoading, error: billError } = useSelector((state) => state.bill);

  useEffect(() => {
    const loadDataIfNeeded = (data, dataKey, setFn, setLoadingFn, setErrorFn, clearErrorFn, mapFn) => {
        if (!data.length) {
            dispatch(setLoadingFn(true));
            try {
                const storedData = JSON.parse(localStorage.getItem(dataKey)) || [];
                dispatch(setFn(mapFn ? mapFn(storedData) : storedData));
                dispatch(clearErrorFn());
            } catch (e) {
                dispatch(setErrorFn(e.toString()));
            } finally {
                dispatch(setLoadingFn(false));
            }
        }
    };
    loadDataIfNeeded(rooms, 'rooms', setRooms, setRoomLoading, setRoomError, clearRoomError);
    loadDataIfNeeded(properties, 'properties', setProperties, setPropertyLoading, setPropertyError, clearPropertyError);
    loadDataIfNeeded(bills, 'bills', setBills, setBillLoading, setBillError, clearBillError, 
        allBills => allBills.map(b => ({ ...b, payments: b.payments || [] })));
  }, [dispatch, rooms.length, properties.length, bills.length]);

  const room = rooms.find(r => r.id === roomId && r.propertyId === propertyId);
  const property = properties.find(p => p.id === propertyId);
  const roomBills = bills
    .filter(bill => bill.roomId === roomId)
    .sort((a, b) => new Date(b.generatedDate) - new Date(a.generatedDate));

  const calculateTotalPaid = (billPayments) => {
    return (billPayments || []).reduce((sum, p) => sum + parseFloat(p.amountPaid || 0), 0);
  };

  if (roomLoading || propertyLoading || billLoading) {
    return (
      <Container>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
          <CircularProgress /> <Typography variant="h6" sx={{ ml: 2 }}>Loading details...</Typography>
        </Box>
      </Container>
    );
  }

  if (roomError || propertyError || billError) {
    return <Container><Typography color="error" variant="h6">Error loading page data. Please try again later.</Typography></Container>;
  }

  if (!room || !property) {
    return <Container><Typography variant="h6">Room or property details not found.</Typography><Button component={RouterLink} to="/tenant/dashboard" startIcon={<ArrowBackIcon />}>Back to Dashboard</Button></Container>;
  }

  if (!user || user.email !== room.renterEmail || room.status !== 'occupied') {
    alert('Access Denied: You are not assigned to this room or the room is not marked as occupied by you.');
    return <Navigate to="/tenant/dashboard" replace />;
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Paper elevation={3} sx={{ p: {xs: 2, md: 3}, mb: 3 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Room: {room.roomNumber}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" gutterBottom>
            Property: {property.name} ({property.address}, {property.city})
          </Typography>
          <Divider sx={{ my: 2 }} />
          <Grid container spacing={2}>
            <Grid item xs={12} md={property.imageUrls && property.imageUrls.length > 0 ? 7 : 12}>
                <Typography variant="h6">Room Information</Typography>
                <Typography><strong>Size:</strong> {room.size}</Typography>
                <Typography><strong>Rent:</strong> ${parseFloat(room.rentAmount).toFixed(2)} per cycle</Typography>
                <Typography><strong>Maintenance:</strong> ${parseFloat(room.maintenanceCharge || 0).toFixed(2)} per cycle</Typography>
                <Typography><strong>Rent Cycle Starts On:</strong> Day {room.rentCycleStartDay} of the month</Typography>
                
                {property.description && (
                    <Box sx={{ mt: 2, p:1.5, border: '1px dashed grey', borderRadius:1 }}>
                        <Typography variant="subtitle2">Property Rules/Description:</Typography>
                        <Typography variant="body2" sx={{whiteSpace: 'pre-line'}}>{property.description}</Typography>
                    </Box>
                )}
            </Grid>
            {property.imageUrls && property.imageUrls.length > 0 && (
                 <Grid item xs={12} md={5}>
                    <Typography variant="h6" gutterBottom>Property Images</Typography>
                    <ImageList sx={{ width: '100%', height: 250 }} cols={2} rowHeight={120} gap={8}>
                        {property.imageUrls.slice(0,4).map((url, index) => ( // Show max 4 images
                            <ImageListItem key={index}>
                            <img
                                src={`${url}?w=120&h=120&fit=crop&auto=format`}
                                srcSet={`${url}?w=120&h=120&fit=crop&auto=format&dpr=2 2x`}
                                alt={`Property Image ${index + 1}`}
                                loading="lazy"
                                style={{ borderRadius: '4px', objectFit: 'cover', width: '100%', height: '100%' }}
                            />
                            </ImageListItem>
                        ))}
                    </ImageList>
                </Grid>
            )}
          </Grid>
        </Paper>

        <Paper elevation={2} sx={{ p: {xs: 2, md: 3}, mt: 3 }}>
          <Typography variant="h5" component="h2" gutterBottom>
            Your Bills
          </Typography>
          {roomBills.length > 0 ? (
            <TableContainer>
              <Table size="small">
                <TableHead sx={{backgroundColor: 'grey.100'}}>
                  <TableRow>
                    <TableCell>Month/Year</TableCell>
                    <TableCell align="right">Total</TableCell>
                    <TableCell align="right">Paid</TableCell>
                    <TableCell align="right">Remaining</TableCell>
                    <TableCell>Due Date</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Generated</TableCell>
                    <TableCell align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {roomBills.map(bill => {
                    const totalPaid = calculateTotalPaid(bill.payments);
                    const amountDue = parseFloat(bill.totalAmount) - totalPaid;
                    return (
                      <TableRow key={bill.id} hover>
                        <TableCell>{bill.month}/{bill.year}</TableCell>
                        <TableCell align="right">${parseFloat(bill.totalAmount).toFixed(2)}</TableCell>
                        <TableCell align="right">${totalPaid.toFixed(2)}</TableCell>
                        <TableCell align="right" sx={{ fontWeight: amountDue > 0 ? 'bold' : 'normal', color: amountDue > 0 ? 'error.main' : 'success.main' }}>
                            ${amountDue.toFixed(2)}
                        </TableCell>
                        <TableCell>{bill.dueDate}</TableCell>
                        <TableCell><Chip label={bill.status} size="small" color={
                            bill.status === 'paid' ? 'success' : bill.status === 'partially_paid' ? 'warning' : 'error'
                        }/></TableCell>
                        <TableCell>{bill.generatedDate}</TableCell>
                        <TableCell align="center">
                          {(bill.status === 'pending' || bill.status === 'partially_paid') && (
                            <Button 
                                variant="outlined" 
                                size="small" 
                                startIcon={<PaymentIcon />}
                                onClick={() => alert(`Payment for Bill ID: ${bill.id} - Functionality TBD`)} 
                                sx={{mr:1}}
                            >
                                Pay Now
                            </Button>
                          )}
                          {/* <Button 
                            variant="text" 
                            size="small" 
                            startIcon={<ReportProblemIcon />}
                            color="secondary"
                            onClick={() => alert(`Dispute for Bill ID: ${bill.id} - Functionality TBD`)}
                          >
                            Dispute
                          </Button> */}
                           {bill.payments && bill.payments.length > 0 && (
                             <Typography variant="caption" display="block" sx={{mt:0.5, cursor: 'pointer', color: 'primary.main'}} 
                                onClick={() => alert(JSON.stringify(bill.payments, null, 2))}>
                                {bill.payments.length} Payment(s)
                             </Typography>
                           )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Typography>No bills found for this room yet. Please check back later or contact your property owner.</Typography>
          )}
        </Paper>
        
        <Button 
            component={RouterLink} 
            to="/tenant/dashboard" 
            variant="outlined" 
            startIcon={<ArrowBackIcon />}
            sx={{mt:3}}
        >
            Back to Dashboard
        </Button>
      </Box>
    </Container>
  );
};

export default TenantRoomDetailPage;
