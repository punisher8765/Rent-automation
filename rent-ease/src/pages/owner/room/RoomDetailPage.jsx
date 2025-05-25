import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, Link as RouterLink, useNavigate } from 'react-router-dom';
import { 
  setBills, setLoading as setBillLoading, setError as setBillError, clearError as clearBillError, recordPaymentOnBill 
} from '../../../store/slices/billSlice';
import { 
  setRooms, setLoading as setRoomLoading, setError as setRoomError, clearError as clearRoomError 
} from '../../../store/slices/roomSlice';
import PaymentForm from '../../../components/payment/PaymentForm'; 
import { 
    Container, Typography, Box, Grid, Button, Paper, CircularProgress, Modal, Divider, 
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, IconButton
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import AddCardIcon from '@mui/icons-material/AddCard'; // For Add Payment
import ReceiptIcon from '@mui/icons-material/Receipt'; // For Bill Details
import ArrowBackIcon from '@mui/icons-material/ArrowBack';


// Modal style
const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: { xs: '90%', sm: 450 }, // Responsive width
  bgcolor: 'background.paper',
  border: '1px solid #ddd', // Softer border
  borderRadius: 2, // Rounded corners
  boxShadow: 24,
  p: { xs: 2, sm: 3, md: 4 }, // Responsive padding
};

const RoomDetailPage = () => {
  const { propertyId, roomId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedBillForPayment, setSelectedBillForPayment] = useState(null);

  const { rooms, loading: roomLoading, error: roomError } = useSelector((state) => state.room);
  const room = rooms.find(r => r.id === roomId && r.propertyId === propertyId);
  
  const { properties } = useSelector((state) => state.property); // Get property for name
  const property = properties.find(p => p.id === propertyId);

  const { bills, loading: billLoading, error: billError } = useSelector((state) => state.bill);
  const roomBills = bills
    .filter(bill => bill.roomId === roomId)
    .sort((a, b) => new Date(b.generatedDate) - new Date(a.generatedDate));

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

    loadDataIfNeeded(rooms, 'rooms', setRooms, setRoomLoading, setRoomError, clearRoomError, 
        allRooms => allRooms.map(r => ({ ...r, payments: r.payments || [] })));
    loadDataIfNeeded(bills, 'bills', setBills, setBillLoading, setBillError, clearBillError, 
        allBills => allBills.map(b => ({ ...b, payments: b.payments || [] })));
    // Properties usually loaded by PropertyDetailPage or Dashboard, but can add here if direct nav is an issue
    // loadDataIfNeeded(properties, 'properties', setProperties, setPropertyLoading, setPropertyError, clearPropertyError);

  }, [dispatch, rooms.length, bills.length, properties.length]); // Added properties.length

  const handleOpenPaymentModal = (bill) => {
    setSelectedBillForPayment(bill);
    setIsPaymentModalOpen(true);
  };

  const handleClosePaymentModal = () => {
    setSelectedBillForPayment(null);
    setIsPaymentModalOpen(false);
  };

  const handlePaymentSubmit = (paymentData, { setSubmitting }) => {
    if (!selectedBillForPayment) return;
    
    dispatch(recordPaymentOnBill({ billId: selectedBillForPayment.id, paymentData }));
    setSubmitting(false);
    handleClosePaymentModal();
    alert('Payment recorded successfully!'); // Consider Snackbar
  };
  
  const calculateTotalPaid = (billPayments) => {
    return (billPayments || []).reduce((sum, p) => sum + parseFloat(p.amountPaid || 0), 0);
  };

  if (roomLoading || billLoading) { // Add propertyLoading if properties are loaded here
    return (
      <Container>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
          <CircularProgress /> <Typography variant="h6" sx={{ ml: 2 }}>Loading details...</Typography>
        </Box>
      </Container>
    );
  }

  if (roomError) return <Container><Typography color="error">Error loading room: {roomError}</Typography></Container>;
  if (billError) return <Container><Typography color="error">Error loading bills: {billError}</Typography></Container>;
  if (!room) return <Container><Typography variant="h6">Room not found.</Typography><Button component={RouterLink} to={`/owner/property/${propertyId}`} startIcon={<ArrowBackIcon />}>Back to Property</Button></Container>;
  if (!property) return <Container><Typography variant="h6">Property not found.</Typography><Button component={RouterLink} to="/owner/dashboard" startIcon={<ArrowBackIcon />}>Back to Dashboard</Button></Container>;


  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Paper elevation={3} sx={{ p: {xs: 2, md: 3}, mb: 3 }}>
          <Grid container justifyContent="space-between" alignItems="center">
            <Grid item>
              <Typography variant="h4" component="h1" gutterBottom>
                Room: {room.roomNumber}
              </Typography>
              <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                Property: {property.name}
              </Typography>
            </Grid>
            <Grid item>
              <Button 
                variant="outlined" 
                startIcon={<EditIcon />} 
                onClick={() => navigate(`/owner/property/${propertyId}/room/${roomId}/edit`)}
              >
                Edit Room
              </Button>
            </Grid>
          </Grid>
          <Divider sx={{ my: 2 }} />
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}><Typography><strong>Size:</strong> {room.size}</Typography></Grid>
            <Grid item xs={12} sm={6}><Typography><strong>Rent:</strong> ${parseFloat(room.rentAmount).toFixed(2)}</Typography></Grid>
            <Grid item xs={12} sm={6}><Typography><strong>Maintenance:</strong> ${parseFloat(room.maintenanceCharge || 0).toFixed(2)}</Typography></Grid>
            <Grid item xs={12} sm={6}>
                <Typography><strong>Status:</strong> <Chip label={room.status} color={room.status === 'occupied' ? 'warning' : 'success'} size="small" /> </Typography>
            </Grid>
            {room.status === 'occupied' && room.renterName && (
              <>
                <Grid item xs={12}><Typography variant="subtitle2" sx={{mt:1}}>Tenant Details:</Typography></Grid>
                <Grid item xs={12} sm={6}><Typography><strong>Name:</strong> {room.renterName}</Typography></Grid>
                <Grid item xs={12} sm={6}><Typography><strong>Contact:</strong> {room.renterEmail} / {room.renterPhone}</Typography></Grid>
              </>
            )}
          </Grid>
        </Paper>

        <Paper elevation={2} sx={{ p: {xs: 2, md: 3}, mt: 3 }}>
          <Typography variant="h5" component="h2" gutterBottom>
            Bills for Room {room.roomNumber}
          </Typography>
          {roomBills.length > 0 ? (
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow sx={{backgroundColor: 'grey.100'}}>
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
                            <IconButton title="Add Payment" color="primary" onClick={() => handleOpenPaymentModal(bill)} size="small">
                              <AddCardIcon />
                            </IconButton>
                          )}
                          {/* <IconButton title="View Bill Details" color="secondary" onClick={() => alert(`Bill ID: ${bill.id} - Details TBD`)} size="small">
                            <ReceiptIcon />
                          </IconButton> */}
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
            <Typography>No bills found for this room yet.</Typography>
          )}
        </Paper>
        
        <Button 
            component={RouterLink} 
            to={`/owner/property/${propertyId}`} 
            variant="outlined" 
            startIcon={<ArrowBackIcon />}
            sx={{mt:3}}
        >
            Back to Property Details
        </Button>
      </Box>

      <Modal open={isPaymentModalOpen} onClose={handleClosePaymentModal}>
        <Box sx={modalStyle}>
          <Typography variant="h6" id="payment-modal-title" gutterBottom>
            Record Payment for Bill ({selectedBillForPayment?.month}/{selectedBillForPayment?.year})
          </Typography>
          {selectedBillForPayment && (
            <>
              <Typography variant="body1">Property: {property?.name} - Room: {room?.roomNumber}</Typography>
              <Typography variant="body2" sx={{mb:1}}>Total Due: ${parseFloat(selectedBillForPayment.totalAmount).toFixed(2)}</Typography>
              <Typography variant="body2" sx={{mb:1}}>Paid: $ {calculateTotalPaid(selectedBillForPayment.payments).toFixed(2)}</Typography>
              <Typography variant="body2" color="error.main" sx={{mb:2, fontWeight:'bold'}}>
                Remaining: $ {(parseFloat(selectedBillForPayment.totalAmount) - calculateTotalPaid(selectedBillForPayment.payments)).toFixed(2)}
              </Typography>
            </>
          )}
          <PaymentForm 
            initialValues={{ 
              paymentDate: new Date().toISOString().split('T')[0], 
              amountPaid: selectedBillForPayment ? (parseFloat(selectedBillForPayment.totalAmount) - calculateTotalPaid(selectedBillForPayment.payments)) : 0, 
              paymentMethod: '', 
              paymentMethodOther: '',
              notes: '' 
            }}
            onSubmit={handlePaymentSubmit}
            billAmountDue={selectedBillForPayment ? (parseFloat(selectedBillForPayment.totalAmount) - calculateTotalPaid(selectedBillForPayment.payments)) : 0}
          />
          <Button onClick={handleClosePaymentModal} sx={{mt:2}} fullWidth variant="outlined">Cancel</Button>
        </Box>
      </Modal>
    </Container>
  );
};

export default RoomDetailPage;
