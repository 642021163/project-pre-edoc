import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Paper, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Link, Button, List, ListItem, ListItemIcon, ListItemText, Divider, Modal, IconButton, Grid } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { FileUpload, AccountCircle, ExitToApp, InsertDriveFile, } from '@mui/icons-material';
import MenuIcon from '@mui/icons-material/Menu';
import Pagination from '@mui/material/Pagination';
import { format } from 'date-fns';



// การจัดรูปแบบวันที่และเวลา
const formatDateTime = (dateTime) => format(new Date(dateTime), 'dd/MM/yyyy HH:mm:ss');
// ฟังก์ชันสำหรับดึงชื่อไฟล์จากพาธ
const getFileName = (filePath) => {
    if (filePath) {
        return filePath.split('/').pop();
    }
    return 'No file name';
};

const TrackDocuments = () => {
    // สถานะสำหรับจัดการเอกสาร
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [open, setOpen] = useState(false);
    const [selectedDocument, setSelectedDocument] = useState(null);
    const [page, setPage] = useState(1); // สถานะสำหรับเก็บหน้าปัจจุบัน
    const [rowsPerPage] = useState(10);   // จำนวนเอกสารที่จะแสดงต่อหน้า
    const indexOfLastDocument = page * rowsPerPage;
    const indexOfFirstDocument = indexOfLastDocument - rowsPerPage;
    const currentDocuments = documents.slice(indexOfFirstDocument, indexOfLastDocument);

    // ใช้สำหรับการนำทางในแอป
    const navigate = useNavigate(); // ใช้สำหรับนำทาง
    const location = useLocation(); // ใช้สำหรับตรวจสอบที่อยู่ URL ปัจจุบัน

    // ฟังก์ชันสำหรับดึงข้อมูลเอกสารจากเซิร์ฟเวอร์
    const fetchDocuments = async () => {
        try {
            const response = await axios.get('http://localhost:3000/documents');
            // จัดเรียงเอกสารตามวันที่อัปโหลดใหม่ที่สุดอยู่ที่บนสุด
            const sortedDocuments = response.data.sort((a, b) => new Date(b.upload_date) - new Date(a.upload_date));
            setDocuments(sortedDocuments);
            setLoading(false);
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDocuments();
    }, []);

    // ฟังก์ชันสำหรับออกจากระบบ
    const handleLogout = () => {
        const confirmLogout = window.confirm("คุณแน่ใจว่าต้องการออกจากระบบไหม?");
        if (confirmLogout) {
            localStorage.removeItem('username');
            navigate('/loginpage');
        }
    };

    const handleOpen = (document) => {
        setSelectedDocument(document); // ตั้งค่าเอกสารที่เลือก
        setOpen(true); // เปิด modal
    };

    const handleClose = () => {
        setOpen(false); // ปิด modal
        setSelectedDocument(null); // ล้างข้อมูลเอกสารที่เลือก
    };



    // การแสดงข้อความขณะโหลด
    if (loading) return <Typography>กำลังโหลด...</Typography>;

    // การแสดงข้อความเมื่อเกิดข้อผิดพลาด
    if (error) return (
        <Box>
            <Typography>ข้อผิดพลาด: {error}</Typography>
            <Button onClick={fetchDocuments} variant="contained" color="primary">ลองอีกครั้ง</Button>
        </Box>
    );

    const getStatusText = (status) => {
        switch (status) {
            case 0:
                return 'รอดำเนินการ';
            case 1:
                return 'กำลังดำเนินการ'; // ตัวอย่างข้อความอื่นๆ
            case 2:
                return 'ดำเนินการเรียบร้อย'
            default:
                return 'ไม่ทราบสถานะ';
        }
    };

    // รายการเมนูที่แสดงในแถบเมนู
    const menuItems = [
        { text: 'ติดตามเอกสาร', link: '/track', icon: <InsertDriveFile /> },
        { text: 'ส่งเอกสาร', link: '/fileupload', icon: <FileUpload /> },
        { text: 'ข้อมูลผู้ใช้', link: `/profile/`, icon: <AccountCircle /> },
    ];

    return (
        <Box sx={{ display: 'flex', height: '100vh' }}>
            {/* แถบเมนูด้านซ้าย */}
            <Box sx={{ width: 250, bgcolor: '#ffffff', p: 2, boxShadow: 2 }}>
                <Typography variant="h6" gutterBottom>
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            backgroundColor: '#f4f4f4',
                            padding: '8px 16px',
                            borderRadius: '4px',
                        }}
                    >
                        <MenuIcon sx={{ marginRight: '8px', color: '#1976d2' }} />
                        เมนู
                    </Box>
                </Typography>
                <List>
                    {menuItems.map((item) => (
                        <ListItem
                            component="a"
                            href={item.link}
                            key={item.text}
                            sx={{
                                borderRadius: '4px',
                                mb: 1,
                                backgroundColor: location.pathname === item.link ? '#e0e0e0' : 'transparent',
                                '&:hover': { backgroundColor: '#f5f5f5' }
                            }}
                        >
                            <ListItemIcon>
                                {item.icon}
                            </ListItemIcon>
                            <ListItemText primary={item.text} />
                        </ListItem>
                    ))}
                </List>
                <Divider sx={{ my: 2 }} />
                <List>
                    {/* ปุ่มออกจากระบบ */}
                    <ListItem
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

            {/* เนื้อหาหลัก */}
            <Box sx={{ flex: 1, p: 2 }}>
                <Typography variant="h4" gutterBottom>
                    ยินดีต้อนรับสู่หน้าแรก
                </Typography>

                {/* การแสดงผลเอกสาร */}
                {documents.length === 0 ? (
                    <Typography>ไม่มีเอกสาร</Typography>
                ) : (
                    <Box sx={{ overflowX: 'auto', p: 2 }}>
                        <TableContainer component={Paper}>
                            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell >ลำดับ</TableCell>
                                        <TableCell align="left" sx={{ fontWeight: 'bold' }}>วันที่</TableCell>
                                        <TableCell align="left" sx={{ fontWeight: 'bold' }}>เรื่อง</TableCell>
                                        <TableCell align="left" sx={{ fontWeight: 'bold' }}>ชื่อไฟล์</TableCell>
                                        <TableCell align="left" sx={{ fontWeight: 'bold' }}>สถานะ</TableCell>
                                        <TableCell align="left" sx={{ fontWeight: 'bold', whiteSpace: 'nowrap' }}>ผู้รับเอกสาร</TableCell>
                                        <TableCell align="left" sx={{ fontWeight: 'bold' }}>รายละเอียด</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {documents
                                        .slice((page - 1) * rowsPerPage, page * rowsPerPage) // ใช้ slice เพื่อแบ่งเอกสารตามหน้าที่จะแสดง
                                        .map((doc, index) => (

                                            <TableRow
                                                key={doc.id || index}
                                                sx={{
                                                    '&:nth-of-type(even)': { backgroundColor: '#f5f5f5' },
                                                    '&:hover': { backgroundColor: '#e0e0e0' },
                                                    '&:last-child td, &:last-child th': { border: 0 },
                                                }}
                                            >
                                               <TableCell component="th" scope="row">{index + 1 + (page - 1) * rowsPerPage}</TableCell>

                                                <TableCell align="left">{formatDateTime(doc.upload_date)}</TableCell>
                                                <TableCell align="left">{doc.subject}</TableCell>
                                                <TableCell align="left">
                                                    <Link
                                                        href={`http://localhost:3000/${doc.file}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        sx={{ color: '#1976d2', textDecoration: 'none' }}
                                                    >
                                                        {getFileName(doc.file)}
                                                    </Link>
                                                </TableCell>
                                                <TableCell align="left" sx={{ maxWidth: 200, whiteSpace: 'nowrap' }}>{getStatusText(doc.status)}</TableCell>
                                                <TableCell align="left">{doc.recipient}</TableCell>
                                                <TableCell align="left">
                                                    <Button
                                                        variant="contained"
                                                        color="primary"
                                                        onClick={() => handleOpen(doc)}
                                                    >
                                                        ดูรายละเอียด
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                </TableBody>

                            </Table>
                        </TableContainer>
                        <Box sx={{ mt: 3, textAlign: 'center', display: 'flex', justifyContent: 'center' }}>
                            <Pagination
                                count={Math.ceil(documents.length / rowsPerPage)}
                                page={page}
                                shape="rounded"
                                onChange={(event, value) => setPage(value)}
                            />
                        </Box>

                    </Box>


                )}
            </Box>

            {/* ป๊อปอัพสำหรับรายละเอียดเอกสาร */}
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="document-details-title"
                aria-describedby="document-details-description"
            >
                <Box
                    sx={{
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        position: 'absolute',
                        width: { xs: 300, sm: 400, md: 500 },
                        bgcolor: 'background.paper',
                        border: '1px solid #ccc',
                        boxShadow: 24,
                        p: 4,
                        borderRadius: 2,
                        maxHeight: '80vh',
                        overflowY: 'auto',
                    }}
                >
                    <Typography
                        id="document-details-title"
                        variant="h6"
                        component="h2"
                        sx={{ mb: 3, fontWeight: 'bold', textAlign: 'center' }}
                    >
                        รายละเอียดเอกสาร
                    </Typography>
                    {selectedDocument && (
                        <Grid container spacing={2}>
                            {[
                                { label: 'เรื่อง:', value: selectedDocument.subject },
                                { label: 'วันที่และเวลาอัพโหลด:', value: new Date(selectedDocument.upload_date).toLocaleString() },
                                { label: 'ถึง:', value: selectedDocument.to_recipient },
                                {
                                    label: 'ชื่อไฟล์:',
                                    value: (
                                        <Link
                                            href={`http://localhost:3000/${selectedDocument.file}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            sx={{ color: '#1976d2', textDecoration: 'none' }}
                                        >
                                            {selectedDocument.file}
                                        </Link>
                                    ),
                                },
                                { label: 'สถานะ:', value: getStatusText(selectedDocument.status) },
                                { label: 'เลขที่เอกสาร:', value: selectedDocument.document_number },
                                { label: 'ประเภทเอกสาร:', value: selectedDocument.document_type },
                                { label: 'หมายเหตุ:', value: selectedDocument.notes },
                                { label: 'ผู้ส่ง:', value: selectedDocument.sender },
                                { label: 'ผู้รับเอกสาร:', value: selectedDocument.recipient },
                            ].map((item, index) => (
                                <Grid item xs={12} key={index}>
                                    <Box sx={{ mb: 1, display: 'flex', alignItems: 'center', borderBottom: '1px solid #e0e0e0', pb: 1 }}>
                                        <Typography variant="body1" sx={{ fontWeight: 'bold', width: '150px' }}>
                                            {item.label}
                                        </Typography>
                                        <Typography variant="body2" sx={{ ml: 1, flex: 1 }}>
                                            {item.value}
                                        </Typography>
                                    </Box>
                                </Grid>
                            ))}
                        </Grid>
                    )}
                    <Button
                        onClick={handleClose}
                        variant="contained"
                        color="secondary"
                        sx={{ mt: 3, width: '100%' }}
                    >
                        ปิด
                    </Button>
                </Box>
            </Modal>
        </Box>
    );
};

export default TrackDocuments;

// const style = {
//     position: 'absolute',
//     top: '50%',
//     left: '50%',
//     transform: 'translate(-50%, -50%)',
//     width: 400,
//     maxWidth: '90%', // เพิ่มการตั้งค่าสำหรับความกว้างสูงสุด
//     bgcolor: 'background.paper',
//     border: '2px solid #000',
//     boxShadow: 24,
//     p: 4,
//     borderRadius: 2, // เพิ่มมุมโค้ง
//     overflow: 'auto' // เพิ่มการเลื่อนเมื่อเนื้อหามาก
// };
