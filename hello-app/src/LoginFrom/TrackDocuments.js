import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Paper, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, CircularProgress, InputBase, Link, Button, Tooltip, List, ListItem, Collapse, ListItemIcon, ListItemText, Divider, Modal, IconButton, Grid } from '@mui/material';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { FileUpload, AccountCircle, ExitToApp, InsertDriveFile } from '@mui/icons-material';
import MenuIcon from '@mui/icons-material/Menu';
import Pagination from '@mui/material/Pagination';
import { format } from 'date-fns';
import DeleteIcon from '@mui/icons-material/Delete';
import { Chip } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import Swal from 'sweetalert2';
import Drawer from '../AppBar/Drawer';
import { Search, } from '@mui/icons-material';


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
    const { id } = useParams();
    const [userId, setUserId] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [open, setOpen] = useState(false);
    const [selectedDocument, setSelectedDocument] = useState(null);
    const [page, setPage] = useState(1); // สถานะสำหรับเก็บหน้าปัจจุบัน
    const [rowsPerPage] = useState(10);   // จำนวนเอกสารที่จะแสดงต่อหน้า
    const indexOfLastDocument = page * rowsPerPage;
    const indexOfFirstDocument = indexOfLastDocument - rowsPerPage;
    const currentDocuments = documents.slice(indexOfFirstDocument, indexOfLastDocument);
    const storedUserFname = localStorage.getItem('user_fname');
    const storedUserLname = localStorage.getItem('user_lname');
    const senderName = `${storedUserFname} ${storedUserLname}`;
    const colors = ['#FF5733', '#33FF57', '#3357FF', '#F1C40F', '#8E44AD']; // Array of colors
    const [menuOpen, setMenuOpen] = useState(true); // สถานะสำหรับการซ่อน/แสดงเมนู
    const navigate = useNavigate(); // ใช้สำหรับนำทาง
    const location = useLocation(); // ใช้สำหรับตรวจสอบที่อยู่ URL ปัจจุบัน
    const [search, setSearch] = useState('');

    const fetchDocuments = async () => {
        try {
            const token = localStorage.getItem('token'); // สมมุติว่าเก็บ token ไว้ใน localStorage
            const response = await axios.get('http://localhost:3000/documents', {
                headers: { Authorization: `Bearer ${token}` }
            });
            console.log(response.data); // ตรวจสอบข้อมูลที่ได้รับ
            const sortedDocuments = response.data.sort((a, b) => new Date(b.upload_date) - new Date(a.upload_date));
            setDocuments(sortedDocuments);
            setLoading(false);
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    };


    const handleDelete = async (docId) => {
        if (!docId) {
            return;
        }
        Swal.fire({
            title: 'Are you sure?',
            text: `คุณแน่ใจว่าต้องการลบเอกสารที่มี ID: ${docId} หรือไม่?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'Cancel',
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await axios.delete(`http://localhost:3000/document/${docId}`);
                    console.log(`Document with ID ${docId} deleted successfully.`);

                    // แสดงข้อความเมื่อทำการลบสำเร็จ
                    Swal.fire(
                        'Deleted!',
                        `เอกสารที่มี ID ${docId} ถูกลบเรียบร้อยแล้ว.`,
                        'success'
                    );

                    // รีเฟรชรายการเอกสารหลังจากลบสำเร็จ
                    fetchDocuments();
                } catch (error) {
                    console.error('Error deleting document:', error);
                    Swal.fire('Error', 'เกิดข้อผิดพลาดในการลบเอกสาร', 'error');
                }
            }
        });
    };

    useEffect(() => {
        fetchDocuments();
    }, []);

    const handleOpen = (document) => {
        setSelectedDocument(document); // ตั้งค่าเอกสารที่เลือก
        setOpen(true); // เปิด modal
    };

    const handleClose = () => {
        setOpen(false); // ปิด modal
        setSelectedDocument(null); // ล้างข้อมูลเอกสารที่เลือก
    };

    const handleEditClick = (docId) => {
        setLoading(true); // เริ่มการโหลด
        setTimeout(() => {
            navigate(`/user-edit/${docId}`);// เปลี่ยนหน้าไปยัง path ที่ระบุ
            setLoading(false); // หยุดการโหลดหลังจากเปลี่ยนหน้า
        }, 400); // หน่วงเวลา 400ms
    };

    // ฟังก์ชันกรองเอกสารตามการค้นหา
    const filteredDocuments = documents.filter(doc =>
        doc.subject.toLowerCase().includes(search.toLowerCase()) // ฟิลเตอร์เอกสารตามชื่อเรื่อง
    );
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
                return { label: 'รอดำเนินการ', color: 'error' }; // สีเหลือง
            case 1:
                return { label: 'กำลังดำเนินการ', color: 'info' }; // สีฟ้า
            case 2:
                return { label: 'ดำเนินการเรียบร้อย', color: 'success' }; // สีเขียว
            default:
                return { label: 'ไม่ทราบสถานะ', color: 'default' }; // สีเทา
        }
    };

    // ฟังก์ชันจัดเรียงเอกสาร
    const sortedDocuments = filteredDocuments.sort((a, b) => {
        const statusOrder = {
            0: 1, // รอดำเนินการ
            1: 2, // กำลังดำเนินการ
            2: 3, // ดำเนินการเรียบร้อย
        };
        const statusA = statusOrder[a.status];
        const statusB = statusOrder[b.status];

        // เรียงตามสถานะ
        if (statusA !== statusB) {
            return statusA - statusB; // ถ้าไม่เหมือนกัน เรียงตามสถานะ
        }

        // เรียงตามวันที่ (ใหม่สุดไปเก่าที่สุด)
        return new Date(b.upload_date) - new Date(a.upload_date);
    });

    // ฟังก์ชันเพื่อแปลง ID เป็นชื่อ
    const getAdminNameById = (recipient) => {
        switch (recipient) {
            case 1:
                return 'อรวรรณ หนูนุ่น';
            case 2:
                return 'สุภา นวลจันทร์';
            case 3:
                return 'เซเวอร์รหัส สเนป';
            default:
                return 'รอผู้รับ';
        }
    };

    const toggleMenu = () => {
        setMenuOpen((prev) => !prev); // เปลี่ยนสถานะของเมนู
    };

    return (
        <Box sx={{ display: 'flex', height: '100vh' }}>
            {/* สถานะการโหลด */}
            {loading && (
                <Box style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100vw',
                    height: '100vh',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: 'rgba(255, 255, 255, 0.7)',
                    cursor: loading ? 'none' : 'auto',
                    zIndex: 9999
                }}>
                    <CircularProgress />
                </Box>
            )}
            <Drawer menuOpen={menuOpen} toggleMenu={toggleMenu} />
            {/* เนื้อหาหลัก */}
            {/* เนื้อหาหลัก */}
            <Box sx={{ flex: 1, p: 2, bgcolor: '#E4E4E7' }}>
                <Typography variant="h4" gutterBottom>
                    ยินดีต้อนรับสู่หน้าแรก
                </Typography>
                <Box sx={{ overflowX: 'auto', p: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', backgroundColor: '#fff', borderRadius: '4px', px: 1, mx: 2, mb: 4 }}>
                        <IconButton sx={{ p: '10px' }}>
                            <Search />
                        </IconButton>
                        <InputBase
                            placeholder="Search…"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)} // อัปเดตค่าเมื่อมีการพิมพ์
                            sx={{ ml: 1, flex: 1 }}
                        />
                    </Box>
                    <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 650 }} aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>ลำดับ</TableCell>
                                    <TableCell align="left" sx={{ fontWeight: 'bold' }}>วันที่</TableCell>
                                    <TableCell align="left" sx={{ fontWeight: 'bold' }}>เรื่อง</TableCell>
                                    <TableCell align="left" sx={{ fontWeight: 'bold' }}>ไฟล์</TableCell>
                                    <TableCell align="left" sx={{ fontWeight: 'bold' }}>สถานะ</TableCell>
                                    <TableCell align="left" sx={{ fontWeight: 'bold', whiteSpace: 'nowrap' }}>ผู้รับเอกสาร</TableCell>
                                    <TableCell align="center" sx={{ fontWeight: 'bold' }}>Action</TableCell>
                                    <TableCell align="left" sx={{ fontWeight: 'bold' }}>รายละเอียด</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {(filteredDocuments.length === 0 ? documents : filteredDocuments)
                                    .slice((page - 1) * rowsPerPage, page * rowsPerPage) // ใช้ slice เพื่อแบ่งเอกสารตามหน้าที่จะแสดง
                                    .map((doc, index) => {
                                        return (
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
                                                <TableCell align="left">
                                                    {/* ไฮไลต์ชื่อเรื่องที่ตรงกับการค้นหา */}
                                                    {doc.subject.split(new RegExp(`(${search})`, 'i')).map((part, i) => (
                                                        <span key={i} style={{ backgroundColor: part.toLowerCase() === search.toLowerCase() && filteredDocuments.length > 0 ? '#ffeb3b' : 'transparent' }}>
                                                            {part}
                                                        </span>
                                                    ))}
                                                </TableCell>
                                                <TableCell>
                                                    <Tooltip title="เปิดไฟล์ PDF" arrow>
                                                        <Button
                                                            variant="contained"
                                                            color="primary"
                                                            onClick={() => {
                                                                window.open(`http://localhost:3000/${doc.file}`, '_blank'); // เปิดไฟล์ในแท็บใหม่
                                                            }}
                                                            sx={{
                                                                textTransform: 'none', // ปิดการแปลงข้อความเป็นตัวพิมพ์ใหญ่
                                                            }}
                                                        >
                                                            PDF
                                                        </Button>
                                                    </Tooltip>
                                                </TableCell>
                                                <TableCell align="left" sx={{ maxWidth: 200, whiteSpace: 'nowrap' }}>
                                                    {
                                                        (() => {
                                                            const { label, color } = getStatusText(doc.status);
                                                            return <Chip label={label} color={color} sx={{ borderRadius: '4px' }} />;
                                                        })()
                                                    }
                                                </TableCell>
                                                <TableCell align="left">{getAdminNameById(doc.recipient)}</TableCell>
                                                <TableCell align="left">
                                                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                                                        <Button
                                                            variant="contained"
                                                            startIcon={<EditIcon />}
                                                            color="primary"
                                                            sx={{
                                                                mx: 0.5,
                                                                '&:hover': {
                                                                    backgroundColor: '#1976d2',
                                                                    boxShadow: '0 4px 20px rgba(25, 118, 210, 0.3)',
                                                                },
                                                                transition: '0.3s',
                                                            }}
                                                            onClick={() => handleEditClick(doc.document_id)}
                                                        >
                                                            Edit
                                                        </Button>
                                                        <Button
                                                            variant="outlined"
                                                            startIcon={<DeleteIcon />}
                                                            color="error"
                                                            sx={{
                                                                mx: 0.5,
                                                                '&:hover': {
                                                                    backgroundColor: '#f44336',
                                                                    color: '#fff',
                                                                },
                                                                transition: '0.3s',
                                                            }}
                                                            onClick={() => handleDelete(doc.document_id)}
                                                        >
                                                            Delete
                                                        </Button>
                                                    </Box>
                                                </TableCell>
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
                                        );
                                    })}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <Box sx={{ mt: 3, textAlign: 'center', display: 'flex', justifyContent: 'center' }}>
                        <Pagination
                            count={Math.ceil(filteredDocuments.length / rowsPerPage)} // ใช้ count จาก filteredDocuments
                            page={page}
                            shape="rounded"
                            onChange={(event, value) => setPage(value)}
                        />
                    </Box>
                </Box>
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
                                {
                                    label: 'สถานะ:',
                                    value: (
                                        <Chip {...getStatusText(selectedDocument.status)} sx={{ borderRadius: '4px' }} />
                                    ),
                                },
                                { label: 'เลขที่เอกสาร:', value: selectedDocument.document_number },
                                { label: 'ประเภทเอกสาร:', value: selectedDocument.document_type },
                                {
                                    label: 'หมายเหตุ:',
                                    value: (
                                        <Box>
                                            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                                หมายเหตุจากผู้ใช้:
                                            </Typography>
                                            <Typography variant="body2" sx={{ ml: 1, mb: 2 }}>
                                                {selectedDocument.notes}
                                            </Typography>
                                            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                                ตอบกลับจากแอดมิน:
                                            </Typography>
                                            <Typography variant="body2" sx={{ ml: 1 }}>
                                                {selectedDocument.admin_reply || "ยังไม่มีการตอบกลับ"}
                                            </Typography>
                                        </Box>
                                    ),
                                },
                                { label: 'ผู้ส่ง:', value: senderName },
                                { label: 'ผู้รับเอกสาร:', value: getAdminNameById(selectedDocument.recipient) },
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
