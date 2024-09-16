import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    AppBar, Toolbar, Typography, IconButton, Drawer, List, ListItem, ListItemText, Divider, TextField,
    InputAdornment, Container, Grid, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Paper, MenuItem, Select, FormControl, InputLabel, ListItemIcon
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';
import DashboardIcon from '@mui/icons-material/Dashboard';
import DocumentScannerIcon from '@mui/icons-material/DocumentScanner';
import PeopleIcon from '@mui/icons-material/People';
import { useNavigate } from 'react-router-dom';
import { Home } from '@mui/icons-material';

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

const drawerWidth = 240;

function ReceiptsList() {
    const [receipts, setReceipts] = useState([]);
    const [admins, setAdmins] = useState([]);
    const [selectedAdmin, setSelectedAdmin] = useState(admins.length > 0 ? admins[0].user_id : '');
    const [filteredReceipts, setFilteredReceipts] = useState([]);
    const [chartData, setChartData] = useState({ labels: [], datasets: [] });
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();




    const handleDrawerToggle = () => {
        setOpen(!open);
    };

    useEffect(() => {
        const fetchReceipts = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/document-receipts');
                setReceipts(response.data);
            } catch (error) {
                console.error('Error fetching document receipts:', error);
            }
        };

        const fetchAdmins = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/admins');
                const adminUsers = response.data;
                console.log('Fetched admins:', adminUsers); // ตรวจสอบข้อมูลที่ดึงมา
                setAdmins(adminUsers);
            } catch (error) {
                console.error('Error fetching admins:', error);
            }
        };

        fetchReceipts();
        fetchAdmins();
    }, []);





    useEffect(() => {
        if (selectedAdmin) {
            const filtered = receipts.filter(receipt => receipt.recipient === selectedAdmin);
            setFilteredReceipts(filtered);

            const adminData = filtered.reduce((acc, receipt) => {
                const month = new Date(receipt.date_received).toLocaleString('default', { month: 'short' });
                if (!acc[month]) {
                    acc[month] = 0;
                }
                acc[month] += receipt.paper_cost;
                return acc;
            }, {});

            const labels = Object.keys(adminData);
            const data = Object.values(adminData);

            setChartData({
                labels: labels.length > 0 ? labels : ['No Data'],
                datasets: [{
                    label: 'Paper Cost by Month',
                    data: data.length > 0 ? data : [0],
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1
                }]
            });
        }
    }, [selectedAdmin, receipts]);

    const handleBackToHome = () => {
        navigate('/home');
    };

    return (
        <Box sx={{ display: 'flex' }}>
            <AppBar position="fixed" sx={{ width: `calc(100% - ${drawerWidth}px)`, ml: `${drawerWidth}px` }}>
                <Toolbar>
                    <IconButton edge="start" color="inherit" aria-label="menu" onClick={handleDrawerToggle} sx={{ mr: 2 }}>
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" noWrap component="div">
                        Admin Dashboard
                    </Typography>
                    <Box sx={{ flexGrow: 1 }} />
                    <IconButton color="inherit">
                        <NotificationsIcon />
                    </IconButton>
                </Toolbar>
            </AppBar>
            <Drawer
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: drawerWidth,
                        boxSizing: 'border-box',
                        bgcolor: '#1A2035',
                        color: '#B9BABF',
                    },
                }}
                variant="persistent"
                anchor="left"
                open={open}
            >
                <Toolbar />
                <Box sx={{ overflow: 'auto' }}>
                    <List>
                        <ListItem button onClick={handleBackToHome}>
                            <ListItemIcon sx={{ color: '#ddd' }}><Home /></ListItemIcon>
                            <ListItemText primary="Home" />
                        </ListItem>
                        <ListItem button>
                            <ListItemIcon sx={{ color: '#ddd' }}>
                                <DashboardIcon />
                            </ListItemIcon>
                            <ListItemText primary="Dashboard" />
                        </ListItem>
                        <ListItem button>
                            <ListItemIcon sx={{ color: '#ddd' }}>
                                <DocumentScannerIcon />
                            </ListItemIcon>
                            <ListItemText primary="เอกสารทั้งหมด" />
                        </ListItem>
                        <ListItem button>
                            <ListItemIcon sx={{ color: '#ddd' }}>
                                <PeopleIcon />
                            </ListItemIcon>
                            <ListItemText primary="ผู้ใช้ทั้งหมด" />
                        </ListItem>
                    </List>
                    <Divider />
                </Box>
            </Drawer>
            <Box component="main" sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3, ml: `${drawerWidth}px` }}>
                <Toolbar />
                <Container>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                variant="outlined"
                                placeholder="Search..."
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <SearchIcon />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <FormControl fullWidth variant="outlined">
                                <InputLabel>Admin</InputLabel>
                                <Select
                                    value={selectedAdmin}
                                    onChange={(e) => setSelectedAdmin(e.target.value)}
                                    label="Admin"
                                >
                                    {admins.length > 0 ? (
                                        admins.map(admin => (
                                            <MenuItem key={admin.user_id} value={admin.user_id}>
                                                {admin.user_fname}
                                            </MenuItem>
                                        ))
                                    ) : (
                                        <MenuItem value="">No Admins Available</MenuItem>
                                    )}
                                </Select>
                            </FormControl>

                        </Grid>

                        <Grid item xs={12}>
                            <TableContainer component={Paper}>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Receipt ID</TableCell>
                                            <TableCell>Document Name</TableCell>
                                            <TableCell>Username</TableCell>
                                            <TableCell>Date Received</TableCell>
                                            <TableCell>Paper Cost</TableCell>
                                            <TableCell>Handled By</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {filteredReceipts.map(receipt => (
                                            <TableRow key={receipt.receipt_id}>
                                                <TableCell>{receipt.receipt_id}</TableCell>
                                                <TableCell>{receipt.document_name}</TableCell>
                                                <TableCell>{receipt.username}</TableCell>
                                                <TableCell>{new Date(receipt.date_received).toLocaleDateString()}</TableCell>
                                                <TableCell>{receipt.paper_cost.toFixed(2)}</TableCell>
                                                <TableCell>{receipt.recipient || 'Not Handled'}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Grid>
                        <Grid item xs={12}>
                            <Box sx={{ width: '100%' }}>
                                <Bar data={chartData} options={{
                                    responsive: true,
                                    plugins: {
                                        legend: {
                                            position: 'top',
                                        },
                                        tooltip: {
                                            callbacks: {
                                                label: function (context) {
                                                    return context.dataset.label + ': $' + context.raw;
                                                }
                                            }
                                        }
                                    }
                                }} />
                            </Box>
                        </Grid>
                    </Grid>
                </Container>
            </Box>
        </Box>
    );
}

export default ReceiptsList;
