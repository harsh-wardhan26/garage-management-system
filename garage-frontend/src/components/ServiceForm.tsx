import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { 
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  Box,
  MenuItem,
  Typography,
  IconButton,
  Stack,
  Divider
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import api from '../services/api.ts';

const schema = yup.object({
  customer: yup.string().required('Customer mapping is required'),
  vehicle: yup.string().required('Vehicle mapping is required'),
  description: yup.string().required('Description is required'),
  laborCost: yup.number().typeError('Labor cost must be a number').required('Labor cost is required').min(0, 'Labor cost cannot be negative')
}).required();

type FormData = yup.InferType<typeof schema>;

interface ServiceFormProps {
  open: boolean;
  onClose: () => void;
  onSubmitSuccess: () => void;
}

interface PartItem {
  name: string;
  quantity: number;
  price: number;
}

export default function ServiceForm({ open, onClose, onSubmitSuccess }: ServiceFormProps) {
  const [customers, setCustomers] = useState<any[]>([]);
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [filteredVehicles, setFilteredVehicles] = useState<any[]>([]);
  const [parts, setParts] = useState<PartItem[]>([]);

  const { register, handleSubmit, reset, watch, setValue, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      laborCost: 0,
      description: '',
      customer: '',
      vehicle: ''
    }
  });

  const selectedCustomer = watch('customer');

  // Fetch customer and vehicle listings
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [custRes, vehRes] = await Promise.all([
          api.get('/customers?limit=100'),
          api.get('/vehicles')
        ]);
        setCustomers(custRes.data.data);
        setVehicles(vehRes.data.data);
      } catch (err) {
        console.error('Failed to load database values', err);
      }
    };
    if (open) {
      fetchData();
      setParts([]);
      reset({
        laborCost: 0,
        description: '',
        customer: '',
        vehicle: ''
      });
    }
  }, [open, reset]);

  // Filter vehicles when customer changes
  useEffect(() => {
    if (selectedCustomer) {
      const filtered = vehicles.filter((v) => {
        const ownerId = v.customer?._id || v.customer;
        return ownerId === selectedCustomer;
      });
      setFilteredVehicles(filtered);
      setValue('vehicle', ''); // reset vehicle selection
    } else {
      setFilteredVehicles([]);
    }
  }, [selectedCustomer, vehicles, setValue]);

  // Dynamically add a part item row
  const handleAddPart = () => {
    setParts([...parts, { name: '', quantity: 1, price: 0 }]);
  };

  // Dynamically remove a part item row
  const handleRemovePart = (index: number) => {
    const updated = [...parts];
    updated.splice(index, 1);
    setParts(updated);
  };

  // Handle value change on part items
  const handlePartChange = (index: number, field: keyof PartItem, value: any) => {
    const updated = [...parts];
    if (field === 'quantity') {
      updated[index].quantity = parseInt(value, 10) || 1;
    } else if (field === 'price') {
      updated[index].price = parseFloat(value) || 0;
    } else {
      updated[index].name = value;
    }
    setParts(updated);
  };

  const onSubmit = async (data: FormData) => {
    try {
      const payload = {
        ...data,
        parts
      };
      await api.post('/services', payload);
      onSubmitSuccess();
      onClose();
    } catch (err) {
      console.error('Error creating service request', err);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 700 }}>
        New Service Request
      </DialogTitle>
      <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <DialogContent dividers sx={{ maxHeight: '70vh', overflowY: 'auto' }}>
          <Grid container spacing={2}>
            {/* Customer Mapping */}
            <Grid item xs={12} sm={6}>
              <TextField
                select
                required
                fullWidth
                id="customer"
                label="Customer"
                defaultValue=""
                {...register('customer')}
                error={!!errors.customer}
                helperText={errors.customer?.message}
              >
                {customers.map((c) => (
                  <MenuItem key={c._id} value={c._id}>
                    {c.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            {/* Vehicle Mapping */}
            <Grid item xs={12} sm={6}>
              <TextField
                select
                required
                fullWidth
                id="vehicle"
                label="Vehicle"
                defaultValue=""
                disabled={!selectedCustomer}
                {...register('vehicle')}
                error={!!errors.vehicle}
                helperText={errors.vehicle?.message || (!selectedCustomer ? 'Select a customer first' : '')}
              >
                {filteredVehicles.map((v) => (
                  <MenuItem key={v._id} value={v._id}>
                    {`${v.licensePlate} (${v.make} ${v.model})`}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            {/* Labor Cost */}
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                type="number"
                id="laborCost"
                label="Labor Cost Rate (₹)"
                {...register('laborCost')}
                error={!!errors.laborCost}
                helperText={errors.laborCost?.message}
              />
            </Grid>

            {/* Description */}
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="description"
                label="Issue / Service Description"
                multiline
                rows={3}
                {...register('description')}
                error={!!errors.description}
                helperText={errors.description?.message}
              />
            </Grid>

            {/* Parts Section */}
            <Grid item xs={12}>
              <Divider sx={{ my: 1.5 }} />
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1.5 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                  Components & Parts Replaced
                </Typography>
                <Button size="small" startIcon={<AddIcon />} onClick={handleAddPart}>
                  Add Part
                </Button>
              </Stack>

              {parts.length === 0 ? (
                <Typography variant="body2" color="text.secondary">
                  No parts recorded for this service request yet.
                </Typography>
              ) : (
                parts.map((part, index) => (
                  <Grid container spacing={1} alignItems="center" key={index} sx={{ mb: 1 }}>
                    <Grid item xs={6}>
                      <TextField
                        required
                        fullWidth
                        size="small"
                        placeholder="Part Name (e.g. Oil Filter)"
                        value={part.name}
                        onChange={(e) => handlePartChange(index, 'name', e.target.value)}
                      />
                    </Grid>
                    <Grid item xs={2}>
                      <TextField
                        required
                        fullWidth
                        size="small"
                        type="number"
                        placeholder="Qty"
                        value={part.quantity}
                        onChange={(e) => handlePartChange(index, 'quantity', e.target.value)}
                      />
                    </Grid>
                    <Grid item xs={3}>
                      <TextField
                        required
                        fullWidth
                        size="small"
                        type="number"
                        placeholder="Price (₹)"
                        value={part.price}
                        onChange={(e) => handlePartChange(index, 'price', e.target.value)}
                      />
                    </Grid>
                    <Grid item xs={1}>
                      <IconButton color="error" size="small" onClick={() => handleRemovePart(index)}>
                        <DeleteIcon />
                      </IconButton>
                    </Grid>
                  </Grid>
                ))
              )}
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 2.5 }}>
          <Button onClick={onClose} color="inherit">
            Cancel
          </Button>
          <Button type="submit" variant="contained" disabled={isSubmitting}>
            Create Service Order
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}
