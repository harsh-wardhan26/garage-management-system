import { useState, useEffect } from 'react';
import { 
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  Typography,
  Divider,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Chip,
  Box
} from '@mui/material';
import BuildIcon from '@mui/icons-material/Build';
import api from '../services/api.ts';

interface VehicleDetailsProps {
  open: boolean;
  onClose: () => void;
  vehicle: any;
}

export default function VehicleDetails({ open, onClose, vehicle }: VehicleDetailsProps) {
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchHistory = async () => {
      if (!vehicle?._id) return;
      setLoading(true);
      try {
        const response = await api.get(`/services/vehicle/${vehicle._id}`);
        setHistory(response.data.data);
      } catch (err) {
        console.error('Failed to load vehicle service history', err);
      } finally {
        setLoading(false);
      }
    };

    if (open) {
      fetchHistory();
    }
  }, [vehicle, open]);

  const getStatusChip = (status: string) => {
    switch (status) {
      case 'completed':
        return <Chip label="Completed" color="success" size="small" />;
      case 'in_progress':
        return <Chip label="In Progress" color="primary" size="small" />;
      case 'waiting_parts':
        return <Chip label="Waiting Parts" color="warning" size="small" />;
      case 'diagnosing':
        return <Chip label="Diagnosing" color="info" size="small" />;
      case 'cancelled':
        return <Chip label="Cancelled" color="error" size="small" />;
      default:
        return <Chip label="Pending" color="default" size="small" />;
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 700 }}>
        Vehicle Specifications & Log
      </DialogTitle>
      <DialogContent dividers>
        {vehicle ? (
          <Grid container spacing={2.5}>
            {/* Vehicle Specs */}
            <Grid item xs={6}>
              <Typography variant="caption" color="text.secondary">License Plate</Typography>
              <Typography variant="body1" sx={{ fontWeight: 700, color: 'primary.main' }}>
                {vehicle.licensePlate}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="caption" color="text.secondary">Current Mileage</Typography>
              <Typography variant="body1">{`${vehicle.mileage?.toLocaleString() || 0} km`}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="caption" color="text.secondary">Make & Model</Typography>
              <Typography variant="body1" sx={{ fontWeight: 600 }}>{`${vehicle.make} ${vehicle.model}`}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="caption" color="text.secondary">Year & Color</Typography>
              <Typography variant="body1">{`${vehicle.year} (${vehicle.color || 'N/A'})`}</Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="caption" color="text.secondary">17-Character VIN Number</Typography>
              <Typography variant="body1" sx={{ fontFamily: 'monospace' }}>{vehicle.vin || 'Not Registered'}</Typography>
            </Grid>

            {/* Owner Details */}
            <Grid item xs={12}>
              <Divider sx={{ my: 1 }} />
              <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'secondary.main', mb: 1 }}>
                Owner (Customer) Information
              </Typography>
              {vehicle.customer ? (
                <Grid container spacing={1}>
                  <Grid item xs={12} sm={4}>
                    <Typography variant="caption" color="text.secondary">Name</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>{vehicle.customer.name}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Typography variant="caption" color="text.secondary">Phone</Typography>
                    <Typography variant="body2">{vehicle.customer.phone}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Typography variant="caption" color="text.secondary">Email</Typography>
                    <Typography variant="body2">{vehicle.customer.email}</Typography>
                  </Grid>
                </Grid>
              ) : (
                <Typography variant="body2" color="text.secondary">No customer associated.</Typography>
              )}
            </Grid>

            {/* Maintenance History */}
            <Grid item xs={12}>
              <Divider sx={{ my: 1.5 }} />
              <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>
                Maintenance & Service History Logs
              </Typography>
              {loading ? (
                <CircularProgress size={24} />
              ) : history.length === 0 ? (
                <Typography variant="body2" color="text.secondary">
                  No service cards found for this vehicle.
                </Typography>
              ) : (
                <List>
                  {history.map((h) => (
                    <ListItem key={h._id} disableGutters sx={{ alignItems: 'flex-start' }}>
                      <BuildIcon color="action" sx={{ mr: 2, mt: 1 }} />
                      <ListItemText 
                        primary={
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>{h.description}</Typography>
                            {getStatusChip(h.status)}
                          </Box>
                        } 
                        secondary={
                          <>
                            <Typography variant="caption" color="text.secondary" component="span" sx={{ display: 'block', mt: 0.5 }}>
                              {`Service Date: ${new Date(h.createdAt).toLocaleDateString()} | Total Cost: ₹${h.totalCost}`}
                            </Typography>
                          </>
                        } 
                      />
                    </ListItem>
                  ))}
                </List>
              )}
            </Grid>
          </Grid>
        ) : (
          <Typography>No vehicle record selected.</Typography>
        )}
      </DialogContent>
      <DialogActions sx={{ p: 2.5 }}>
        <Button onClick={onClose} variant="contained">
          Close View
        </Button>
      </DialogActions>
    </Dialog>
  );
}
