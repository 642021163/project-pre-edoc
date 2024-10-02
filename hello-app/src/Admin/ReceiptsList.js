import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    AppBar, Toolbar, Typography, IconButton, Box, TextField, InputAdornment, Container, Grid, FormControl,
    InputLabel, Select, MenuItem, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useNavigate } from 'react-router-dom';
import Layout from '../LayoutAdmin/Layout';
import { Pie } from 'react-chartjs-2';
import PieChart from '../Charts/PieChart';

function ReceiptsList() {
    const [receipts, setReceipts] = useState([]);
    const [admins, setAdmins] = useState([]);
    const [selectedAdmin, setSelectedAdmin] = useState('');
    const [allReceipts, setAllReceipts] = useState([]);
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();
    const totalReceipts = receipts.length; // จำนวนเอกสารทั้งหมด
    const totalSavings = receipts.reduce((acc, receipt) => acc + parseFloat(receipt.paper_cost), 0); // ใช้ parseFloat
    const [adminData, setAdminData] = useState([]);



    const handleDrawerToggle = () => {
        setOpen(!open);
    };

    useEffect(() => {
        const fetchAdmins = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/admins');
                setAdmins(response.data);

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
        if (selectedAdmin === 'all') {
            const adminCounts = receipts.reduce((acc, receipt) => {
                const adminId = receipt.user_id; // ไอดี Admin
                acc[adminId] = (acc[adminId] || { count: 0, paper_cost: 0 });
                acc[adminId].count += 1; // นับจำนวนเอกสาร
                acc[adminId].paper_cost += Number(receipt.paper_cost); // รวมค่าใช้จ่ายในการประหยัดกระดาษ แปลงเป็นตัวเลข
                return acc;
            }, {});

            // แปลงข้อมูลให้ตรงกับโครงสร้างที่เราต้องการแสดง
            const adminDataArray = admins.map(admin => ({
                user_id: admin.user_id,
                user_fname: admin.user_fname,
                user_lname: admin.user_lname,
                count: adminCounts[admin.user_id]?.count || 0,
                paper_cost: adminCounts[admin.user_id]?.paper_cost || 0,
            }));

            setAdminData(adminDataArray); // ตั้งค่า adminData สำหรับแสดงในตาราง

        } else {
            const fetchDocumentReceipts = async () => {
                try {
                    const response = await axios.get(`http://localhost:3000/document-receipts/${selectedAdmin}`);
                    setReceipts(response.data); // ตั้งค่าผลลัพธ์ที่ได้จากการเลือกแอดมิน

                    // สร้างข้อมูลสำหรับกราฟ
                    const dataForChart = response.data.reduce((acc, receipt) => {
                        acc.push({ label: receipt.document_id, value: Number(receipt.paper_cost) }); // แปลงเป็นตัวเลข
                        return acc;
                    }, []);
                    setAdminData(dataForChart); // ตั้งค่าข้อมูลกราฟ
                } catch (error) {
                    console.error('Error fetching document receipts:', error);
                }
            };

            fetchDocumentReceipts();
        }
    }, [selectedAdmin, receipts, admins]);



    const adminCounts = receipts.reduce((acc, receipt) => {
        const adminId = receipt.user_id; // ไอดี Admin
        acc[adminId] = (acc[adminId] || 0) + 1; // เพิ่มจำนวนเอกสารที่แอดมินคนนี้รับ
        return acc;
    }, {});


    // คำนวณจำนวนเอกสารทั้งหมดที่ได้รับโดยรวมจากแอดมินทุกคน
    const totalDocuments = adminData.reduce((total, admin) => total + admin.count, 0);

    // คำนวณเปอร์เซ็นต์สำหรับแต่ละแอดมิน
    const chartData = {
        labels: adminData.map(admin => `${admin.user_fname} ${admin.user_lname}`), // ชื่อแอดมิน
        datasets: [{
            label: 'จำนวนเอกสารที่รับ (%)',
            data: adminData.map(admin => (admin.count / totalDocuments) * 100), // คำนวณเปอร์เซ็นต์
            backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'], // กำหนดสีของกราฟ
        }]
    };

    return (
        <Layout> {/* เรียกใช้ Layout ที่ห่อไว้ */}
            <Box sx={{ display: 'flex' }}>
                <Box component="main" sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1, p: 3, bgcolor: '#eaeff1' }}>
                    <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', textAlign: 'left', color: '#1976d2' }}>สถิติการรับเอกสาร</Typography>
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
                                        value={selectedAdmin} // ใช้ selectedAdmin เป็น value
                                        onChange={(e) => setSelectedAdmin(e.target.value)}
                                        label="Admin"
                                    >
                                        <MenuItem value=""></MenuItem> {/* ตัวเลือก "ไม่มีแอดมิน" เมื่อไม่เลือก */}
                                        <MenuItem value="all">ทั้งหมด</MenuItem> {/* ตัวเลือก "ทั้งหมด" */}
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
                        {/* เงื่อนไขสำหรับแสดงตาราง */}
                        {selectedAdmin && (
                            <>

                                {/* ตารางสำหรับแสดงข้อมูลเอกสารเมื่อเลือกแอดมินรายบุคคล */}
                                {selectedAdmin !== '' && selectedAdmin !== 'all' && (
                                    <TableContainer component={Paper} sx={{ mt: 4 }}>
                                        <Table>
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell>ลำดับ</TableCell>
                                                    <TableCell>ID เอกสาร</TableCell>
                                                    <TableCell>ไอดี Admin</TableCell>
                                                    <TableCell>วันที่รับเอกสาร</TableCell>
                                                    <TableCell>จำนวนเงินประหยัดกระดาษ</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {receipts.length > 0 ? (
                                                    receipts.map((receipt, index) => (
                                                        <TableRow key={receipt.receipt_id}>
                                                            <TableCell>{index + 1}</TableCell>
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
                                )}

                                {/* ตารางผลรวมด้านล่าง */}
                                {selectedAdmin !== 'all' && ( // เพิ่มเงื่อนไขที่นี่เพื่อให้ไม่แสดงตารางผลรวมเมื่อเลือก "ทั้งหมด"
                                    <TableContainer component={Paper} sx={{ mt: 4 }}>
                                        <Table>
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell>จำนวนเอกสารทั้งหมด</TableCell>
                                                    <TableCell>{totalReceipts}</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell>รวมเงินประหยัดกระดาษ</TableCell>
                                                    <TableCell>{totalSavings}</TableCell>
                                                </TableRow>
                                            </TableHead>
                                        </Table>
                                    </TableContainer>
                                )}

                                {/* ตารางสำหรับแสดงข้อมูลแอดมินเมื่อเลือก "ทั้งหมด" */}
                                {selectedAdmin === 'all' && (
                                    <TableContainer component={Paper} sx={{ mt: 4 }}>
                                        <Table>
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell>ชื่อแอดมิน</TableCell>
                                                    <TableCell>จำนวนเอกสาร</TableCell>
                                                    <TableCell>รวมเงินประหยัดกระดาษ</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {adminData.map(admin => (
                                                    <TableRow key={admin.user_id}>
                                                        <TableCell>{`${admin.user_fname} ${admin.user_lname}`}</TableCell>
                                                        <TableCell>{admin.count}</TableCell>
                                                        <TableCell>{admin.paper_cost}</TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                )}

                            </>
                        )}

                        {/* แสดงกราฟ */}
                        {selectedAdmin === 'all' && (
                            <Box sx={{ width: 500, height: 500, textAlign: 'center', justifyContent: 'center', mt: 4 }}>
                                <Pie data={chartData} />
                            </Box>
                        )}
                    </Container>
                </Box>
            </Box>

        </Layout>
    );
}

export default ReceiptsList;
