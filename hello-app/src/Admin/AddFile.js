// import React, { useState } from 'react';
// import {
//     Box, CssBaseline, Typography, Paper, Button, Grid, TextField, FormControl, InputLabel, Select,
//     MenuItem, Dialog, DialogActions, DialogContent, DialogTitle, CircularProgress
// } from '@mui/material';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
// import { format, parseISO } from 'date-fns';
// import Layout from '../LayoutAdmin/Layout';
// import Swal from 'sweetalert2';


// // การจัดรูปแบบวันที่และเวลา
// const formatDateTime = (dateTime) => format(parseISO(dateTime), 'yyyy-MM-dd HH:mm:ss');

// function Addfile() {
//     const navigate = useNavigate();
//     const [document, setDocument] = useState({
//         upload_date: '',
//         subject: '',
//         to_recipient: '',
//         document_type: '',
//         file: null,
//         notes: ''
//     });

//     const [loading, setLoading] = useState(false); // สถานะการโหลด
//     const [error, setError] = useState(null);
//     const [dialogOpen, setDialogOpen] = useState(false); // สถานะเปิด/ปิด Dialog
//     const [successMessage, setSuccessMessage] = useState(''); // ข้อความสำเร็จ
//     const [fileName, setFileName] = useState('');

//     const document_typeOptions = [
//         { value: 'เอกสารภายใน', label: 'เอกสารภายใน' },
//         { value: 'เอกสารภายนอก', label: 'เอกสารภายนอก' },
//         { value: 'เอกสารสำคัญ', label: 'เอกสารสำคัญ' }
//     ];

//     // จัดการการเปลี่ยนแปลงของฟอร์ม
//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setDocument(prev => ({
//             ...prev,
//             [name]: value
//         }));
//     };

//     const handleFileChange = (e) => {
//         const file = e.target.files[0];
//         if (file) {
//             setFileName(file.name); // บันทึกชื่อไฟล์
//             setDocument(prev => ({
//                 ...prev,
//                 file: file // ตั้งค่าไฟล์ให้ตรงกับ state
//             }));
//         }
//     };


//     // จัดการการส่งฟอร์ม
//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setLoading(true); // ตั้งค่าสถานะการโหลด

//         const formData = new FormData();
//         formData.append('upload_date', document.upload_date);
//         formData.append('subject', document.subject);
//         formData.append('to_recipient', document.to_recipient);
//         formData.append('document_type', document.document_type);
//         formData.append('notes', document.notes);
//         if (!document.file) {
//             console.error('No file selected');
//             setError('กรุณาเลือกไฟล์');
//             setLoading(false);
//             return;
//         }
//         if (document.file) {
//             formData.append('file', document.file); // เพิ่มไฟล์ใน FormData ถ้ามีการเลือกไฟล์
//         }

//         try {
//             const response = await axios.post('http://localhost:3000/documents', formData, {
//                 headers: {
//                     'Content-Type': 'multipart/form-data'
//                 }
//             });
//             console.log('Response:', response.data); // ดูข้อมูลที่ตอบกลับจากเซิร์ฟเวอร์

//             // ใช้ SweetAlert แสดงแจ้งเตือนความสำเร็จ
//             Swal.fire({
//                 icon: 'success',
//                 title: 'Success',
//                 text: 'บันทึกข้อมูลเรียบร้อยแล้ว',
//             }).then(() => {
//                 // หลังจากปิด SweetAlert นำผู้ใช้กลับไปที่หน้าติดตามเอกสาร
//                 navigate('/doc');
//             });

//             // รีเซ็ตฟอร์ม
//             setDocument({
//                 upload_date: '',
//                 subject: '',
//                 to_recipient: '',
//                 document_type: '',
//                 file: null,
//                 notes: ''
//             });
//         } catch (error) {
//             console.error('เกิดข้อผิดพลาดในการเพิ่มเอกสาร:', error.response?.data || error.message);

//             // แสดงแจ้งเตือนข้อผิดพลาดด้วย SweetAlert
//             Swal.fire({
//                 icon: 'error',
//                 title: 'Error',
//                 text: 'เกิดข้อผิดพลาดในการเพิ่มเอกสาร',
//             });
//         } finally {
//             setLoading(false); // ปิดสถานะการโหลด
//         }
//     };

//     const handleCancel = () => {
//         navigate('/doc');
//     };

//     return (
//         <Layout>
//             <Box sx={{ display: 'flex' }}>
//                 <CssBaseline />
//                 <Box component="main" sx={{ flexGrow: 1, p: 1 }}>
//                     <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', textAlign: 'left', color: '#1976d2' }}>เพิ่มเอกสาร</Typography>
//                     <Paper
//                         sx={{
//                             padding: 3,
//                             backgroundColor: '#f5f5f5' // สีพื้นหลังของ Paper
//                         }}
//                     >
//                         <form onSubmit={handleSubmit}>
//                             <Box mb={2}>
//                                 <Grid container spacing={2}>
//                                     {/* Row 1 */}
//                                     <Grid item xs={12} md={6}>
//                                         <TextField
//                                             label="วันที่อัปโหลด"
//                                             name="upload_date"
//                                             type="datetime-local"
//                                             value={document.upload_date}
//                                             onChange={handleChange}
//                                             fullWidth
//                                             required
//                                             InputLabelProps={{ shrink: true }}
//                                             inputProps={{
//                                                 max: new Date().toISOString().slice(0, 16) // จำกัดให้เลือกได้แค่วันที่ปัจจุบันหรือก่อนหน้า
//                                             }}
//                                         />
//                                     </Grid>

//                                     <Grid item xs={12} md={6}>
//                                         <TextField
//                                             label="เรื่อง"
//                                             name="subject"
//                                             value={document.subject}
//                                             onChange={handleChange}
//                                             fullWidth
//                                             required
//                                         />
//                                     </Grid>

//                                     {/* Row 2 */}
//                                     <Grid item xs={12} md={6}>
//                                         <TextField
//                                             label="ถึง"
//                                             name="to_recipient"
//                                             value={document.to_recipient}
//                                             onChange={handleChange}
//                                             fullWidth
//                                             required
//                                         />
//                                     </Grid>

//                                     <Grid item xs={12} md={6}>
//                                         <FormControl fullWidth>
//                                             <InputLabel>ประเภทเอกสาร</InputLabel>
//                                             <Select
//                                                 name="document_type"
//                                                 value={document.document_type}
//                                                 onChange={handleChange}
//                                             >
//                                                 {document_typeOptions.map((option, index) => (
//                                                     <MenuItem key={index} value={option.value}>
//                                                         {option.label}
//                                                     </MenuItem>
//                                                 ))}
//                                             </Select>
//                                         </FormControl>
//                                     </Grid>

//                                     {/* Row 3 */}
//                                     <Grid item xs={12} md={6}>
//                                         <TextField
//                                             label="หมายเหตุ"
//                                             name="notes"
//                                             value={document.notes}
//                                             onChange={handleChange}
//                                             fullWidth
//                                             multiline
//                                             rows={4}
//                                         />
//                                     </Grid>

//                                     {/* ช่องสำหรับอัปโหลดไฟล์ */}

//                                     <Grid item xs={12} md={6}>
//                                         <Box mb={2} sx={{ display: 'flex', alignItems: 'center' }}>
//                                             <input
//                                                 accept=".pdf, .doc, .docx, .jpg, .png"
//                                                 id="upload-file"
//                                                 type="file"
//                                                 style={{ display: 'none' }} // ซ่อน input ดั้งเดิม
//                                                 onChange={handleFileChange}
//                                             />
//                                             <label htmlFor="upload-file">
//                                                 <Button
//                                                     variant="contained"
//                                                     component="span"
//                                                     startIcon={<PictureAsPdfIcon />} // ใช้ไอคอนสำหรับไฟล์ PDF
//                                                     sx={{ mr: 2 }} // เพิ่ม margin ด้านขวาของปุ่ม
//                                                 >
//                                                     เลือกไฟล์
//                                                 </Button>
//                                             </label>

//                                             {/* แสดงชื่อไฟล์ที่เลือก */}
//                                             {fileName && (
//                                                 <Paper
//                                                     elevation={2}
//                                                     sx={{
//                                                         p: 1,
//                                                         backgroundColor: '#f5f5f5',
//                                                         display: 'flex',
//                                                         alignItems: 'center',
//                                                     }}
//                                                 >
//                                                     <PictureAsPdfIcon sx={{ color: '#d32f2f', mr: 1 }} /> {/* แสดงไอคอน PDF ด้านหน้า */}
//                                                     <Typography variant="body2" sx={{ color: 'black' }}>
//                                                         ไฟล์ที่เลือก: {fileName}
//                                                     </Typography>
//                                                 </Paper>
//                                             )}
//                                         </Box>

//                                     </Grid>
//                                 </Grid>
//                             </Box>

//                             <DialogActions style={{ justifyContent: 'center' }}>
//                                 <Button
//                                     type="submit"
//                                     variant="contained"
//                                     color="primary"
//                                     disabled={loading} // ปิดปุ่มเมื่อกำลังโหลด
//                                     startIcon={loading && <CircularProgress size={20} color="inherit" />}
//                                 >
//                                     {loading ? 'กำลังบันทึก...' : 'บันทึกเอกสาร'}
//                                 </Button>
//                                 <Button
//                                     color="error"
//                                     variant="outlined"
//                                     onClick={handleCancel}
//                                 >
//                                     ยกเลิก
//                                 </Button>
//                             </DialogActions>
//                         </form>

//                     </Paper>
//                 </Box>
//             </Box>
//         </Layout>
//     );
// }

// export default Addfile;
