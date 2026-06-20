import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { 
  Box, 
  Container, 
  Typography, 
  TextField, 
  Button, 
  Card, 
  CardContent, 
  Alert, 
  CircularProgress,
  Link,
  MenuItem
} from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { authStart, authSuccess, authFailure } from '../store/slices/authSlice.ts';
import { RootState } from '../store/index.ts';
import api from '../services/api.ts';

const schema = yup.object({
  name: yup.string().required('Full name is required'),
  email: yup.string().email('Enter a valid email address').required('Email address is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters long').required('Password is required'),
  role: yup.string().oneOf(['Admin', 'Manager', 'Mechanic', 'Receptionist']).required('User role is required')
}).required();

type FormData = yup.InferType<typeof schema>;

export default function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state: RootState) => state.auth);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      role: 'Mechanic'
    }
  });

  const onSubmit = async (data: FormData) => {
    dispatch(authStart());
    try {
      const response = await api.post('/auth/register', data);
      dispatch(authSuccess({
        user: response.data.data,
        token: response.data.data.token
      }));
      navigate('/');
    } catch (err: any) {
      const errMsg = err.response?.data?.error || 'Registration attempt failed';
      dispatch(authFailure(errMsg));
    }
  };

  return (
    <Container maxWidth="xs" sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Card sx={{ width: '100%', p: 2, borderRadius: 4 }}>
        <CardContent>
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
              Sign Up
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Register a new account on Garage OS
            </Typography>
          </Box>

          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
            <TextField
              margin="normal"
              required
              fullWidth
              id="name"
              label="Full Name"
              autoFocus
              {...register('name')}
              error={!!errors.name}
              helperText={errors.name?.message}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              autoComplete="email"
              {...register('email')}
              error={!!errors.email}
              helperText={errors.email?.message}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              label="Password"
              type="password"
              id="password"
              autoComplete="new-password"
              {...register('password')}
              error={!!errors.password}
              helperText={errors.password?.message}
            />
            <TextField
              select
              margin="normal"
              required
              fullWidth
              id="role"
              label="System Role"
              defaultValue="Mechanic"
              {...register('role')}
              error={!!errors.role}
              helperText={errors.role?.message}
            >
              <MenuItem value="Admin">Admin</MenuItem>
              <MenuItem value="Manager">Manager</MenuItem>
              <MenuItem value="Mechanic">Mechanic</MenuItem>
              <MenuItem value="Receptionist">Receptionist</MenuItem>
            </TextField>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              sx={{ mt: 3, mb: 2 }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Register'}
            </Button>
            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <Link component={RouterLink} to="/login" variant="body2">
                {"Already have an account? Sign In"}
              </Link>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
}
