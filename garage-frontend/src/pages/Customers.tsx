import { useState, useEffect } from 'react';
import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  Button, 
  TextField, 
  InputAdornment, 
  IconButton,
  Stack
} from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';

import api from '../services/api.ts';
import CustomerForm from '../components/CustomerForm.tsx';
import CustomerDetails from '../components/CustomerDetails.tsx';

export default function Customers() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  
  // Dialog Open States
  const [formOpen, setFormOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/customers?search=${search}&limit=100`);
      setCustomers(response.data.data);
    } catch (err) {
      console.error('Failed to load customers', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, [search]);

  const handleOpenAdd = () => {
    setSelectedCustomer(null);
    setFormOpen(true);
  };

  const handleOpenEdit = (customer: any) => {
    setSelectedCustomer(customer);
    setFormOpen(true);
  };

  const handleOpenView = (customer: any) => {
    setSelectedCustomer(customer);
    setDetailsOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this customer profile?')) {
      try {
        await api.delete(`/customers/${id}`);
        fetchCustomers();
      } catch (err) {
        console.error('Failed to delete customer', err);
      }
    }
  };

  const columns: GridColDef[] = [
    { field: 'name', headerName: 'Customer Name', flex: 1, minWidth: 150 },
    { field: 'email', headerName: 'Email Address', flex: 1, minWidth: 200 },
    { field: 'phone', headerName: 'Phone Number', flex: 1, minWidth: 150 },
    { field: 'address', headerName: 'Home Address', flex: 1.5, minWidth: 200, valueGetter: (_, row) => row.address || '-' },
    {
      field: 'actions',
      headerName: 'Actions',
      sortable: false,
      width: 150,
      renderCell: (params) => (
        <Stack direction="row" spacing={1} alignItems="center" sx={{ height: '100%' }}>
          <IconButton color="info" size="small" onClick={() => handleOpenView(params.row)} title="View Detail">
            <VisibilityIcon fontSize="small" />
          </IconButton>
          <IconButton color="primary" size="small" onClick={() => handleOpenEdit(params.row)} title="Edit Profile">
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton color="error" size="small" onClick={() => handleDelete(params.row._id)} title="Delete Profile">
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Stack>
      )
    }
  ];

  return (
    <Box sx={{ height: '100%', width: '100%' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800 }}>
            Customer Management
          </Typography>
          <Typography color="text.secondary">
            Manage owner profiles, contacts, and vehicle relations using Data Grid
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpenAdd}>
          Add Customer
        </Button>
      </Box>

      <Card sx={{ mb: 4 }}>
        <CardContent sx={{ p: 2 }}>
          <TextField
            fullWidth
            placeholder="Search customers by name, email, or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              )
            }}
          />
        </CardContent>
      </Card>

      <Box sx={{ height: 500, width: '100%', bgcolor: 'background.paper', borderRadius: 4, overflow: 'hidden', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
        <DataGrid
          rows={customers}
          columns={columns}
          getRowId={(row) => row._id}
          loading={loading}
          initialState={{
            pagination: {
              paginationModel: { pageSize: 10, page: 0 }
            }
          }}
          pageSizeOptions={[10, 25, 50]}
          disableRowSelectionOnClick
          sx={{
            border: 'none',
            '& .MuiDataGrid-columnHeaders': {
              bgcolor: 'background.paper',
              borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
            },
            '& .MuiDataGrid-cell': {
              borderBottom: '1px solid rgba(255, 255, 255, 0.05)'
            }
          }}
        />
      </Box>

      {/* Add / Edit Dialog Form */}
      <CustomerForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmitSuccess={fetchCustomers}
        initialData={selectedCustomer}
      />

      {/* Details View Dialog */}
      <CustomerDetails
        open={detailsOpen}
        onClose={() => setDetailsOpen(false)}
        customer={selectedCustomer}
      />
    </Box>
  );
}
