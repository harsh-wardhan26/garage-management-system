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
  MenuItem
} from '@mui/material';
import api from '../services/api.ts';

const schema = yup.object({
  licensePlate: yup.string().required('License plate is required').uppercase(),
  make: yup.string().required('Vehicle make is required'),
  model: yup.string().required('Vehicle model is required'),
  year: yup.number()
    .typeError('Year must be a number')
    .required('Manufacturing year is required')
    .min(1886, 'Invalid manufacturing year')
    .max(new Date().getFullYear() + 2, 'Invalid manufacturing year'),
  color: yup.string().optional(),
  vin: yup.string().optional().test('len', 'VIN must be exactly 17 characters', (val) => !val || val.length === 17),
  mileage: yup.number().typeError('Mileage must be a number').required('Mileage is required').min(0, 'Mileage cannot be negative'),
  customer: yup.string().required('Customer reference mapping is required')
}).required();

type FormData = yup.InferType<typeof schema>;

interface VehicleFormProps {
  open: boolean;
  onClose: () => void;
  onSubmitSuccess: () => void;
  initialData?: any; // populated in edit mode
}

export default function VehicleForm({ open, onClose, onSubmitSuccess, initialData }: VehicleFormProps) {
  const [customers, setCustomers] = useState<any[]>([]);
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: yupResolver(schema)
  });

  // Fetch customers list for owner association dropdown selection
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await api.get('/customers?limit=100');
        setCustomers(response.data.data);
      } catch (err) {
        console.error('Failed to load customers for dropdown mapping', err);
      }
    };
    if (open) {
      fetchCustomers();
    }
  }, [open]);

  // Pre-fill form if editing
  useEffect(() => {
    if (initialData) {
      reset({
        licensePlate: initialData.licensePlate,
        make: initialData.make,
        model: initialData.model,
        year: initialData.year,
        color: initialData.color || '',
        vin: initialData.vin || '',
        mileage: initialData.mileage,
        customer: initialData.customer?._id || initialData.customer || ''
      });
    } else {
      reset({
        licensePlate: '',
        make: '',
        model: '',
        year: new Date().getFullYear(),
        color: '',
        vin: '',
        mileage: 0,
        customer: ''
      });
    }
  }, [initialData, reset, open]);

  const onSubmit = async (data: FormData) => {
    try {
      if (initialData?._id) {
        // Edit Mode
        await api.put(`/vehicles/${initialData._id}`, data);
      } else {
        // Create Mode
        await api.post('/vehicles', data);
      }
      onSubmitSuccess();
      onClose();
    } catch (err: any) {
      console.error('Error saving vehicle details:', err);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 700 }}>
        {initialData ? 'Edit Vehicle Specifications' : 'Register New Vehicle'}
      </DialogTitle>
      <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                id="licensePlate"
                label="License Plate Number"
                {...register('licensePlate')}
                error={!!errors.licensePlate}
                helperText={errors.licensePlate?.message}
                inputProps={{ style: { textTransform: 'uppercase' } }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                select
                required
                fullWidth
                id="customer"
                label="Owner (Customer)"
                defaultValue=""
                {...register('customer')}
                error={!!errors.customer}
                helperText={errors.customer?.message}
              >
                {customers.map((c) => (
                  <MenuItem key={c._id} value={c._id}>
                    {`${c.name} (${c.phone})`}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                id="make"
                label="Vehicle Make (e.g. Toyota)"
                {...register('make')}
                error={!!errors.make}
                helperText={errors.make?.message}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                id="model"
                label="Vehicle Model (e.g. Corolla)"
                {...register('model')}
                error={!!errors.model}
                helperText={errors.model?.message}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                id="year"
                label="Manufacturing Year"
                type="number"
                {...register('year')}
                error={!!errors.year}
                helperText={errors.year?.message}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                id="color"
                label="Exterior Color"
                {...register('color')}
                error={!!errors.color}
                helperText={errors.color?.message}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                id="mileage"
                label="Current Mileage (km)"
                type="number"
                {...register('mileage')}
                error={!!errors.mileage}
                helperText={errors.mileage?.message}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                id="vin"
                label="17-Digit VIN Number"
                {...register('vin')}
                error={!!errors.vin}
                helperText={errors.vin?.message}
                inputProps={{ maxLength: 17, style: { textTransform: 'uppercase' } }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 2.5 }}>
          <Button onClick={onClose} color="inherit">
            Cancel
          </Button>
          <Button type="submit" variant="contained" disabled={isSubmitting}>
            {initialData ? 'Save Changes' : 'Register Vehicle'}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}
