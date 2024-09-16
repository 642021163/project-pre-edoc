import React, { useState } from 'react';
import {
    Box, CssBaseline, AppBar, Toolbar, Typography, IconButton, Badge, InputBase, Drawer, List, ListItem,
    ListItemIcon, ListItemText, Paper, Button, Grid, TextField, FormControl, InputLabel, Select,
    MenuItem, Dialog, DialogActions, DialogContent, DialogTitle, Tooltip, CircularProgress
} from '@mui/material';
import { Search, Notifications, Home, PersonAdd } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import CheckCircleIcon from '@mui/icons-material/CheckCircle'; // ไอคอนสำเร็จ
import { format, parseISO } from 'date-fns';


const drawerWidth = 240; // หรือค่าที่คุณต้องการ
// การจัดรูปแบบวันที่และเวลา
const formatDateTime = (dateTime) => format(parseISO(dateTime), 'yyyy-MM-dd HH:mm:ss');

function Addfile() {
    const navigate = useNavigate();
    const [document, setDocument] = useState({
        upload_date: '',
        subject: '',
        to_recipient: '',
        document_type: '',
        file: null,
        notes: ''
    });

    const [loading, setLoading] = useState(false); // สถานะการโหลด
    const [error, setError] = useState(null);
    const [dialogOpen, setDialogOpen] = useState(false); // สถานะเปิด/ปิด Dialog
    const [successMessage, setSuccessMessage] = useState(''); // ข้อความสำเร็จ
    const [fileName, setFileName] = useState('');

    const document_typeOptions = [
        { value: 'ประเภทที่ 1', label: 'ประเภทที่ 1' },
        { value: 'ประเภทที่ 2', label: 'ประเภทที่ 2' },
        { value: 'ประเภทที่ 3', label: 'ประเภทที่ 3' }
    ];

    // จัดการการเปลี่ยนแปลงของฟอร์ม
    const handleChange = (e) => {
        const { name, value } = e.target;
        setDocument(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFileName(file.name); // บันทึกชื่อไฟล์
            setDocument(prev => ({
                ...prev,
                file: file // ตั้งค่าไฟล์ให้ตรงกับ state
            }));
        }
    };


    // จัดการการส่งฟอร์ม
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true); // ตั้งค่าสถานะการโหลด

        const formData = new FormData();
        formData.append('upload_date', document.upload_date);
        formData.append('subject', document.subject);
        formData.append('to_recipient', document.to_recipient);
        formData.append('document_type', document.document_type);
        formData.append('notes', document.notes);
        if (!document.file) {
            console.error('No file selected');
            setError('กรุณาเลือกไฟล์');
            setLoading(false);
            return;

        }
        if (document.file) {
            formData.append('file', document.file); // เพิ่มไฟล์ใน FormData ถ้ามีการเลือกไฟล์
        }



        try {
            const response = await axios.post('http://localhost:3000/documents', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            console.log('Response:', response.data); // ดูข้อมูลที่ตอบกลับจากเซิร์ฟเวอร์
            setSuccessMessage('บันทึกข้อมูลเรียบร้อยแล้ว');
            setDialogOpen(true);
            setDocument({
                upload_date: '',
                subject: '',
                to_recipient: '',
                document_type: '',
                file: null,
                notes: ''
            });
        } catch (error) {
            console.error('เกิดข้อผิดพลาดในการเพิ่มเอกสาร:', error.response?.data || error.message);
            setError('เกิดข้อผิดพลาดในการเพิ่มเอกสาร');
        } finally {
            setLoading(false);
        }

    };

    // ปิด Dialog
    const handleDialogClose = () => {
        setDialogOpen(false);
        navigate('/doc'); // นำทางไปยังหน้า document list หลังจากปิด Dialog
    };

    const handleBackToHome = () => {
        navigate('/home'); // นำทางไปที่หน้าโฮม
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
                        <Box sx={{ display: 'flex', alignItems: 'center', backgroundColor: '#fff', borderRadius: '4px', px: 1, mx: 2 }}>
                            <IconButton sx={{ p: '10px' }}>
                                <Search />
                            </IconButton>
                            <InputBase
                                placeholder="Search…"
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
                                <ListItemIcon sx={{ color: '#ddd' }}> {/* ไอคอนสีเทาอ่อน */}
                                    <Home />
                                </ListItemIcon>
                                <ListItemText primary="Home" />
                            </ListItem>
                        </Tooltip>
                        <Tooltip title="ผู้ใช้ที่ลงทะเบียน" arrow>
                            <ListItem button onClick={() => navigate('/user-list')}>
                                <ListItemIcon sx={{ color: '#ddd' }}> {/* ไอคอนสีเทาอ่อน */}
                                    <PersonAdd />
                                </ListItemIcon>
                                <ListItemText primary="ผู้ใช้ที่ลงทะเบียน" />
                            </ListItem>
                        </Tooltip>
                    </List>
                </Box>
            </Drawer>
            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                <Typography variant="h4" gutterBottom>Add Document</Typography>
                <Paper
                    sx={{
                        padding: 3,
                        backgroundColor: '#f5f5f5' // สีพื้นหลังของ Paper
                    }}
                >
                    <form onSubmit={handleSubmit}>
                        <Box mb={2}>
                            <Grid container spacing={2}>
                                {/* Row 1 */}
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        label="วันที่อัปโหลด"
                                        name="upload_date"
                                        type="datetime-local"
                                        value={document.upload_date}
                                        onChange={handleChange}
                                        fullWidth
                                        required
                                        InputLabelProps={{ shrink: true }}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        label="เรื่อง"
                                        name="subject"
                                        value={document.subject}
                                        onChange={handleChange}
                                        fullWidth
                                        required
                                    />
                                </Grid>

                                {/* Row 2 */}
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        label="ถึง"
                                        name="to_recipient"
                                        value={document.to_recipient}
                                        onChange={handleChange}
                                        fullWidth
                                        required
                                    />
                                </Grid>

                                <Grid item xs={12} md={6}>
                                    <FormControl fullWidth>
                                        <InputLabel>ประเภทเอกสาร</InputLabel>
                                        <Select
                                            name="document_type"
                                            value={document.document_type}
                                            onChange={handleChange}
                                        >
                                            {document_typeOptions.map((option, index) => (
                                                <MenuItem key={index} value={option.value}>
                                                    {option.label}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>

                                {/* Row 3 */}
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        label="หมายเหตุ"
                                        name="notes"
                                        value={document.notes}
                                        onChange={handleChange}
                                        fullWidth
                                        multiline
                                        rows={4}
                                    />
                                </Grid>

                                {/* ช่องสำหรับอัปโหลดไฟล์ */}

                                <Grid item xs={12} md={6}>
                                    <Box mb={2} sx={{ display: 'flex', alignItems: 'center' }}>
                                        <input
                                            accept=".pdf, .doc, .docx, .jpg, .png"
                                            id="upload-file"
                                            type="file"
                                            style={{ display: 'none' }} // ซ่อน input ดั้งเดิม
                                            onChange={handleFileChange}
                                        />
                                        <label htmlFor="upload-file">
                                            <Button
                                                variant="contained"
                                                component="span"
                                                startIcon={<PictureAsPdfIcon />} // ใช้ไอคอนสำหรับไฟล์ PDF
                                                sx={{ mr: 2 }} // เพิ่ม margin ด้านขวาของปุ่ม
                                            >
                                                เลือกไฟล์
                                            </Button>
                                        </label>

                                        {/* แสดงชื่อไฟล์ที่เลือก */}
                                        {fileName && (
                                            <Paper
                                                elevation={2}
                                                sx={{
                                                    p: 1,
                                                    backgroundColor: '#f5f5f5',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                }}
                                            >
                                                <PictureAsPdfIcon sx={{ color: '#d32f2f', mr: 1 }} /> {/* แสดงไอคอน PDF ด้านหน้า */}
                                                <Typography variant="body2" sx={{ color: 'black' }}>
                                                    ไฟล์ที่เลือก: {fileName}
                                                </Typography>
                                            </Paper>
                                        )}
                                    </Box>

                                </Grid>
                            </Grid>
                        </Box>

                        <Box>
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                disabled={loading} // ปิดปุ่มเมื่อกำลังโหลด
                                startIcon={loading && <CircularProgress size={20} color="inherit" />}
                            >
                                {loading ? 'กำลังบันทึก...' : 'บันทึกเอกสาร'}
                            </Button>
                        </Box>
                    </form>

                </Paper>
            </Box>

            {/* Dialog สำหรับแสดงข้อความสำเร็จ */}
            <Dialog
                open={dialogOpen}
                onClose={handleDialogClose}
                maxWidth="xs"
                fullWidth
            >
                <DialogTitle>
                    <Typography variant="h6" style={{ display: 'flex', alignItems: 'center' }}>
                        <CheckCircleIcon color="success" style={{ marginRight: 8 }} />
                        สำเร็จ
                    </Typography>
                </DialogTitle>
                <DialogContent>
                    <Typography variant="body1">
                        {successMessage}
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDialogClose} color="primary">
                        ปิด
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}

export default Addfile;
