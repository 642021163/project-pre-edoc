import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css';
import { Box, Button, FormControl, InputLabel, MenuItem, Select, TextField, Typography, List, ListItem, ListItemIcon, CircularProgress, ListItemText, Divider, Dialog, DialogActions, DialogContent, DialogTitle, Paper } from '@mui/material';
import { AccountCircle, ExitToApp, InsertDriveFile, Description } from '@mui/icons-material';
import MenuIcon from '@mui/icons-material/Menu';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import SendIcon from '@mui/icons-material/Send';
import Swal from 'sweetalert2';
import { useNavigate, useLocation } from 'react-router-dom';


function FileUpload() {
  // สร้าง state เพื่อเก็บค่าต่างๆ ของฟอร์ม
  const [values, setValues] = useState({
    upload_date: "",
    subject: "",
    user_id: localStorage.getItem('user_id'),
    to_recipient: "",
    document_type: "",
    file: null,
    notes: "",
  });

  // สร้าง state เพื่อเก็บข้อผิดพลาด
  const [errors, setErrors] = useState({});
  const [isFormDirty, setIsFormDirty] = useState(false); // ใช้ในการตรวจสอบว่าฟอร์มถูกเปลี่ยนแปลงหรือไม่
  const [dialogOpen, setDialogOpen] = useState(false); // State สำหรับ Dialog
  const [successMessage, setSuccessMessage] = useState(''); // ข้อความสำเร็จ
  const [user_fname, setUser_fname] = useState('');
  const [user_lname, setUser_lname] = useState('');
  const [fileName, setFileName] = useState(''); // เพิ่มการประกาศ fileName
  const [loading, setLoading] = useState(false);

  const token = 't0FBAxsgfRvhtRlYrKNezvKy4SjrJmmtnFk4aaRSk2b'; // ใส่ Token ของคุณที่นี่


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
    if (!values.upload_date) tempErrors.upload_date = 'กรุณาเลือกวันที่อัปโหลด'; // ตรวจสอบวันที่อัปโหลด
    if (!values.subject) tempErrors.subject = 'กรุณากรอกเรื่อง'; // ตรวจสอบว่ากรอกเรื่องหรือไม่
    if (!values.to_recipient) tempErrors.to_recipient = 'กรุณากรอกชื่อผู้รับ'; // ตรวจสอบว่ากรอกชื่อผู้รับหรือไม่
    if (!values.document_type) tempErrors.document_type = 'กรุณาเลือกประเภทเอกสาร'; // ตรวจสอบประเภทเอกสาร
    if (!values.file) tempErrors.file = 'กรุณาเลือกไฟล์'; // ตรวจสอบว่ามีการเลือกไฟล์หรือไม่
    if (!values.notes) tempErrors.notes = 'กรุณากรอกหมายเหตุ'; // ตรวจสอบหมายเหตุ

    setErrors(tempErrors); // ตั้งค่า error ใหม่
    return Object.keys(tempErrors).length === 0; // ถ้าไม่มี error ก็จะคืนค่าเป็น true
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };


  const handleSubmit = async e => {
    e.preventDefault();

    if (validate()) {
      try {
        const formData = new FormData();
        formData.append('upload_date', values.upload_date);
        formData.append('subject', values.subject);
        formData.append('user_id', localStorage.getItem('user_id'));
        formData.append('to_recipient', values.to_recipient);
        formData.append('document_type', values.document_type);
        formData.append('notes', values.notes);
        formData.append('user_fname', user_fname);
        formData.append('user_lname', user_lname);

        if (values.file) {
          formData.append('file', values.file);
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
        });

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


  const resetForm = () => {
    // รีเซ็ตค่าใน state
    setValues({
      upload_date: "",
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

  // รายการเมนูใน Sidebar
  const menuItems = [
    { text: 'ติดตามเอกสาร', link: '/track', icon: <InsertDriveFile /> },
    { text: 'ส่งเอกสาร', link: '/fileupload', icon: <Description /> },
    { text: 'ข้อมูลผู้ใช้', link: `/profile/`, icon: <AccountCircle /> },
  ];
  const handleMenuClick = (link) => {
    setLoading(true);
    setTimeout(() => {
      navigate(link);
      setLoading(false);
    }, 400); // หน่วงเวลา 400ms
  };
  return (
    <Box sx={{ flexGrow: 1, height: '100vh', display: 'flex' }}>

      {/* ส่วนหลักของ Menu ฝั่งซ้าย */}
      <Box sx={{ width: 250, bgcolor: '#ffffff', p: 2, boxShadow: 2 }}>
        <Typography variant="h6" gutterBottom>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: '#f4f4f4', // สีพื้นหลัง
              padding: '8px 16px', // กำหนด padding
              borderRadius: '4px', // มุมมน
            }}
          >
            <MenuIcon sx={{ marginRight: '8px', color: '#1976d2' }} /> {/* ไอคอนและสีของไอคอน */}
            Menu
          </Box>
        </Typography>
        <List>
          {menuItems.map((item) => (
            <ListItem
              component="div" // ใช้ component เป็น div เพื่อให้สามารถควบคุม onClick ได้
              key={item.text}
              onClick={() => handleMenuClick(item.link)} // เรียกฟังก์ชันเมื่อคลิก
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
      </Box>

      <Box sx={{ flex: 1, p: 2, maxWidth: 800, mx: 'auto', bgcolor: '#f9f9f9', borderRadius: 2, boxShadow: 3 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 2 }}>

          <Typography variant="h4" gutterBottom>
            ส่งเอกสาร
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            {/* กรอบพื้นหลังสำหรับชื่อผู้ส่งเอกสาร */}
            <Box
              sx={{
                bgcolor: '#e3f2fd',
                p: 2,
                borderRadius: 1,
                border: '1px solid #bbdefb',
                boxShadow: 1,
                textAlign: 'center',
                flexShrink: 0, // Prevent shrinking
                width: 'auto', // Adjust width to content
              }}
            >
              <Typography variant="h6" gutterBottom>
                สวัสดีคุณ,  {user_fname} {user_lname}
              </Typography>
            </Box>

            {/* แถวที่ 1: วันที่อัปโหลด */}
            <Box sx={{ flexGrow: 1 }}>
              <TextField
                type="datetime-local"
                name="upload_date"
                value={values.upload_date}
                onChange={handleInput}
                sx={{ width: 250 }}
                error={!!errors.upload_date}
                helperText={errors.upload_date}
              />
            </Box>
          </Box>

          {/* แถวที่ 2: เรื่อง*/}
          <Box sx={{ width: '100%', mb: 5, display: 'flex', gap: 2, justifyContent: 'center' }}>
            <TextField
              label="เรื่อง"
              name="subject"
              value={values.subject}
              onChange={handleInput}
              sx={{ width: 530 }}
              error={!!errors.subject}
              helperText={errors.subject}
            />
          </Box>

          {/* แถวที่ 3:  ถึง, ประเภทเอกสาร */}
          <Box sx={{ width: '100%', mb: 5, display: 'flex', gap: 2, justifyContent: 'center' }}>
            <TextField
              label="ถึง"
              name="to_recipient"
              value={values.to_recipient}
              onChange={handleInput}
              sx={{ width: 270 }}
              error={!!errors.to_recipient}
              helperText={errors.to_recipient}
            />
            <FormControl sx={{ width: 250 }} error={!!errors.document_type}>
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
          </Box>

          {/* แถวที่ 5: หมายเหตุ */}
          <Box sx={{ width: '100%' }}>
            <TextField
              label="หมายเหตุ"
              name="notes"
              value={values.notes}
              onChange={handleInput}
              sx={{ width: 550 }}
              multiline
              rows={4}
              error={!!errors.notes}
              helperText={errors.notes}
            />
          </Box>
        </Box>

        {/* แถวที่ 4: เลือกไฟล์และปุ่มอัปโหลด */}
        <Box sx={{ width: '100%', mb: 5, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
          {/* ช่องสำหรับเลือกไฟล์ */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
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
                <PictureAsPdfIcon sx={{ color: '#d32f2f', mr: 1 }} /> {/* แสดงไอคอน PDF ด้านหน้า */}
                <Typography variant="body2" sx={{ color: 'black' }}>
                  ไฟล์ที่เลือก: {fileName}
                </Typography>
              </Paper>
            )}
          </Box>
        </Box>
        <Box sx={{ mb: 5, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
          {/* ปุ่มอัปโหลด */}
          <Button
            variant="contained" endIcon={<SendIcon />}
            onClick={handleSubmit}
            disabled={!fileName} // ป้องกันการคลิกถ้าไม่มีไฟล์ที่เลือก
            sx={{ width: '150px', height: '50px', fontSize: '16px' }}
          >
            บันทึก
          </Button>
        </Box>
      </Box>
    </Box>
  );
}

export default FileUpload;

