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
  MenuItem,
  TextField,
  Box,
  Stack
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import api from '../services/api.ts';

interface ServiceDetailsProps {
  open: boolean;
  onClose: () => void;
  request: any;
  onUpdateSuccess: () => void;
}

export default function ServiceDetails({ open, onClose, request, onUpdateSuccess }: ServiceDetailsProps) {
  const [mechanics, setMechanics] = useState<any[]>([]);
  const [selectedMechanic, setSelectedMechanic] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');

  // Fetch mechanics and sync dropdown inputs
  useEffect(() => {
    const fetchMechanics = async () => {
      try {
        const response = await api.get('/auth/mechanics');
        setMechanics(response.data.data);
      } catch (err) {
        console.error('Failed to load mechanics', err);
      }
    };
    if (open) {
      fetchMechanics();
    }
  }, [open]);

  useEffect(() => {
    if (request) {
      setSelectedMechanic(request.mechanic?._id || '');
      setSelectedStatus(request.status || 'pending');
    }
  }, [request, open]);

  const handleMechanicChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const mechId = e.target.value;
    setSelectedMechanic(mechId);
    try {
      await api.patch(`/services/${request._id}/mechanic`, { mechanicId: mechId });
      onUpdateSuccess();
    } catch (err) {
      console.error('Failed to update mechanic assignment', err);
    }
  };

  const handleStatusChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const statusVal = e.target.value;
    setSelectedStatus(statusVal);
    try {
      await api.patch(`/services/${request._id}/status`, { status: statusVal });
      onUpdateSuccess();
    } catch (err) {
      console.error('Failed to update status', err);
    }
  };

  const handleCompleteRequest = async () => {
    try {
      await api.patch(`/services/${request._id}/status`, { status: 'completed' });
      setSelectedStatus('completed');
      onUpdateSuccess();
    } catch (err) {
      console.error('Failed to complete service request', err);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 700 }}>
        Service Request Order View
      </DialogTitle>
      <DialogContent dividers>
        {request ? (
          <Grid container spacing={2.5}>
            {/* Customer info */}
            <Grid item xs={6}>
              <Typography variant="caption" color="text.secondary">Customer Name</Typography>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>{request.customer?.name || '-'}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="caption" color="text.secondary">Customer Phone</Typography>
              <Typography variant="body2">{request.customer?.phone || '-'}</Typography>
            </Grid>

            {/* Vehicle info */}
            <Grid item xs={6}>
              <Typography variant="caption" color="text.secondary">License Plate</Typography>
              <Typography variant="body2" sx={{ fontWeight: 700, color: 'primary.main' }}>
                {request.vehicle?.licensePlate || '-'}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="caption" color="text.secondary">Vehicle Spec</Typography>
              <Typography variant="body2">
                {request.vehicle ? `${request.vehicle.year} ${request.vehicle.make} ${request.vehicle.model}` : '-'}
              </Typography>
            </Grid>

            {/* Description */}
            <Grid item xs={12}>
              <Typography variant="caption" color="text.secondary">Job Details Description</Typography>
              <Typography variant="body2">{request.description}</Typography>
            </Grid>

            <Grid item xs={12}>
              <Divider />
            </Grid>

            {/* Control Panel: Assignee & Workflow Status */}
            <Grid item xs={12} sm={6}>
              <TextField
                select
                fullWidth
                label="Assign Mechanic"
                value={selectedMechanic}
                onChange={handleMechanicChange}
                disabled={request.status === 'completed' || request.status === 'cancelled'}
              >
                <MenuItem value="">
                  <em>Unassigned</em>
                </MenuItem>
                {mechanics.map((m) => (
                  <MenuItem key={m._id} value={m._id}>
                    {m.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                select
                fullWidth
                label="Job Status"
                value={selectedStatus}
                onChange={handleStatusChange}
                disabled={request.status === 'completed' || request.status === 'cancelled'}
              >
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="diagnosing">Diagnosing</MenuItem>
                <MenuItem value="waiting_parts">Waiting Parts</MenuItem>
                <MenuItem value="in_progress">In Progress</MenuItem>
                <MenuItem value="completed">Completed</MenuItem>
                <MenuItem value="cancelled">Cancelled</MenuItem>
              </TextField>
            </Grid>

            <Grid item xs={12}>
              <Divider />
            </Grid>

            {/* Cost Breakdown */}
            <Grid item xs={12}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
                Labor & Component Costs Breakdown
              </Typography>
              <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
                <Typography variant="body2">Labor rate:</Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>₹{request.laborCost || 0}</Typography>
              </Stack>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                Parts replacement items list:
              </Typography>
              {request.parts?.length === 0 ? (
                <Typography variant="body2" color="text.secondary" sx={{ ml: 2, fontStyle: 'italic' }}>
                  No parts replaced.
                </Typography>
              ) : (
                <List dense>
                  {request.parts?.map((p: any, idx: number) => (
                    <ListItem key={idx} disableGutters>
                      <ListItemText 
                        primary={p.name}
                        secondary={`Quantity: ${p.quantity} | Price per unit: ₹${p.price}`}
                      />
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        ₹{p.price * p.quantity}
                      </Typography>
                    </ListItem>
                  ))}
                </List>
              )}
              <Divider sx={{ my: 1.5 }} />
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>Total Service Cost:</Typography>
                <Typography variant="h5" sx={{ fontWeight: 800, color: 'secondary.main' }}>
                  ₹{request.totalCost || 0}
                </Typography>
              </Stack>
            </Grid>
          </Grid>
        ) : (
          <Typography>No active request selected.</Typography>
        )}
      </DialogContent>
      <DialogActions sx={{ p: 2.5, justifyContent: 'space-between' }}>
        <Box>
          {request && request.status !== 'completed' && request.status !== 'cancelled' && (
            <Button 
              variant="contained" 
              color="success" 
              startIcon={<CheckCircleIcon />} 
              onClick={handleCompleteRequest}
            >
              Complete Job Card
            </Button>
          )}
        </Box>
        <Button onClick={onClose} variant="outlined">
          Close View
        </Button>
      </DialogActions>
    </Dialog>
  );
}
