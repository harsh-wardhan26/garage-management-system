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
import VehicleForm from '../components/VehicleForm.tsx';
import VehicleDetails from '../components/VehicleDetails.tsx';

export default function Vehicles() {
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  
  // Dialog Open States
  const [formOpen, setFormOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<any>(null);

  const fetchVehicles = async () => {
    setLoading(true);
    try {
      const response = await api.get('/vehicles');
      setVehicles(response.data.data);
    } catch (err) {
      console.error('Failed to load vehicle register', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  const handleOpenAdd = () => {
    setSelectedVehicle(null);
    setFormOpen(true);
  };

  const handleOpenEdit = (vehicle: any) => {
    setSelectedVehicle(vehicle);
    setFormOpen(true);
  };

  const handleOpenView = (vehicle: any) => {
    setSelectedVehicle(vehicle);
    setDetailsOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this vehicle record?')) {
      try {
        await api.delete(`/vehicles/${id}`);
        fetchVehicles();
      } catch (err) {
        console.error('Failed to delete vehicle record', err);
      }
    }
  };

  const filteredVehicles = vehicles.filter((v: any) => 
    v.licensePlate.toLowerCase().includes(search.toLowerCase()) ||
    v.make.toLowerCase().includes(search.toLowerCase()) ||
    v.model.toLowerCase().includes(search.toLowerCase()) ||
    (v.customer?.name && v.customer.name.toLowerCase().includes(search.toLowerCase()))
  );

  const columns: GridColDef[] = [
    { field: 'licensePlate', headerName: 'License Plate', flex: 1, minWidth: 120, cellClassName: 'plate-cell' },
    { field: 'makeModel', headerName: 'Vehicle Model', flex: 1.2, minWidth: 150, valueGetter: (_, row) => `${row.make} ${row.model}` },
    { field: 'yearColor', headerName: 'Year & Color', flex: 1, minWidth: 150, valueGetter: (_, row) => `${row.year} (${row.color || 'N/A'})` },
    { field: 'mileage', headerName: 'Mileage', flex: 1, minWidth: 120, valueGetter: (_, row) => `${row.mileage?.toLocaleString() || 0} km` },
    { field: 'owner', headerName: 'Owner Name', flex: 1.2, minWidth: 150, valueGetter: (_, row) => row.customer?.name || '-' },
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
          <IconButton color="primary" size="small" onClick={() => handleOpenEdit(params.row)} title="Edit Specs">
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton color="error" size="small" onClick={() => handleDelete(params.row._id)} title="Delete Record">
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
            Vehicle Register
          </Typography>
          <Typography color="text.secondary">
            Manage cars, ownership, and maintenance logs using Data Grid
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpenAdd}>
          Add Vehicle
        </Button>
      </Box>

      <Card sx={{ mb: 4 }}>
        <CardContent sx={{ p: 2 }}>
          <TextField
            fullWidth
            placeholder="Search vehicles by license plate, make, model, or owner..."
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
          rows={filteredVehicles}
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
            },
            '& .plate-cell': {
              fontWeight: 700,
              color: 'primary.main'
            }
          }}
        />
      </Box>

      {/* Add / Edit Dialog Form */}
      <VehicleForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmitSuccess={fetchVehicles}
        initialData={selectedVehicle}
      />

      {/* Details View Dialog */}
      <VehicleDetails
        open={detailsOpen}
        onClose={() => setDetailsOpen(false)}
        vehicle={selectedVehicle}
      />
    </Box>
  );
}
