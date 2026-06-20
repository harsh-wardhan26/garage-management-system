import { 
  Box, 
  Grid, 
  Card, 
  CardContent, 
  Typography, 
  Stack, 
  Avatar, 
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
  useTheme,
  Chip
} from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import BuildIcon from '@mui/icons-material/Build';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import HardwareIcon from '@mui/icons-material/Hardware';
import { 
  AreaChart, 
  Area, 
  BarChart,
  Bar,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts';

// Mock database data for monthly revenue
const revenueData = [
  { month: 'Jan', revenue: 45000 },
  { month: 'Feb', revenue: 52000 },
  { month: 'Mar', revenue: 61000 },
  { month: 'Apr', revenue: 58000 },
  { month: 'May', revenue: 71000 },
  { month: 'Jun', revenue: 84230 }
];

// Mock database data for service trends
const serviceTrendsData = [
  { month: 'Jan', requests: 120, completed: 95 },
  { month: 'Feb', requests: 140, completed: 110 },
  { month: 'Mar', requests: 180, completed: 155 },
  { month: 'Apr', requests: 160, completed: 130 },
  { month: 'May', requests: 210, completed: 180 },
  { month: 'Jun', requests: 245, completed: 212 }
];

// Mock database data for recent activity
const recentActivities = [
  {
    id: 1,
    type: 'completion',
    title: 'Job Card Completed',
    description: 'MH-12-KT-9910 (Hyundai i20) service request resolved and closed.',
    time: '10 minutes ago',
    icon: <CheckCircleIcon />,
    color: '#10b981'
  },
  {
    id: 2,
    type: 'registration',
    title: 'New Vehicle Registered',
    description: 'DL-3C-AZ-1188 (Honda Civic) added for Customer Amit Sharma.',
    time: '1 hour ago',
    icon: <AddCircleIcon />,
    color: '#6366f1'
  },
  {
    id: 3,
    type: 'assignment',
    title: 'Mechanic Assigned',
    description: 'Mechanic John assigned to DL-4C-BB-3232 (Ford EcoSport) diagnostic check.',
    time: '3 hours ago',
    icon: <AssignmentIndIcon />,
    color: '#3b82f6'
  },
  {
    id: 4,
    type: 'parts',
    title: 'Status Transition',
    description: 'MH-02-BG-1234 (Maruti Swift) changed status to "waiting_parts".',
    time: '5 hours ago',
    icon: <HardwareIcon />,
    color: '#f59e0b'
  }
];

export default function Dashboard() {
  const theme = useTheme();

  return (
    <Box>
      {/* Title Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 800, mb: 1, letterSpacing: '-0.025em' }}>
          Operations Center Dashboard
        </Typography>
        <Typography color="text.secondary">
          Overview of garage performance metrics, revenue analytics, and recent workshop activities
        </Typography>
      </Box>

      {/* Grid of Key Performance Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderLeft: `4px solid ${theme.palette.secondary.main}` }}>
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={2} justifyContent="space-between">
                <Box>
                  <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                    Total Customers
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700, mt: 1 }}>
                    890
                  </Typography>
                  <Typography variant="caption" color="success.main" sx={{ fontWeight: 600 }}>
                    +12% this month
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'secondary.main', width: 48, height: 48 }}>
                  <PeopleIcon />
                </Avatar>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderLeft: `4px solid ${theme.palette.primary.main}` }}>
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={2} justifyContent="space-between">
                <Box>
                  <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                    Active Vehicles
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700, mt: 1 }}>
                    412
                  </Typography>
                  <Typography variant="caption" color="primary.main" sx={{ fontWeight: 600 }}>
                    Registered under management
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'primary.main', width: 48, height: 48 }}>
                  <DirectionsCarIcon />
                </Avatar>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderLeft: `4px solid #f59e0b` }}>
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={2} justifyContent="space-between">
                <Box>
                  <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                    Service Requests
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700, mt: 1 }}>
                    24 Active
                  </Typography>
                  <Typography variant="caption" color="warning.main" sx={{ fontWeight: 600 }}>
                    10 awaiting diagnostics
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: '#f59e0b', width: 48, height: 48 }}>
                  <BuildIcon />
                </Avatar>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderLeft: '4px solid #10b981' }}>
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={2} justifyContent="space-between">
                <Box>
                  <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                    Revenue (MTD)
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700, mt: 1 }}>
                    ₹84,230
                  </Typography>
                  <Typography variant="caption" color="success.main" sx={{ fontWeight: 600 }}>
                    +18.4% vs last month
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: '#10b981', width: 48, height: 48 }}>
                  <CurrencyRupeeIcon />
                </Avatar>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Analytics Charts Grid */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Monthly Revenue Chart */}
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
              Monthly Revenue Performance
            </Typography>
            <Box sx={{ width: '100%', height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenueData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.05} />
                  <XAxis dataKey="month" stroke={theme.palette.text.secondary} fontSize={12} tickLine={false} />
                  <YAxis stroke={theme.palette.text.secondary} fontSize={12} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: theme.palette.background.paper, border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: 8 }}
                    formatter={(value: any) => [`₹${value.toLocaleString()}`, 'Revenue']}
                  />
                  <Bar dataKey="revenue" fill={theme.palette.primary.main} radius={[4, 4, 0, 0]} barSize={36} />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Card>
        </Grid>

        {/* Service Trends Chart */}
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
              Service Booking & Completion Trends
            </Typography>
            <Box sx={{ width: '100%', height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={serviceTrendsData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRequests" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={theme.palette.primary.main} stopOpacity={0.4}/>
                      <stop offset="95%" stopColor={theme.palette.primary.main} stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={theme.palette.secondary.main} stopOpacity={0.4}/>
                      <stop offset="95%" stopColor={theme.palette.secondary.main} stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.05} />
                  <XAxis dataKey="month" stroke={theme.palette.text.secondary} fontSize={12} tickLine={false} />
                  <YAxis stroke={theme.palette.text.secondary} fontSize={12} tickLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: theme.palette.background.paper, border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: 8 }} />
                  <Legend verticalAlign="top" height={36} iconType="circle" />
                  <Area name="Requests Received" type="monotone" dataKey="requests" stroke={theme.palette.primary.main} fillOpacity={1} fill="url(#colorRequests)" strokeWidth={2} />
                  <Area name="Resolved Tasks" type="monotone" dataKey="completed" stroke={theme.palette.secondary.main} fillOpacity={1} fill="url(#colorCompleted)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </Box>
          </Card>
        </Grid>
      </Grid>

      {/* Recent Activity Section */}
      <Card>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            Recent Workshop Activities
          </Typography>
          <List sx={{ p: 0 }}>
            {recentActivities.map((activity, index) => (
              <Box key={activity.id}>
                <ListItem alignItems="flex-start" sx={{ py: 1.5, px: 0 }}>
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: `${activity.color}15`, color: activity.color }}>
                      {activity.icon}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Stack direction="row" justifyContent="space-between" alignItems="center" flexWrap="wrap">
                        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                          {activity.title}
                        </Typography>
                        <Chip label={activity.time} size="small" variant="outlined" sx={{ fontSize: '0.75rem', height: 20 }} />
                      </Stack>
                    }
                    secondary={
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                        {activity.description}
                      </Typography>
                    }
                  />
                </ListItem>
                {index < recentActivities.length - 1 && <Divider component="li" sx={{ opacity: 0.05 }} />}
              </Box>
            ))}
          </List>
        </CardContent>
      </Card>
    </Box>
  );
}
