import React from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, Link as RouterLink, useLocation } from 'react-router-dom';
import { logoutUser } from '../../store/slices/authSlice';
import { 
  AppBar, Toolbar, Typography, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, 
  CssBaseline, Box, Divider, Button 
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom'; // My Room
import PaymentIcon from '@mui/icons-material/Payment'; // Payments
import GetAppIcon from '@mui/icons-material/GetApp'; // Export Data
import ExitToAppIcon from '@mui/icons-material/ExitToApp'; // Logout

const drawerWidth = 240;

const TenantLayout = ({ children }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate('/auth/login');
  };

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/tenant/dashboard' },
    // { text: 'My Room', icon: <MeetingRoomIcon />, path: '/tenant/room' }, // This path will be dynamic based on room ID
    // { text: 'Payments', icon: <PaymentIcon />, path: '/tenant/payments' },
    // { text: 'Export Data', icon: <GetAppIcon />, path: '/tenant/export' },
  ];
  // Note: "My Room" and "Payments" might be better accessed via the dashboard rather than static sidebar links
  // if they depend on specific room/property IDs. For now, only dashboard is a static link.

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{ width: `calc(100% - ${drawerWidth}px)`, ml: `${drawerWidth}px` }}
      >
        <Toolbar>
          <Typography variant="h6" noWrap component="div">
            RentEase - Tenant
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
        variant="permanent"
        anchor="left"
      >
        <Toolbar>
           <RouterLink to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
            <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                RentEase
            </Typography>
           </RouterLink>
        </Toolbar>
        <Divider />
        <List>
          {menuItems.map((item) => (
            <ListItem key={item.text} disablePadding>
              <ListItemButton
                component={RouterLink}
                to={item.path}
                selected={location.pathname.startsWith(item.path)}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Divider />
        <Box sx={{ mt: 'auto', p: 2 }}>
          <Button
            variant="contained"
            startIcon={<ExitToAppIcon />}
            onClick={handleLogout}
            fullWidth
            color="secondary"
          >
            Logout
          </Button>
        </Box>
      </Drawer>
      <Box
        component="main"
        sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3, width: `calc(100% - ${drawerWidth}px)` }}
      >
        <Toolbar /> {/* For spacing below the AppBar */}
        {children}
        <Box component="footer" sx={{ mt: 'auto', py: 2, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            © {new Date().getFullYear()} RentEase
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default TenantLayout;
