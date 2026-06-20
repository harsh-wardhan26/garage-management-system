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
  Link
} from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { authStart, authSuccess, authFailure } from '../store/slices/authSlice.ts';
import { RootState } from '../store/index.ts';
import api from '../services/api.ts';

const schema = yup.object({
  email: yup.string().email('Enter a valid email address').required('Email address is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters long').required('Password is required')
}).required();

type FormData = yup.InferType<typeof schema>;

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state: RootState) => state.auth);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: yupResolver(schema)
  });

  const onSubmit = async (data: FormData) => {
    dispatch(authStart());
    try {
      const response = await api.post('/auth/login', data);
      dispatch(authSuccess({
        user: response.data.data,
        token: response.data.data.token
      }));
      navigate('/');
    } catch (err: any) {
      const errMsg = err.response?.data?.error || 'Authentication attempt failed';
      dispatch(authFailure(errMsg));
    }
  };

  return (
    <Container maxWidth="xs" sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Card sx={{ width: '100%', p: 2, borderRadius: 4 }}>
        <CardContent>
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
              Sign In
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Access the Garage OS control panel
            </Typography>
          </Box>

          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              autoComplete="email"
              autoFocus
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
              autoComplete="current-password"
              {...register('password')}
              error={!!errors.password}
              helperText={errors.password?.message}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              sx={{ mt: 3, mb: 2 }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Sign In'}
            </Button>
            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <Link component={RouterLink} to="/register" variant="body2">
                {"Don't have an account yet? Register here"}
              </Link>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
}
