import { useEffect, useState } from 'react';
import { Box, Button, TextField, Typography, Paper, Dialog, DialogTitle, DialogContent, DialogActions, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import SendIcon from '@mui/icons-material/Send';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';


const EditDocument = () => {
    const { id } = useParams(); // ใช้ id จาก URL เพื่อดึงข้อมูล
    const [values, setValues] = useState({
        upload_date: '',
        subject: '',
        to_recipient: '',
        document_type: '',
        notes: ''
    });
    const [fileName, setFileName] = useState('');
    const [existingFileName, setExistingFileName] = useState('');
    const [dialogOpen, setDialogOpen] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const navigate = useNavigate();


    useEffect(() => {
        const fetchDocument = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/document/${id}`);
                const data = response.data;

                // แปลงค่า upload_date ให้ตรงตามรูปแบบ
                const localDateTime = new Date(data.upload_date).toISOString().slice(0, 16);
                setValues({ ...data, upload_date: localDateTime }); // เซ็ตค่าข้อมูลเอกสาร
                setExistingFileName(data.file); // เซ็ตชื่อไฟล์ที่เคยอัปโหลด
            } catch (error) {
                console.error("Error fetching document:", error);
            }
        };
        fetchDocument();
    }, []);


    // ฟังก์ชันสำหรับอัปเดตค่าในฟอร์ม
    const handleInput = (e) => {
        setValues({ ...values, [e.target.name]: e.target.value });
    };

    // ฟังก์ชันสำหรับจัดการไฟล์ที่เลือก
    const handleFileChange = (e) => {
        setFileName(e.target.files[0].name);
    };

    // ฟังก์ชันสำหรับส่งข้อมูลที่แก้ไขไปยังเซิร์ฟเวอร์
    const handleSubmit = async () => {
        try {
            const formData = new FormData();
            formData.append('upload_date', values.upload_date);
            formData.append('subject', values.subject);
            formData.append('to_recipient', values.to_recipient);
            formData.append('document_type', values.document_type);
            formData.append('notes', values.notes);
            if (fileName) {
                formData.append('file', fileName);
            }

            const response = await axios.put(`http://localhost:3000/useredit/document/${id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (response.status === 200) {
                setSuccessMessage('เอกสารถูกอัปเดตเรียบร้อยแล้ว');
                setDialogOpen(true);
            }
        } catch (error) {
            console.error("Error updating document:", error);
        }
    };
    // ปิด Dialog สำเร็จ
    const handleDialogClose = () => {
        setDialogOpen(false);
        navigate('/track');
    };
    const handleCancel = () => {
        navigate('/track');
    };

    return (
        <Box sx={{ flex: 1, p: 2, maxWidth: 800, mx: 'auto', bgcolor: '#f9f9f9', borderRadius: 2, boxShadow: 3 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 2 }}>
                <Typography variant="h4" gutterBottom>
                    แก้ไขเอกสาร
                </Typography>

                {/* ฟิลด์ต่างๆ สำหรับแก้ไข */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <Box sx={{ flexGrow: 1 }}>
                        <TextField
                            type="datetime-local"
                            name="upload_date"
                            value={values.upload_date}
                            onChange={handleInput}
                            sx={{ width: 250 }}

                        />
                    </Box>
                </Box>

                <Box sx={{ width: '100%', mb: 5, display: 'flex', gap: 2, justifyContent: 'center' }}>
                    <TextField
                        label="เรื่อง"
                        name="subject"
                        value={values.subject}
                        onChange={handleInput}
                        sx={{ width: 530 }}

                    />
                </Box>

                <Box sx={{ width: '100%', mb: 5, display: 'flex', gap: 2, justifyContent: 'center' }}>
                    <TextField
                        label="ถึง"
                        name="to_recipient"
                        value={values.to_recipient}
                        onChange={handleInput}
                        sx={{ width: 270 }}

                    />
                    <FormControl sx={{ width: 250 }}>
                        <InputLabel id="document-type-label">ประเภทเอกสาร</InputLabel>
                        <Select
                            labelId="document-type-label"
                            id="document-type"
                            name="document_type"
                            value={values.document_type}
                            label="ประเภทเอกสาร"
                            onChange={handleInput}
                        >
                            <MenuItem value="">
                                <em>None</em>
                            </MenuItem>
                            <MenuItem value="เอกสารภายใน">เอกสารภายใน</MenuItem>
                            <MenuItem value="เอกสารภายนอก">เอกสารภายนอก</MenuItem>
                            <MenuItem value="เอกสารสำคัญ">เอกสารสำคัญ</MenuItem>
                        </Select>
                    </FormControl>
                </Box>

                <Box sx={{ width: '100%' }}>
                    <TextField
                        label="หมายเหตุ"
                        name="notes"
                        value={values.notes}
                        onChange={handleInput}
                        sx={{ width: 550 }}
                        multiline
                        rows={4}

                    />
                </Box>

                {/* แสดงไฟล์ที่อัปโหลดก่อนหน้านี้ */}
                {existingFileName && (
                    <Paper
                        elevation={2}
                        sx={{
                            p: 1,
                            backgroundColor: '#f5f5f5',
                            display: 'flex',
                            alignItems: 'center',
                            borderRadius: 1,
                            mt: 2
                        }}
                    >
                        <PictureAsPdfIcon sx={{ color: '#d32f2f', mr: 1 }} /> {/* แสดงไอคอน PDF */}
                        <Typography variant="body2" sx={{ color: 'black' }}>
                            ไฟล์ที่เคยอัปโหลด: {existingFileName}
                        </Typography>
                    </Paper>
                )}

                {/* ปุ่มสำหรับอัปโหลดไฟล์ใหม่ */}
                <Box sx={{ width: '100%', mb: 5, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, mt: 3 }}>
                    <Button variant="contained" component="label" startIcon={<PictureAsPdfIcon />} >
                        อัปโหลดไฟล์ใหม่
                        <input type="file" hidden onChange={handleFileChange} />
                    </Button>
                    {fileName && (
                        <Paper
                            elevation={2}
                            sx={{
                                p: 1,
                                backgroundColor: '#f5f5f5',
                                display: 'flex',
                                alignItems: 'center',
                                borderRadius: 1,
                            }}
                        >
                            <PictureAsPdfIcon sx={{ color: '#d32f2f', mr: 1 }} />
                            <Typography variant="body2" sx={{ mt: 1 }}>
                                ไฟล์ที่เลือก: {fileName}
                            </Typography>
                        </Paper>
                    )}
                </Box>

                {/* ปุ่มบันทึก */}
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
                        <Button
                            variant="contained"
                            endIcon={<SendIcon />}
                            onClick={handleSubmit}
                            sx={{ width: '150px', height: '50px', fontSize: '16px' }}
                        >
                            บันทึก
                        </Button>
                        <Button
                            variant="contained"
                            sx={{ width: '150px', height: '50px', fontSize: '16px' }}
                            onClick={handleCancel}
                        >
                            ยกเลิก
                        </Button>
                    </Box>
                </Box>

            </Box>

            {/* Dialog เมื่อสำเร็จ */}
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
                    <Button onClick={handleDialogClose}>ตกลง</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default EditDocument;
