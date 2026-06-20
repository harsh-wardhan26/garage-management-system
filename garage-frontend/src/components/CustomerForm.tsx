import { useEffect } from 'react';
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
  Box
} from '@mui/material';
import api from '../services/api.ts';

const schema = yup.object({
  name: yup.string().required('Customer name is required'),
  email: yup.string().email('Enter a valid email address').required('Email is required'),
  phone: yup.string().required('Phone number is required').matches(/^\+?[0-9\s\-()]{7,15}$/, 'Phone number is invalid'),
  address: yup.string().optional(),
  notes: yup.string().optional()
}).required();

type FormData = yup.InferType<typeof schema>;

interface CustomerFormProps {
  open: boolean;
  onClose: () => void;
  onSubmitSuccess: () => void;
  initialData?: any; // populated in edit mode
}

export default function CustomerForm({ open, onClose, onSubmitSuccess, initialData }: CustomerFormProps) {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: yupResolver(schema)
  });

  // Pre-fill form fields if editing
  useEffect(() => {
    if (initialData) {
      reset({
        name: initialData.name,
        email: initialData.email,
        phone: initialData.phone,
        address: initialData.address || '',
        notes: initialData.notes || ''
      });
    } else {
      reset({
        name: '',
        email: '',
        phone: '',
        address: '',
        notes: ''
      });
    }
  }, [initialData, reset, open]);

  const onSubmit = async (data: FormData) => {
    try {
      if (initialData?._id) {
        // Edit Mode
        await api.put(`/customers/${initialData._id}`, data);
      } else {
        // Create Mode
        await api.post('/customers', data);
      }
      onSubmitSuccess();
      onClose();
    } catch (error: any) {
      console.error('Error saving customer profile:', error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 700 }}>
        {initialData ? 'Edit Customer Details' : 'Add New Customer'}
      </DialogTitle>
      <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="name"
                label="Full Name"
                {...register('name')}
                error={!!errors.name}
                helperText={errors.name?.message}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                id="email"
                label="Email Address"
                {...register('email')}
                error={!!errors.email}
                helperText={errors.email?.message}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                id="phone"
                label="Phone Number"
                {...register('phone')}
                error={!!errors.phone}
                helperText={errors.phone?.message}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                id="address"
                label="Home Address"
                multiline
                rows={2}
                {...register('address')}
                error={!!errors.address}
                helperText={errors.address?.message}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                id="notes"
                label="Internal Notes / Remarks"
                multiline
                rows={3}
                {...register('notes')}
                error={!!errors.notes}
                helperText={errors.notes?.message}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 2.5 }}>
          <Button onClick={onClose} color="inherit">
            Cancel
          </Button>
          <Button type="submit" variant="contained" disabled={isSubmitting}>
            {initialData ? 'Save Changes' : 'Create Profile'}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}
