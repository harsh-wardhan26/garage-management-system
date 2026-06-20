import { BrowserRouter, Routes, Route, Navigate, Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { 
  Box, 
  Drawer, 
  AppBar, 
  Toolbar, 
  List, 
  Typography, 
  IconButton, 
  ListItem, 
  ListItemButton, 
  ListItemIcon, 
  ListItemText,
  Avatar,
  Stack,
  ThemeProvider,
  CssBaseline,
  createTheme
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import BuildIcon from '@mui/icons-material/Build';
import LogoutIcon from '@mui/icons-material/Logout';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

import Login from './pages/Login.tsx';
import Register from './pages/Register.tsx';
import Dashboard from './pages/Dashboard.tsx';
import Customers from './pages/Customers.tsx';
import Vehicles from './pages/Vehicles.tsx';
import Services from './pages/Services.tsx';
import { logout } from './store/slices/authSlice.ts';
import { RootState } from './store/index.ts';

const drawerWidth = 240;

// Create a premium custom MUI dark theme
const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#6366f1' // Sleek Indigo
    },
    secondary: {
      main: '#10b981' // Emerald Green
    },
    background: {
      default: '#0f172a', // Slate 900
      paper: '#1e293b' // Slate 800
    }
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif'
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          backgroundImage: 'linear-gradient(to bottom right, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.01))',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 600
        }
      }
    }
  }
});

function ProtectedLayout() {
  const { user, token } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/' },
    { text: 'Customers', icon: <PeopleIcon />, path: '/customers' },
    { text: 'Vehicles', icon: <DirectionsCarIcon />, path: '/vehicles' },
    { text: 'Services', icon: <BuildIcon />, path: '/services' }
  ];

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* Header Appbar */}
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, borderBottom: '1px solid rgba(255, 255, 255, 0.1)', background: '#0f172a' }} elevation={0}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Stack direction="row" alignItems="center" spacing={1.5}>
            <Avatar sx={{ bgcolor: 'primary.main' }}><DirectionsCarIcon /></Avatar>
            <Typography variant="h6" noWrap sx={{ fontFamily: 'monospace', fontWeight: 700, letterSpacing: '.1rem' }}>
              GARAGE.OS
            </Typography>
          </Stack>
          
          <Stack direction="row" alignItems="center" spacing={2}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <Avatar sx={{ bgcolor: 'secondary.main', width: 32, height: 32 }}><AccountCircleIcon /></Avatar>
              <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>{user?.name}</Typography>
                <Typography variant="caption" color="text.secondary">{user?.role}</Typography>
              </Box>
            </Stack>
            <IconButton color="inherit" onClick={handleLogout} title="Logout">
              <LogoutIcon />
            </IconButton>
          </Stack>
        </Toolbar>
      </AppBar>

      {/* Sidebar Drawer */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box', borderRight: '1px solid rgba(255, 255, 255, 0.1)', background: '#0f172a' }
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto', mt: 2 }}>
          <List>
            {menuItems.map((item) => {
              const active = location.pathname === item.path;
              return (
                <ListItem key={item.text} disablePadding>
                  <ListItemButton 
                    component={RouterLink} 
                    to={item.path}
                    selected={active}
                    sx={{
                      my: 0.5,
                      mx: 1,
                      borderRadius: 2,
                      '&.Mui-selected': {
                        bgcolor: 'primary.main',
                        '&:hover': { bgcolor: 'primary.main' }
                      }
                    }}
                  >
                    <ListItemIcon sx={{ color: active ? 'white' : 'text.secondary' }}>
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText primary={item.text} sx={{ color: active ? 'white' : 'text.primary' }} />
                  </ListItemButton>
                </ListItem>
              );
            })}
          </List>
        </Box>
      </Drawer>

      {/* Main Page Area */}
      <Box component="main" sx={{ flexGrow: 1, p: 4, bgcolor: 'background.default' }}>
        <Toolbar />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/vehicles" element={<Vehicles />} />
          <Route path="/services" element={<Services />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Box>
    </Box>
  );
}

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="*" element={<ProtectedLayout />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}
