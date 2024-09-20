import React, { useEffect, useState } from 'react';
import { Drawer, AppBar, Toolbar, Typography, Tabs, Tab, Table, TableBody, TableCell, Paper, TableContainer, TableHead, TableRow, Box, Menu, Collapse, MenuItem, CssBaseline, IconButton, Divider, InputBase, Badge, List, ListItem, ListItemIcon, ListItemText, Button, Tooltip } from '@mui/material';
import { Search, Notifications, Home as HomeIcon, PersonAdd, Edit, Delete, InsertDriveFile, BarChart, ExitToApp, } from '@mui/icons-material';
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
    const [paperCost, setPaperCost] = useState(0.00); // กำหนดค่าเริ่มต้น paperCost
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [openUserMenu, setOpenUserMenu] = useState(false);



    const adminId = localStorage.getItem('user_id');

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



    // const handleDocumentReceive = async (docId) => {
    //     try {

    //         // อัปเดตสถานะเอกสารเป็น 'กำลังดำเนินการ'
    //         const updateStatusResponse = await axios.put(`http://localhost:3000/document/${docId}/status`, {
    //             status: 1,           // หรือสถานะที่คุณต้องการตั้ง
    //             received_by: adminId // รหัสของผู้ดูแลระบบที่รับเอกสาร
    //         });
    //         console.log('Update status response:', updateStatusResponse.data); // Log ค่าการตอบกลับจากการอัปเดตสถานะเอกสาร

    //         // บันทึกข้อมูลการรับเอกสาร
    //         const receiptResponse = await axios.post('http://localhost:3000/document-stats', {
    //             documentId: docId,
    //             adminId: adminId,
    //             dateReceived: new Date().toISOString().split('T')[0], // ใช้วันที่ปัจจุบัน
    //             paperCost: paperCost // ค่ากระดาษหรือข้อมูลที่คุณต้องการบันทึก
    //         });
    //         console.log('Receipt response:', receiptResponse.data); // Log ค่าการตอบกลับจากการบันทึกข้อมูลการรับเอกสาร

    //         // รีเฟรชข้อมูลเอกสาร
    //         if (activeTab === 'all') {
    //             console.log('Fetching all documents...');
    //             fetchAllDocuments();
    //         } else {
    //             console.log('Fetching unread documents...');
    //             fetchUnreadDocuments();
    //         }
    //     } catch (error) {
    //         console.error('Error handling document receive:', error); // Log ข้อผิดพลาด
    //     }
    // };


    // // ฟังก์ชันจัดการปุ่มรับเอกสาร
    // const handleReceiveButtonClick = (docId) => {
    //     console.log('Document ID clicked:', docId); // Log ค่า docId ที่ถูกกด

    //     // ตรวจสอบสถานะเอกสารก่อนการเรียกใช้งาน
    //     const document = (activeTab === 'all' ? allDocuments : unreadDocuments).find(doc => doc.document_id === docId);


    //     if (document && document.status !== 1) { // ตรวจสอบสถานะเอกสาร
    //         console.log('Document status is not 1, proceeding with receive...'); // Log เมื่อตรวจสอบสถานะแล้ว
    //         handleDocumentReceive(docId, 1, adminId, paperCost);
    //     } else {
    //         console.log('Document status is 1 or document not found, skipping receive.');
    //     }
    // };


    const handleSearchChange = (event) => {
        setSearch(event.target.value);
    };

    const handleBackToHome = () => {
        navigate('/home');
    };


    const handleClick = () => {
        setOpenUserMenu(!openUserMenu);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };


    const handleAddUser = () => {
        navigate('/newuser');
        handleClose();
    };

    const handleAllDocuments = () => {
        navigate('/doc');
    };

    const handleStatistics = () => {
        navigate('/rec');
    };

    const handleLogout = () => {
        const confirmLogout = window.confirm("คุณแน่ใจว่าต้องการออกจากระบบไหม?");
        if (confirmLogout) {
            localStorage.clear();
            navigate('/loginpage');
        }
    };

    const handleAddFile = () => {
        navigate('/addfile');
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
                variant="permanent"
                anchor="left"
            >
                <Toolbar />
                <Box sx={{ overflow: 'auto' }}>
                    <List>
                        <Tooltip title="Home" arrow>
                            <ListItem button onClick={handleBackToHome}>
                                <ListItemIcon sx={{ color: '#ddd' }}><HomeIcon /></ListItemIcon>
                                <ListItemText primary="Home" />
                            </ListItem>
                        </Tooltip>

                        <Tooltip title="ผู้ใช้ที่ลงทะเบียน" arrow>
                            <ListItem button onClick={handleClick}>
                                <ListItemIcon sx={{ color: '#ddd' }}><PersonAdd /></ListItemIcon>
                                <ListItemText primary="ผู้ใช้ที่ลงทะเบียน" />
                            </ListItem>
                        </Tooltip>

                        <Collapse in={openUserMenu} timeout="auto" unmountOnExit>
                            <List component="div" disablePadding>
                                <ListItem button sx={{ pl: 4 }} onClick={handleAddUser}>
                                    <ListItemIcon sx={{ color: '#ddd' }}><PersonAdd /></ListItemIcon>
                                    <ListItemText primary="เพิ่มผู้ใช้" />
                                </ListItem>
                                <ListItem button sx={{ pl: 4 }} onClick={() => navigate('/list')}>
                                    <ListItemIcon sx={{ color: '#ddd' }}><PersonAdd /></ListItemIcon>
                                    <ListItemText primary="รายชื่อผู้ใช้" />
                                </ListItem>
                            </List>
                        </Collapse>

                        <Tooltip title="เอกสารทั้งหมด" arrow>
                            <ListItem button onClick={handleAllDocuments}>
                                <ListItemIcon sx={{ color: '#ddd' }}><InsertDriveFile /></ListItemIcon>
                                <ListItemText primary="เอกสารทั้งหมด" />
                            </ListItem>
                        </Tooltip>

                        <Tooltip title="สถิติการรับเอกสาร" arrow>
                            <ListItem button onClick={handleStatistics}>
                                <ListItemIcon sx={{ color: '#ddd' }}><BarChart /></ListItemIcon>
                                <ListItemText primary="สถิติการรับเอกสาร" />
                            </ListItem>
                        </Tooltip>

                        <Divider sx={{ my: 2 }} />

                        <ListItem
                            button
                            onClick={handleLogout}
                            sx={{
                                borderRadius: '4px',
                                backgroundColor: '#f44336',
                                color: '#fff',
                                fontWeight: 'bold',
                                '&:hover': {
                                    backgroundColor: '#d32f2f',
                                },
                                '&:active': {
                                    backgroundColor: '#b71c1c',
                                }
                            }}
                        >
                            <ListItemIcon>
                                <ExitToApp sx={{ color: '#fff' }} />
                            </ListItemIcon>
                            <ListItemText primary="ออกจากระบบ" />
                        </ListItem>
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
                                <TableCell sx={{ fontWeight: 'bold' }}>สถานะ</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', textAlign: 'center' }}>Actions</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>ไฟล์</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {(activeTab === 'all' ? allDocuments : unreadDocuments).map((doc, index) => {
                                return (
                                    <TableRow key={doc.document_id}>
                                        <TableCell>{index + 1}</TableCell>
                                        <TableCell>{formatDateTime(doc.upload_date)}</TableCell>
                                        <TableCell>{`${doc.user_fname} ${doc.user_lname}`}</TableCell>
                                        <TableCell>{doc.subject}</TableCell>
                                        <TableCell>{doc.to_recipient}</TableCell>
                                        <TableCell>{getStatusText(doc.status)}</TableCell>
                                        <TableCell>
                                            <Button
                                                variant="contained"
                                                sx={{ mx: 1, backgroundColor: '#1976d2', color: '#fff' }}
                                                onClick={() => {
                                                    console.log('Edit button clicked for document_id:', doc.document_id); // ตรวจสอบค่า document_id ที่ถูกคลิก
                                                    handleEditClick(doc.document_id);
                                                }}
                                            >
                                                Edit
                                            </Button>

                                            {/* <IconButton
                                                sx={{ mx: 1, color: '#1976d2' }}
                                                onClick={() => handleReceiveButtonClick(doc.document_id)}
                                                disabled={doc.status === 1} // ป้องกันการกดซ้ำถ้าสถานะเป็น 1

                                            >
                                                <CheckCircle />
                                            </IconButton> */}


                                        </TableCell>
                                        <TableCell>
                                            <a
                                                href={`http://localhost:3000/${doc.file}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                onClick={() => {
                                            
                                                    handleDocumentRead(doc.document_id); // เรียกฟังก์ชันด้วย document_id
                                                }}
                                            >
                                                เปิดไฟล์ PDF
                                            </a>
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
