import React, { useEffect, useState } from 'react';
import { Drawer, AppBar, Toolbar, Typography, Tabs, Tab, Table, TableBody, TableCell, Paper, TableContainer, TableHead, TableRow, Box, CssBaseline, IconButton, InputBase, Badge, List, ListItem, ListItemIcon, ListItemText, Button, Tooltip } from '@mui/material';
import { Search, Notifications, Home, PersonAdd, Edit, Download, Delete } from '@mui/icons-material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { format, parseISO } from 'date-fns';
import CheckCircle from '@mui/icons-material/CheckCircle';


const drawerWidth = 240;
// การจัดรูปแบบวันที่และเวลา
const formatDateTime = (dateTime) => format(parseISO(dateTime), 'yyyy-MM-dd HH:mm:ss');

function Documents() {
    const [allDocuments, setAllDocuments] = useState([]);
    const [unreadDocuments, setUnreadDocuments] = useState([]);
    const [activeTab, setActiveTab] = useState('all');
    const navigate = useNavigate();
    const [search, setSearch] = useState('');
    const [adminId, setAdminId] = useState(1); // กำหนดค่าเริ่มต้น adminId
    const [paperCost, setPaperCost] = useState(0.00); // กำหนดค่าเริ่มต้น paperCost



    useEffect(() => {
        if (activeTab === 'all') {
            fetchAllDocuments();
        } else {
            fetchUnreadDocuments();
        }
    }, [activeTab]); // กำหนดให้ useEffect ทำงานเมื่อ activeTab เปลี่ยนแปลง


    const fetchAllDocuments = async () => {
        try {
            const response = await axios.get('http://localhost:3000/admin/documents');
            setAllDocuments(response.data);
        } catch (error) {
            console.error('Error fetching all documents:', error);
        }
    };

    //ดึงเอกสาร Document
    const fetchUnreadDocuments = async () => {
        try {
            const response = await axios.get('http://localhost:3000/document/unread');
            console.log('Unread Documents:', response.data); // ตรวจสอบเอกสารที่ยังไม่ได้อ่าน
            setUnreadDocuments(response.data);
        } catch (error) {
            console.error('Error fetching unread documents:', error);
        }
    };



    const handleDocumentRead = async (docId) => {
        if (!docId) {
            console.error('Document ID is undefined');
            return;
        }
        try {
            await axios.put(`http://localhost:3000/document/${docId}/read`);

            if (activeTab === 'all') {
                fetchAllDocuments();
            } else {
                fetchUnreadDocuments();
            }
        } catch (error) {
            console.error('Error updating document status:', error);
        }
    };



    const handleDelete = async (docId) => {
        if (!docId) {
            console.error('Document ID is missing');
            return;
        }

        const confirmDelete = window.confirm(`คุณแน่ใจว่าต้องการลบเอกสารที่มี ID: ${docId} หรือไม่?`);

        if (confirmDelete) {
            try {
                await axios.delete(`http://localhost:3000/document/${docId}`);
                console.log(`Document with ID ${docId} deleted successfully.`);

                // รีเฟรชรายการเอกสารหลังจากลบสำเร็จ
                if (activeTab === 'all') {
                    fetchAllDocuments();
                } else {
                    fetchUnreadDocuments();
                }
            } catch (error) {
                console.error('Error deleting document:', error);
            }
        }
    };

    const handleDocumentReceive = async (docId, status, adminId, paperCost) => {
        try {
            // อัปเดตสถานะเอกสาร
            await axios.put(`http://localhost:3000/document/${docId}/status`, {
                status,
                receivedBy: adminId
            });

            // บันทึกข้อมูลการรับเอกสาร
            await axios.post('http://localhost:3000/document-stats', {
                documentId: docId,
                adminId,
                dateReceived: new Date().toISOString().split('T')[0], // ใช้วันที่ปัจจุบัน
                paperCost
            });

            // รีเฟรชข้อมูลเอกสาร
            if (activeTab === 'all') {
                fetchAllDocuments();
            } else {
                fetchUnreadDocuments();
            }
        } catch (error) {
            console.error('Error handling document receive:', error);
        }
    };

    // ฟังก์ชันจัดการปุ่มรับเอกสาร
    const handleReceiveButtonClick = (docId) => {
        // ตรวจสอบสถานะเอกสารก่อนการเรียกใช้งาน
        const document = (activeTab === 'all' ? allDocuments : unreadDocuments).find(doc => doc.document_id === docId);

        if (document && document.status !== 1) { // ตรวจสอบสถานะเอกสาร
            handleDocumentReceive(docId, 1, adminId, paperCost);
        }
    };

    const handleSearchChange = (event) => {
        setSearch(event.target.value);
    };

    const handleBackToHome = () => {
        navigate('/home');
    };

    const handleAddFile = () => {
        navigate('/addfile');
    };
    // ตัวอย่างการตั้งค่า adminId และ paperCost
    const handleAdminLogin = (id) => {
        setAdminId(id);
    };

    const handleSetPaperCost = (cost) => {
        setPaperCost(cost);
    };

    const getStatusText = (status) => {
        switch (status) {
            case 0:
                return 'รอดำเนินการ';
            case 1:
                return 'กำลังดำเนินการ';
            case 2:
                return 'ดำเนินการเรียบร้อย';
            default:
                return 'ไม่ทราบสถานะ';
        }
    };
    // ในฟังก์ชัน Documents
    const handleEditClick = (docId) => {


        navigate(`/edit/${docId}`);
    };

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            {/* AppBar */}
            <AppBar position="fixed" sx={{ width: `calc(100% - ${drawerWidth}px)`, ml: `${drawerWidth}px`, bgcolor: '#1976d2' }}>
                <Toolbar>
                    <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1, color: '#fff' }}>
                        Admin Dashboard
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        {/* Search Box */}
                        {/* ช่องค้นหา */}
                        <Box sx={{ display: 'flex', alignItems: 'center', backgroundColor: '#fff', borderRadius: '4px', px: 1, mx: 2 }}>
                            <IconButton sx={{ p: '10px' }}>
                                <Search />
                            </IconButton>
                            <InputBase
                                placeholder="Search…"
                                value={search}
                                onChange={handleSearchChange}
                                sx={{ ml: 1, flex: 1 }}
                            />
                        </Box>
                        {/* Notifications Icon */}
                        <IconButton sx={{ color: '#fff' }}>
                            <Badge badgeContent={4} color="error">
                                <Notifications />
                            </Badge>
                        </IconButton>
                    </Box>
                </Toolbar>
            </AppBar>

            {/* Drawer */}
            <Drawer
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: drawerWidth,
                        boxSizing: 'border-box',
                        bgcolor: '#1A2035',  // สีพื้นหลังของ Drawer (สีเข้ม)
                        color: '#B9BABF',    // สีของตัวหนังสือ (สีขาว/เทาอ่อน)
                    },
                }}
                variant="permanent"
                anchor="left"
            >
                <Toolbar />
                <Box sx={{ overflow: 'auto' }}>
                    <List>
                        <Tooltip title="Home" arrow>
                            <ListItem button onClick={handleBackToHome}>
                                <ListItemIcon sx={{ color: '#ddd' }}><Home /></ListItemIcon> {/* ไอคอนสีเทาอ่อน */}
                                <ListItemText primary="Home" />
                            </ListItem>
                        </Tooltip>
                        <Tooltip title="ผู้ใช้ที่ลงทะเบียน" arrow>
                            <ListItem button onClick={() => navigate('/list')}>
                                <ListItemIcon sx={{ color: '#ddd' }}><PersonAdd /></ListItemIcon> {/* ไอคอนสีเทาอ่อน */}
                                <ListItemText primary="ผู้ใช้ที่ลงทะเบียน" />
                            </ListItem>
                        </Tooltip>
                    </List>
                </Box>
            </Drawer>

            {/* Main content */}
            <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1, p: 3, bgcolor: '#eaeff1' }}>
                <Typography variant="h4" gutterBottom sx={{ mb: 2, color: '#333' }}>
                    Admin Document Dashboard
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                    <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#1976d2' }}>
                        เอกสารทั้งหมด
                    </Typography>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleAddFile}
                        sx={{ height: 'fit-content' }}
                    >
                        Add File
                    </Button>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', backgroundColor: '#fff', borderRadius: '4px', px: 1, mx: 2 }}>
                    <IconButton sx={{ p: '10px' }}>
                        <Search />
                    </IconButton>
                    <InputBase
                        placeholder="Search…"
                        value={search}
                        onChange={handleSearchChange}
                        sx={{ ml: 1, flex: 1 }}
                    />
                </Box>
                <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)} sx={{ mb: 3 }}>
                    <Tab label="เอกสารทั้งหมด" value="all" />
                    <Tab label="เอกสารที่ยังไม่เปิดอ่าน" value="unread" />
                </Tabs>
                <TableContainer component={Paper} sx={{ boxShadow: 3 }}>
                    <Table>
                        <TableHead>
                            <TableRow sx={{ backgroundColor: '#f0f8ff' }}>
                                <TableCell sx={{ fontWeight: 'bold' }}>ลำดับ.</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>วันที่</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>ชื่อ-สกุล</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>เรื่อง</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>ถึง</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>ไฟล์</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>สถานะ</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', textAlign: 'center' }}>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {(activeTab === 'all' ? allDocuments : unreadDocuments).map((doc, index) => {
                                console.log('Document data:', doc); // ตรวจสอบว่ามี document_id อยู่ใน doc
                                return (
                                    <TableRow key={doc.document_id}>
                                        <TableCell>{index + 1}</TableCell>
                                        <TableCell>{formatDateTime(doc.upload_date)}</TableCell>
                                        <TableCell>{`${doc.user_fname} ${doc.user_lname}`}</TableCell>
                                        <TableCell>{doc.subject}</TableCell>
                                        <TableCell>{doc.to_recipient}</TableCell>
                                        <TableCell>
                                            <a
                                                href={`http://localhost:3000/${doc.file}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                onClick={() => {
                                                    console.log('Document ID:', doc.document_id); // ตรวจสอบค่า document_id ที่ถูกคลิก
                                                    handleDocumentRead(doc.document_id); // เรียกฟังก์ชันด้วย document_id
                                                }}
                                            >
                                                View
                                            </a>
                                        </TableCell>
                                        <TableCell>{getStatusText(doc.status)}</TableCell>
                                        <TableCell>
                                            <IconButton sx={{ mx: 1, color: '#1976d2' }} onClick={() => {
                                                console.log('Edit button clicked for document_id:', doc.document_id); // ตรวจสอบค่า document_id ที่ถูกคลิก
                                                handleEditClick(doc.document_id);
                                            }}
                                            >
                                                <Edit />
                                            </IconButton>
                                            <IconButton
                                                sx={{ mx: 1, color: '#1976d2' }}
                                                onClick={() => handleReceiveButtonClick(doc.document_id)}
                                                disabled={doc.status === 1} // ป้องกันการกดซ้ำถ้าสถานะเป็น 1
                                            >
                                                <CheckCircle />
                                            </IconButton>

                                            <IconButton
                                                sx={{ mx: 1, color: '#d32f2f' }}
                                                onClick={() => {
                                                    console.log('Delete button clicked for document_id:', doc.document_id); // ตรวจสอบค่า document_id ที่ถูกคลิก
                                                    console.log('Document data:', doc); // ตรวจสอบข้อมูลของ doc

                                                    handleDelete(doc.document_id);
                                                }}
                                            >
                                                <Delete />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>


                    </Table>
                </TableContainer>
            </Box>
        </Box>
    );
}

export default Documents;
