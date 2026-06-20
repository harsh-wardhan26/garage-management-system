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
  CircularProgress
} from '@mui/material';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import api from '../services/api.ts';

interface CustomerDetailsProps {
  open: boolean;
  onClose: () => void;
  customer: any;
}

export default function CustomerDetails({ open, onClose, customer }: CustomerDetailsProps) {
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchVehicles = async () => {
      if (!customer?._id) return;
      setLoading(true);
      try {
        const response = await api.get(`/vehicles?customer=${customer._id}`);
        setVehicles(response.data.data);
      } catch (err) {
        console.error('Failed to load customer vehicles', err);
      } finally {
        setLoading(false);
      }
    };

    if (open) {
      fetchVehicles();
    }
  }, [customer, open]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 700 }}>
        Customer Details View
      </DialogTitle>
      <DialogContent dividers>
        {customer ? (
          <Grid container spacing={2.5}>
            {/* Owner Info */}
            <Grid item xs={12}>
              <Typography variant="caption" color="text.secondary">Name</Typography>
              <Typography variant="body1" sx={{ fontWeight: 600 }}>{customer.name}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="caption" color="text.secondary">Email Address</Typography>
              <Typography variant="body1">{customer.email}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="caption" color="text.secondary">Phone Number</Typography>
              <Typography variant="body1">{customer.phone}</Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="caption" color="text.secondary">Home Address</Typography>
              <Typography variant="body1">{customer.address || 'No address provided'}</Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="caption" color="text.secondary">Internal Remarks</Typography>
              <Typography variant="body2" color="text.secondary">{customer.notes || 'No remarks added'}</Typography>
            </Grid>

            {/* Vehicles Sub-List */}
            <Grid item xs={12}>
              <Divider sx={{ my: 1.5 }} />
              <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>
                Registered Vehicles
              </Typography>
              {loading ? (
                <CircularProgress size={24} />
              ) : vehicles.length === 0 ? (
                <Typography variant="body2" color="text.secondary">
                  No vehicles registered for this customer.
                </Typography>
              ) : (
                <List>
                  {vehicles.map((v) => (
                    <ListItem key={v._id} disableGutters>
                      <DirectionsCarIcon color="primary" sx={{ mr: 2 }} />
                      <ListItemText 
                        primary={v.licensePlate} 
                        secondary={`${v.year} ${v.make} ${v.model} (${v.color || 'N/A'}) - Mileage: ${v.mileage} km`} 
                      />
                    </ListItem>
                  ))}
                </List>
              )}
            </Grid>
          </Grid>
        ) : (
          <Typography>No customer profile selected.</Typography>
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
