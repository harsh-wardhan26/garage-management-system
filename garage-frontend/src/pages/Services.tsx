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
  Stack,
  Chip
} from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

import api from '../services/api.ts';
import ServiceForm from '../components/ServiceForm.tsx';
import ServiceDetails from '../components/ServiceDetails.tsx';

export default function Services() {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  
  // Dialog Open States
  const [formOpen, setFormOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<any>(null);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const response = await api.get('/services');
      setRequests(response.data.data);
    } catch (err) {
      console.error('Failed to load service requests register', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleOpenAdd = () => {
    setFormOpen(true);
  };

  const handleOpenView = (request: any) => {
    setSelectedRequest(request);
    setDetailsOpen(true);
  };

  const handleCompleteDirect = async (id: string) => {
    if (window.confirm('Do you want to instantly complete and resolve this service request?')) {
      try {
        await api.patch(`/services/${id}/status`, { status: 'completed' });
        fetchRequests();
      } catch (err) {
        console.error('Failed to transition request to completed', err);
      }
    }
  };

  const filteredRequests = requests.filter((r: any) => 
    r.description.toLowerCase().includes(search.toLowerCase()) ||
    (r.vehicle?.licensePlate && r.vehicle.licensePlate.toLowerCase().includes(search.toLowerCase())) ||
    (r.customer?.name && r.customer.name.toLowerCase().includes(search.toLowerCase())) ||
    (r.mechanic?.name && r.mechanic.name.toLowerCase().includes(search.toLowerCase()))
  );

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

  const columns: GridColDef[] = [
    { field: 'licensePlate', headerName: 'Vehicle Plate', flex: 1, minWidth: 120, valueGetter: (_, row) => row.vehicle?.licensePlate || '-' },
    { field: 'description', headerName: 'Issue Description', flex: 1.5, minWidth: 200 },
    { field: 'owner', headerName: 'Customer Name', flex: 1.2, minWidth: 150, valueGetter: (_, row) => row.customer?.name || '-' },
    { field: 'mechanic', headerName: 'Assigned Mechanic', flex: 1.2, minWidth: 150, valueGetter: (_, row) => row.mechanic?.name || 'Unassigned' },
    {
      field: 'status',
      headerName: 'Status',
      flex: 1,
      minWidth: 120,
      renderCell: (params) => getStatusChip(params.value)
    },
    { field: 'totalCost', headerName: 'Total Cost', flex: 1, minWidth: 120, valueGetter: (_, row) => `₹${row.totalCost?.toLocaleString() || 0}` },
    {
      field: 'actions',
      headerName: 'Actions',
      sortable: false,
      width: 120,
      renderCell: (params) => (
        <Stack direction="row" spacing={1} alignItems="center" sx={{ height: '100%' }}>
          <IconButton color="info" size="small" onClick={() => handleOpenView(params.row)} title="View & Manage">
            <VisibilityIcon fontSize="small" />
          </IconButton>
          {params.row.status !== 'completed' && params.row.status !== 'cancelled' && (
            <IconButton color="success" size="small" onClick={() => handleCompleteDirect(params.row._id)} title="Instantly Resolve">
              <CheckCircleOutlineIcon fontSize="small" />
            </IconButton>
          )}
        </Stack>
      )
    }
  ];

  return (
    <Box sx={{ height: '100%', width: '100%' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800 }}>
            Service Request Operations
          </Typography>
          <Typography color="text.secondary">
            Manage active work orders, diagnostics status, labor billing, and mechanic assignments
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpenAdd}>
          New Request
        </Button>
      </Box>

      <Card sx={{ mb: 4 }}>
        <CardContent sx={{ p: 2 }}>
          <TextField
            fullWidth
            placeholder="Search service requests by plate, issue description, customer, or mechanic..."
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
          rows={filteredRequests}
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

      {/* New Service Request Dialog Form */}
      <ServiceForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmitSuccess={fetchRequests}
      />

      {/* Details View and Workflow Controls Dialog */}
      <ServiceDetails
        open={detailsOpen}
        onClose={() => setDetailsOpen(false)}
        request={selectedRequest}
        onUpdateSuccess={fetchRequests}
      />
    </Box>
  );
}
