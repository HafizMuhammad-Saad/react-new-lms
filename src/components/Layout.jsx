import { useState } from 'react';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import {
  AppBar,
  Box,
  CssBaseline,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Button,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard,
  Description,
  Add,
  Person,
  Logout,
} from '@mui/icons-material';
import { supabase } from '../services/supabase';
// import { useAuth } from '../context/AuthContext';

const drawerWidth = 240;

const menuItems = [
  { text: 'Dashboard', icon: <Dashboard />, path: '/dashboard' },
  { text: 'Loan Requests', icon: <Description />, path: '/loanrequests' },
  { text: 'Create Loan', icon: <Add />, path: '/createloan' },
  { text: 'Profile', icon: <Person />, path: '/profile' },
];

function Layout() {
    const [mobileOpen, setMobileOpen] = useState(false);
    // const { signOut } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
  
    const handleDrawerToggle = () => {
      setMobileOpen(!mobileOpen);
    };
  
    const handleNavigation = (path) => {
      navigate(path);
      setMobileOpen(false);
    };
  
    const handleLogout = async () => {
      try {
        await supabase.auth.signOut();
        navigate('/signup');
      } catch (error) {
        console.error('Error logging out:', error.message);
      }
    };
  
    const drawer = (
      <div>
        <Toolbar />
        <List>
          {menuItems.map((item) => (
            <ListItem key={item.text} disablePadding>
              <ListItemButton
                selected={location.pathname === item.path}
                onClick={() => handleNavigation(item.path)}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </div>
    );
  return (
    <Box component="main" sx={{ display: 'flex' }}>
  <CssBaseline />
  
  {/* Accessible AppBar with proper semantic markup */}
  <AppBar
    component="header"
    position="fixed"
    sx={{
      width: { sm: `calc(100% - ${drawerWidth}px)` },
      ml: { sm: `${drawerWidth}px` },
      bgcolor: 'background.paper',
      color: 'text.primary'
    }}
    >
    <Toolbar>
      <IconButton
        aria-label="Toggle navigation menu"
        color="inherit"
        edge="start"
        onClick={handleDrawerToggle}
        sx={{ mr: 2, display: { sm: 'none' } }}
      >
        <MenuIcon />
      </IconButton>
      
      <Typography 
        variant="h1" 
        component="div" 
        sx={{ 
          flexGrow: 1,
          fontSize: '1.5rem',
          fontWeight: 'medium'
        }}
        >
        Loan Management System
      </Typography>

      <Button 
        aria-label="Logout"
        color="inherit"
        onClick={handleLogout} 
        startIcon={<Logout />}
        sx={{ '&:focus': { outline: '2px solid' } }}
        >
        Logout
      </Button>
    </Toolbar>
  </AppBar>

  {/* Semantic navigation drawer */}
  <Box
    component="nav"
    aria-label="Main navigation"
    sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
    >
    <Drawer
      variant="temporary"
      open={mobileOpen}
      onClose={handleDrawerToggle}
      ModalProps={{ role: "dialog" }}
      sx={{
        display: { xs: 'block', sm: 'none' },
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
        },
      }}
      >
      <nav aria-label="Mobile navigation">{drawer}</nav>
    </Drawer>

    <Drawer
      variant="permanent"
      sx={{
        display: { xs: 'none', sm: 'block' },
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          borderRight: 'none',
          boxShadow: 1
        },
      }}
      open
    >
      <nav aria-label="Desktop navigation">{drawer}</nav>
    </Drawer>
  </Box>

  {/* Main content area */}
  <Box
    component="main"
    sx={{
      flexGrow: 1,
      p: { xs: 2, sm: 3 },
      width: { sm: `calc(100% - ${drawerWidth}px)` },
      maxWidth: 1200,
      mx: 'auto'
    }}
    >
    <Toolbar /> {/* Spacer for app bar */}
    <Outlet /> {/* Content container */}
  </Box>
</Box>
  )
}

export default Layout
