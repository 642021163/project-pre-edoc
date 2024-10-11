import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css';
import { Box, Button, FormControl, InputLabel, MenuItem, Select, TextField, Typography, Grid, FormHelperText, ListItem, ListItemIcon, Tooltip, Collapse, CircularProgress, ListItemText, Divider, Dialog, DialogActions, DialogContent, DialogTitle, Paper } from '@mui/material';
import { AccountCircle, ExitToApp, InsertDriveFile, Description } from '@mui/icons-material';
import MenuIcon from '@mui/icons-material/Menu';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import DescriptionIcon from '@mui/icons-material/Description';
import SendIcon from '@mui/icons-material/Send';
import Swal from 'sweetalert2';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import Drawer from '../AppBar/Drawer';


function FileUpload() {
  // สร้าง state เพื่อเก็บค่าต่างๆ ของฟอร์ม
  const [values, setValues] = useState({
    // upload_date: "",
    subject: "",
    user_id: localStorage.getItem('user_id'),
    to_recipient: "",
    document_type: "",
    file: "null",
    word_file: "",
    notes: "",
  });

  // สร้าง state เพื่อเก็บข้อผิดพลาด
  const [errors, setErrors] = useState({});
  const { id } = useParams();
  const [isFormDirty, setIsFormDirty] = useState(false); // ใช้ในการตรวจสอบว่าฟอร์มถูกเปลี่ยนแปลงหรือไม่
  const [dialogOpen, setDialogOpen] = useState(false); // State สำหรับ Dialog
  const [successMessage, setSuccessMessage] = useState(''); // ข้อความสำเร็จ
  const [user_fname, setUser_fname] = useState('');
  const [user_lname, setUser_lname] = useState('');
  const [fileName, setFileName] = useState(''); // เพิ่มการประกาศ fileName
  const [loading, setLoading] = useState(false);
  const colors = ['#FF5733', '#33FF57', '#3357FF', '#F1C40F', '#8E44AD']; // Array of colors
  const [menuOpen, setMenuOpen] = useState(true); // สถานะสำหรับการซ่อน/แสดงเมนู
  const [imageUrl, setImageUrl] = useState('');
  const [isOtherRecipient, setIsOtherRecipient] = useState(false);
  const [fileType, setFileType] = useState('pdf');

  const token = 't0FBAxsgfRvhtRlYrKNezvKy4SjrJmmtnFk4aaRSk2b'; // ใส่ Token ของคุณที่นี่

  const fetchImage = () => {
    const randomImageUrl = `https://picsum.photos/800/600?random`;
    setImageUrl(randomImageUrl);
  };

  useEffect(() => {
    fetchImage(); // เรียกใช้ฟังก์ชันดึงภาพเริ่มต้น
    const intervalId = setInterval(fetchImage, 3000); // ดึงภาพใหม่ทุก 5 วินาที

    return () => clearInterval(intervalId); // เคลียร์ interval เมื่อ component ถูก unmount
  }, []);


  const handleInput = e => {
    const { name, value } = e.target;
    setValues(prev => ({
      ...prev,
      [name]: value
    }));
    setIsFormDirty(true); // กำหนดให้ฟอร์มมีการเปลี่ยนแปลง

    // เมื่อผู้ใช้กรอกข้อมูลในช่องที่มี error, ลบ error นั้นออก
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };


  const handleFileChange = e => {
    const file = e.target.files[0];
    setValues(prev => ({
      ...prev,
      file
    }));
    setFileName(file.name); // ตั้งค่า fileName เมื่อไฟล์ถูกเลือก
    setIsFormDirty(true); // กำหนดให้ฟอร์มมีการเปลี่ยนแปลง
  };

  // const [wordFileName, setWordFileName] = useState(null); // Track the file name

  // const handleWordFileChange = (event) => {
  //   const file = event.target.files[0];
  //   console.log("File input changed:", event); // log event เมื่อเลือกไฟล์
  //   console.log("File selected:", file); // log ข้อมูลไฟล์ที่เลือก

  //   if (file) {
  //     setWordFileName(file.name); // Update the state with the file name
  //     console.log("File name set to:", file.name); // log ชื่อไฟล์ที่ตั้งค่าใน state
  //   } else {
  //     setWordFileName(null); // Reset if no file is selected
  //     console.log("No file selected."); // log เมื่อไม่มีการเลือกไฟล์
  //   }
  // };



  useEffect(() => {
    const storedUser_fname = localStorage.getItem('user_fname');
    const storedUser_lname = localStorage.getItem('user_lname');

    setUser_fname(storedUser_fname || '');
    setUser_lname(storedUser_lname || '');

    const handleBeforeUnload = (event) => {
      if (isFormDirty) { // ตรวจสอบว่าฟอร์มมีการเปลี่ยนแปลง
        event.preventDefault();
        event.returnValue = 'คุณมีการเปลี่ยนแปลงที่ยังไม่ได้บันทึก คุณต้องการออกจากหน้านี้หรือไม่?';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [isFormDirty]);


  // ฟังก์ชันตรวจสอบข้อมูลว่าครบถ้วนหรือไม่
  const validate = () => {
    let tempErrors = {}; // เก็บข้อผิดพลาดชั่วคราว
    // if (!values.upload_date) tempErrors.upload_date = 'กรุณาเลือกวันที่อัปโหลด'; // ตรวจสอบวันที่อัปโหลด
    if (!values.subject) tempErrors.subject = 'กรุณากรอกเรื่อง'; // ตรวจสอบว่ากรอกเรื่องหรือไม่
    if (!values.to_recipient) tempErrors.to_recipient = 'กรุณากรอกชื่อผู้รับ'; // ตรวจสอบว่ากรอกชื่อผู้รับหรือไม่
    if (!values.document_type) tempErrors.document_type = 'กรุณาเลือกประเภทเอกสาร'; // ตรวจสอบประเภทเอกสาร
    if (!values.file) tempErrors.file = 'กรุณาเลือกไฟล์'; // ตรวจสอบว่ามีการเลือกไฟล์หรือไม่
    if (!values.notes) tempErrors.notes = 'กรุณากรอกหมายเหตุ'; // ตรวจสอบหมายเหตุ

    setErrors(tempErrors); // ตั้งค่า error ใหม่
    return Object.keys(tempErrors).length === 0; // ถ้าไม่มี error ก็จะคืนค่าเป็น true
  };

  const handleSubmit = async e => {
    e.preventDefault();

    if (validate()) {
      try {
        const formData = new FormData();
        // formData.append('upload_date', values.upload_date);
        formData.append('subject', values.subject);
        formData.append('user_id', localStorage.getItem('user_id'));
        formData.append('to_recipient', values.to_recipient);
        formData.append('document_type', values.document_type);
        formData.append('notes', values.notes);
        formData.append('user_fname', user_fname);
        formData.append('user_lname', user_lname);

        if (values.file) {
          console.log("PDF file:", values.file); // Log the PDF file details
          formData.append('file', values.file);
        }

        // เพิ่มการตรวจสอบและแนบไฟล์ Word
        if (values.word_file) {
          console.log("Word file:", values.word_file); // Log the Word file details
          formData.append('word_file', values.word_file); // ฟิลด์สำหรับ Word
        }

        const response = await axios.post('http://localhost:3000/documents', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        console.log("Upload Successfully", response);

        // ส่งการแจ้งเตือน LINE ผ่าน API
        const notificationResponse = await axios.post('http://localhost:3000/send-notification', {
          token: 't0FBAxsgfRvhtRlYrKNezvKy4SjrJmmtnFk4aaRSk2b', // เปลี่ยนเป็น Token ของคุณ
          message: `ถูกส่งโดย ${user_fname} ${user_lname} เรื่อง: ${values.subject}`
        });

        console.log("Notification response:", notificationResponse);

        Swal.fire({
          icon: 'success',
          title: 'สำเร็จ!',
          text: 'อัปโหลดเอกสารสำเร็จ!',
          showConfirmButton: false,
          timer: 1500 // ปิดการแจ้งเตือนอัตโนมัติหลังจาก 1.5 วินาที
        });

        // นำกลับไปหน้า homepage หลังจากการแจ้งเตือน
        setTimeout(() => {
          navigate('/track'); // นำไปหน้า homepage หลังจากการแจ้งเตือน
        }, 1500); // รอให้การแจ้งเตือนแสดงครบ 1.5 วินาทีก่อนเปลี่ยนเส้นทาง


        resetForm();

      } catch (error) {
        console.error("Error during upload", error);

        // แสดง SweetAlert เมื่อมีข้อผิดพลาด
        Swal.fire({
          icon: 'error',
          title: 'เกิดข้อผิดพลาด!',
          text: 'การอัปโหลดเอกสารไม่สำเร็จ!',
        });
      }
    }
  };

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev); // เปลี่ยนสถานะของเมนู
  };




  const resetForm = () => {
    // รีเซ็ตค่าใน state
    setValues({
      // upload_date: "",
      subject: "",
      to_recipient: "",
      document_type: "",
      file: null,
      notes: ""
    });

    const fileInput = document.querySelector('input[type="file"]');
    if (fileInput) {
      fileInput.value = "";
    }
    setFileName("");
  };

  // ฟังก์ชันเพื่อจัดการการนำทาง
  const navigate = useNavigate();
  const location = useLocation();


  return (
    <Box sx={{ display: 'flex' }}>
      <Drawer menuOpen={menuOpen} toggleMenu={toggleMenu} />
      <Grid container spacing={2} sx={{ flex: 1, padding: 2 }}>
        {/* ส่วนที่ 1: เนื้อหาฟอร์ม */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ padding: 3 }}>
            <Typography variant="h4" gutterBottom>
              ส่งเอกสาร
            </Typography>
            <form onSubmit={handleSubmit}>
              {/* ฟิลด์ข้อมูล */}
              <Box sx={{ textAlign: 'left', color: 'gray', opacity: 0.6 }}>

              </Box>
              {/* 
              <TextField
                label="วันที่อัปโหลด"
                type="datetime-local"
                name="upload_date"
                value={values.upload_date}
                onChange={handleInput}
                fullWidth
                error={!!errors.upload_date}
                helperText={errors.upload_date}
                required
                InputLabelProps={{
                  shrink: true, // เพื่อให้ป้าย Label ขยับขึ้นด้านบน
                }}
                inputProps={{
                  max: new Date().toISOString().slice(0, 16), // จำกัดวันที่ไม่เกินวันที่ปัจจุบัน
                }}
                sx={{ marginBottom: 2 }}
              /> */}


              <TextField
                label="เรื่อง"
                name="subject"
                value={values.subject}
                onChange={handleInput}
                fullWidth
                error={!!errors.subject}
                helperText={errors.subject}
                required
                sx={{ marginBottom: 2 }}
              />

              <FormControl fullWidth sx={{ marginBottom: 2 }}>
                <InputLabel>ถึง</InputLabel>
                <Select
                  name="to_recipient"
                  value={values.to_recipient}
                  onChange={(e) => {
                    const value = e.target.value;
                    setValues((prev) => ({
                      ...prev,
                      to_recipient: value, // ตั้งค่า to_recipient จาก dropdown
                    }));
                    // หากเลือก "อื่นๆ" จะให้แสดงช่องกรอกข้อมูล
                    if (value === 'อื่นๆ') {
                      setIsOtherRecipient(true);
                    } else {
                      setIsOtherRecipient(false); // ซ่อนช่องกรอกข้อมูลเมื่อเลือกตัวอื่น
                    }
                  }}
                  displayEmpty
                  error={!!errors.to_recipient}
                >
                  <MenuItem value="คณบดีคณะวิทยาศาสตร์และนวัตกรรมดิจิทัล">
                    คณบดีคณะวิทยาศาสตร์และนวัตกรรมดิจิทัล
                  </MenuItem>
                  <MenuItem value="อื่นๆ">อื่นๆ</MenuItem>
                </Select>
                {errors.to_recipient && <FormHelperText error>{errors.to_recipient}</FormHelperText>}
              </FormControl>

              {/* ถ้าเลือก "อื่นๆ" ให้แสดง TextField สำหรับกรอกผู้รับ */}
              {isOtherRecipient && (
                <TextField
                  label="กรุณาระบุ"
                  name="to_recipient" // ใช้ฟิลด์นี้เก็บค่าที่กรอกเมื่อเลือก "อื่นๆ"
                  // value={values.to_recipient} // ใช้ค่าจากฟิลด์นี้
                  onChange={handleInput}
                  fullWidth
                  sx={{ marginBottom: 2 }}
                  error={!!errors.to_recipient}
                  helperText={errors.to_recipient}
                  placeholder="ระบุชื่อผู้รับ" // ช่องกรอกข้อมูลเป็นค่าว่าง
                />
              )}

              <FormControl fullWidth sx={{ marginBottom: 2 }} error={!!errors.document_type}>
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
                {errors.document_type && <Typography variant="caption" color="error">{errors.document_type}</Typography>}
              </FormControl>

              {/* แถวที่ 5: หมายเหตุ */}
              <Box sx={{ width: '100%', mb: 5 }}>
                <TextField
                  label="หมายเหตุ"
                  name="notes"
                  value={values.notes}
                  onChange={handleInput}
                  fullWidth
                  multiline
                  rows={2}
                  error={!!errors.notes}
                  helperText={errors.notes}
                />

              </Box>
              {/* แถวที่ 6: เลือกไฟล์และปุ่มอัปโหลด */}
              <Box sx={{ width: '100%', mb: 5, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                {/* ช่องสำหรับเลือกไฟล์ */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <input
                    accept=".pdf,.doc,.docx " // อนุญาตให้เลือกเฉพาะไฟล์ PDF
                    id="upload-file"
                    type="file"
                    style={{ display: 'none' }} // ซ่อน input ดั้งเดิม
                    multiple
                    onChange={handleFileChange}
                  />
                  <label htmlFor="upload-file">
                    <Button
                      variant="contained"
                      component="span"
                      startIcon={<PictureAsPdfIcon />}
                      sx={{ mr: 2, width: '150px', height: '50px', fontSize: '16px' }}
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
                        borderRadius: 1,
                      }}
                    >
                      {/* ตรวจสอบประเภทของไฟล์เพื่อเลือกไอคอนที่แสดง */}
                      {fileName.toLowerCase().endsWith('.pdf') ? (
                        <PictureAsPdfIcon sx={{ color: '#d32f2f', mr: 1 }} />
                      ) : fileName.toLowerCase().endsWith('.doc') || fileName.toLowerCase().endsWith('.docx') ? (
                        <InsertDriveFileIcon sx={{ color: '#1976d2', mr: 1 }} />
                      ) : (
                        <InsertDriveFileIcon sx={{ color: '#9e9e9e', mr: 1 }} /> // ใช้ไอคอนทั่วไปหากไม่ใช่ PDF หรือ Word
                      )}

                      <Typography variant="body2" sx={{ color: 'black' }}>
                        ไฟล์ที่เลือก: {fileName}
                      </Typography>
                    </Paper>
                  )}
                </Box>

                {/* ข้อความแจ้งเตือนสำหรับไฟล์ PDF */}
                <Typography variant="caption" color="textSecondary">
                  * ไฟล์ PDF , Word
                </Typography>
              </Box>

{/* 
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 2 }}>
                <input
                  accept=".doc,.docx" // อนุญาตให้เลือกเฉพาะไฟล์ Word
                  id="upload-word-file"
                  type="file"
                  style={{ display: 'none' }} // ซ่อน input ดั้งเดิม
                  onChange={handleWordFileChange}
                />
                <label htmlFor="upload-word-file">
                  <Button
                    variant="contained"
                    component="span"
                    startIcon={<DescriptionIcon />} // ใช้ไอคอนใหม่สำหรับไฟล์ Word
                    sx={{ mr: 2, width: '150px', height: '50px', fontSize: '16px' }}
                  >
                    เลือกไฟล์ Word
                  </Button>
                </label>


                {wordFileName && (
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
                    <DescriptionIcon sx={{ color: '#3f51b5', mr: 1 }} />
                    <Typography variant="body2" sx={{ color: 'black' }}>
                      ไฟล์ที่เลือก: {wordFileName}
                    </Typography>
                  </Paper>
                )}

              </Box> */}

{/* 
              <Typography variant="caption" color="textSecondary">
                * รับแค่ไฟล์ Word (.doc, .docx)
              </Typography> */}

              {/* ปุ่มบันทึกและล้างข้อมูล */}
              <Box sx={{ mb: 5, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
                <Button
                  variant="contained" endIcon={<SendIcon />}
                  onClick={handleSubmit}
                  disabled={!fileName}
                  sx={{ width: '150px', height: '50px', fontSize: '16px' }}
                >
                  บันทึก
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  onClick={resetForm}
                  sx={{ width: '150px', height: '50px', fontSize: '16px' }}
                >
                  ล้างข้อมูล
                </Button>
              </Box>

            </form>
          </Paper>
        </Grid>

        {/* ส่วนที่ 2: เนื้อหาเพิ่มเติม */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ padding: 4, backgroundColor: '#f5f5f5', borderRadius: 2, boxShadow: 3 }}>
            <Typography variant="h4" gutterBottom align="center" sx={{ fontWeight: 'bold' }}>
              ข้อมูลเพิ่มเติมสำหรับผู้ใช้ใหม่
            </Typography>
            <Typography variant="body1" sx={{ lineHeight: 1.8, color: '#555' }}>
              ระบบของเราช่วยให้คุณสามารถจัดการเอกสารได้ง่าย ๆ เพียงทำตามขั้นตอนต่อไปนี้:
            </Typography>
            <Box component="ol" sx={{ pl: 2, mt: 2 }}>
              <Typography component="li" variant="body1" sx={{ mb: 1 }}>
                กรอกข้อมูลในแบบฟอร์มทางซ้ายมือ เช่น ชื่อเอกสารและผู้รับ
              </Typography>
              <Typography component="li" variant="body1" sx={{ mb: 1 }}>
                เลือกประเภทเอกสาร และเพิ่มรายละเอียดในช่องหมายเหตุ (ถ้ามี)
              </Typography>
              <Typography component="li" variant="body1" sx={{ mb: 1 }}>
                คลิกปุ่ม "เลือกไฟล์" เพื่ออัปโหลดเอกสารในรูปแบบ PDF
              </Typography>
              <Typography component="li" variant="body1" sx={{ mb: 1 }}>
                เมื่ออัปโหลดเสร็จแล้ว คุณสามารถติดตามสถานะของเอกสารได้ในหน้าติดตามเอกสาร
              </Typography>
            </Box>
            <Typography variant="body1" sx={{ mt: 2, color: '#555' }}>
              ขอบคุณที่เข้ามาใช้บริการ
            </Typography>
            <Box sx={{ mt: 3 }}>
              {imageUrl && (
                <img
                  src={imageUrl}
                  alt="ข้อมูลเพิ่มเติม"
                  style={{ width: '100%', height: 'auto', borderRadius: '12px', boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)' }}
                />
              )}
            </Box>
          </Paper>
        </Grid>


      </Grid>
    </Box>

  );
}

export default FileUpload;
