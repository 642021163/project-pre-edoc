import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    AppBar, Toolbar, Typography, IconButton, Box, TextField, InputAdornment, Container, Grid, FormControl,
    InputLabel, Select, MenuItem, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useNavigate } from 'react-router-dom';
import Layout from '../LayoutAdmin/Layout';


function ReceiptsList() {
    const [receipts, setReceipts] = useState([]);
    const [admins, setAdmins] = useState([]);
    const [selectedAdmin, setSelectedAdmin] = useState('');
    const [allReceipts, setAllReceipts] = useState([]);
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();

    const handleDrawerToggle = () => {
        setOpen(!open);
    };

    useEffect(() => {
        const fetchAdmins = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/admins');
                setAdmins(response.data);
                if (response.data.length > 0) {
                    setSelectedAdmin(response.data[0].user_id);
                }
            } catch (error) {
                console.error('Error fetching admins:', error);
            }
        };

        const fetchAllReceipts = async () => {
            try {
                const response = await axios.get('http://localhost:3000/document-receipts');
                setAllReceipts(response.data);
            } catch (error) {
                console.error('Error fetching all document receipts:', error);
            }
        };

        fetchAdmins();
        fetchAllReceipts();
    }, []);

    useEffect(() => {
        if (selectedAdmin) {
            const fetchDocumentReceipts = async () => {
                try {
                    const response = await axios.get(`http://localhost:3000/document-receipts/${selectedAdmin}`);
                    setReceipts(response.data);
                } catch (error) {
                    console.error('Error fetching document receipts:', error);
                }
            };

            fetchDocumentReceipts();
        }
    }, [selectedAdmin]);



    return (
        <Layout> {/* เรียกใช้ Layout ที่ห่อไว้ */}
            <Box sx={{ display: 'flex' }}>
                <Box component="main" sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1, p: 3,bgcolor: '#eaeff1'}}>
                <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold',textAlign: 'left', color: '#1976d2' }}>สถิติการรับเอกสาร</Typography>
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
                                        <MenuItem value="">Select Admin</MenuItem>
                                        {admins.length > 0 ? (
                                            admins.map(admin => (
                                                <MenuItem key={admin.user_id} value={admin.user_id}>
                                                    {admin.user_fname} {admin.user_lname}
                                                </MenuItem>
                                            ))
                                        ) : (
                                            <MenuItem value="">No Admins Available</MenuItem>
                                        )}
                                    </Select>
                                </FormControl>
                            </Grid>

                        </Grid>
                        <TableContainer component={Paper} sx={{ mt: 4 }}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>ลำดับ</TableCell>
                                        <TableCell> ID เอกสาร</TableCell>
                                        <TableCell> ไอดี Admin</TableCell>
                                        <TableCell>วันที่รับเอกสาร</TableCell>
                                        <TableCell>จำนวนเงินประหยัดกระดาษ</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {receipts.length > 0 ? (
                                        receipts.map((receipt) => (
                                            <TableRow key={receipt.receipt_id}>
                                                <TableCell>{receipt.receipt_id}</TableCell>
                                                <TableCell>{receipt.document_id}</TableCell>
                                                <TableCell>{receipt.user_id}</TableCell>
                                                <TableCell>{new Date(receipt.date_received).toLocaleDateString()}</TableCell>
                                                <TableCell>{receipt.paper_cost}</TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={5}>No receipts available</TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Container>
                </Box>
            </Box>
        </Layout>
    );
}

export default ReceiptsList;
