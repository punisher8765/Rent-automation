import React from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { updateRoom, deleteRoom } from '../../store/slices/roomSlice';
import { 
  Card, CardContent, CardActions, Typography, Button, Box, Chip, Divider 
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ToggleOnIcon from '@mui/icons-material/ToggleOn';
import ToggleOffIcon from '@mui/icons-material/ToggleOff';

const RoomCard = ({ room, propertyId }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  if (!room) {
    return <p>Room data is not available.</p>;
  }

  const handleToggleStatus = () => {
    const newStatus = room.status === 'vacant' ? 'occupied' : 'vacant';
    const updatedRoomData = { 
      ...room, 
      status: newStatus,
      renterName: newStatus === 'vacant' ? '' : room.renterName,
      renterEmail: newStatus === 'vacant' ? '' : room.renterEmail,
      renterPhone: newStatus === 'vacant' ? '' : room.renterPhone,
    };
    dispatch(updateRoom(updatedRoomData));
  };

  const handleEdit = () => {
    navigate(`/owner/property/${propertyId}/room/${room.id}/edit`);
  };
  
  const handleViewDetails = () => {
    navigate(`/owner/property/${propertyId}/room/${room.id}/details`);
  };

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete room ${room.roomNumber}? This action cannot be undone.`)) {
      dispatch(deleteRoom({ id: room.id }));
    }
  };

  return (
    <Card sx={{ mb: 2, boxShadow: 3 }}>
      <CardContent>
        <Typography variant="h6" component="div" gutterBottom>
          Room: {room.roomNumber}
           <Chip 
            label={room.status} 
            color={room.status === 'occupied' ? 'error' : 'success'} 
            size="small" 
            sx={{ ml: 2 }}
          />
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Size: {room.size}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Rent: ${parseFloat(room.rentAmount).toFixed(2)} (Maintenance: ${parseFloat(room.maintenanceCharge || 0).toFixed(2)})
        </Typography>
        
        {room.status === 'occupied' && (
          <Box sx={{ mt: 1, p: 1, border: '1px dashed grey', borderRadius: 1 }}>
            <Typography variant="subtitle2">Tenant Details:</Typography>
            <Typography variant="body2">Name: {room.renterName || 'N/A'}</Typography>
            <Typography variant="body2">Email: {room.renterEmail || 'N/A'}</Typography>
            <Typography variant="body2">Phone: {room.renterPhone || 'N/A'}</Typography>
          </Box>
        )}
      </CardContent>
      <Divider />
      <CardActions sx={{ justifyContent: 'space-between', p:1.5 }}>
        <Button 
            size="small" 
            variant="outlined" 
            startIcon={room.status === 'vacant' ? <ToggleOnIcon /> : <ToggleOffIcon />}
            onClick={handleToggleStatus}
            color={room.status === 'vacant' ? 'success' : 'warning'}
        >
          Mark as {room.status === 'vacant' ? 'Occupied' : 'Vacant'}
        </Button>
        <Button size="small" startIcon={<EditIcon />} onClick={handleEdit} variant="outlined">
          Edit
        </Button>
         <Button size="small" variant="contained" onClick={handleViewDetails} color="primary">
          View Bills
        </Button>
        <Button size="small" startIcon={<DeleteIcon />} onClick={handleDelete} color="error" variant="outlined">
          Delete
        </Button>
      </CardActions>
    </Card>
  );
};

export default RoomCard;
