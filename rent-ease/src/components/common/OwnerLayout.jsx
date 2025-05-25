import React from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, Link as RouterLink, useLocation } from 'react-router-dom';
import { logoutUser } from '../../store/slices/authSlice';
import { 
  AppBar, Toolbar, Typography, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, 
  CssBaseline, Box, Divider, Button 
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import HomeWorkIcon from '@mui/icons-material/HomeWork'; // Properties
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom'; // Rooms (can also be for individual rooms)
import BarChartIcon from '@mui/icons-material/BarChart'; // Analytics
import GetAppIcon from '@mui/icons-material/GetApp'; // Export Data
import ExitToAppIcon from '@mui/icons-material/ExitToApp'; // Logout

const drawerWidth = 240;

const OwnerLayout = ({ children }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate('/auth/login');
  };

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/owner/dashboard' },
    { text: 'Properties', icon: <HomeWorkIcon />, path: '/owner/properties' }, // Assuming a future route
    // Add other navigation items here if needed. For now, property management is via dashboard.
    // { text: 'Analytics', icon: <BarChartIcon />, path: '/owner/analytics' },
    // { text: 'Export Data', icon: <GetAppIcon />, path: '/owner/export' },
  ];

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{ width: `calc(100% - ${drawerWidth}px)`, ml: `${drawerWidth}px` }}
      >
        <Toolbar>
          <Typography variant="h6" noWrap component="div">
            RentEase - Owner
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

export default OwnerLayout;
