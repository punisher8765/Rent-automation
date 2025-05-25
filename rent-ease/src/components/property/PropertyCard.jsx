import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Card, CardActionArea, CardContent, CardMedia, Typography, Button, Box } from '@mui/material';
import LocationCityIcon from '@mui/icons-material/LocationCity'; // Example Icon

const PropertyCard = ({ property }) => {
  if (!property) {
    return <p>Property data is not available.</p>;
  }

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardActionArea component={RouterLink} to={`/owner/property/${property.id}`}>
        {property.imageUrls && property.imageUrls.length > 0 ? (
          <CardMedia
            component="img"
            height="140"
            image={property.imageUrls[0]}
            alt={`Image of ${property.name}`}
          />
        ) : (
          <Box 
            height="140" 
            display="flex" 
            alignItems="center" 
            justifyContent="center" 
            bgcolor="grey.200"
          >
            <LocationCityIcon color="action" sx={{ fontSize: 40 }} />
          </Box>
        )}
        <CardContent sx={{ flexGrow: 1 }}>
          <Typography gutterBottom variant="h5" component="div">
            {property.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {property.address}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {property.city}, {property.state} {property.zipCode}
          </Typography>
        </CardContent>
      </CardActionArea>
      {/* Removed direct button from here to make the whole card clickable */}
      {/* Actions can be added back if needed, e.g., for quick edit/delete */}
      {/* <CardActions>
        <Button size="small" component={RouterLink} to={`/owner/property/${property.id}`}>
          View Details
        </Button>
      </CardActions> */}
    </Card>
  );
};

export default PropertyCard;
