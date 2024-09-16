import React, { useState, useEffect } from 'react';
import { Box, Button, FormControl, InputLabel, MenuItem, Select, TextField, Typography, List, ListItem, ListItemIcon, ListItemText, Divider, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css';
import CheckCircleIcon from '@mui/icons-material/CheckCircle'; // ไอคอนสำเร็จ
import { AccountCircle, ExitToApp, InsertDriveFile, Description } from '@mui/icons-material';
import MenuIcon from '@mui/icons-material/Menu';
import { useNavigate, useLocation } from 'react-router-dom';

function FileUpload() {
  // สร้าง state เพื่อเก็บค่าต่างๆ ของฟอร์ม
  const [values, setValues] = useState({
    upload_date: "",
    subject: "",
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
    const { name } = e.target;
    setValues(prev => ({
      ...prev,
      file: e.target.files[0]
    }));
    setIsFormDirty(true); // กำหนดให้ฟอร์มมีการเปลี่ยนแปลง

    // ลบ error เมื่อผู้ใช้เลือกไฟล์แล้ว
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  useEffect(() => {
    const storedUser_fname = localStorage.getItem('user_fname');
    const storedUser_lname = localStorage.getItem('user_lname');

    console.log('Stored user_fname:', storedUser_fname); // ตรวจสอบค่า
    console.log('Stored user_lname:', storedUser_lname); // ตรวจสอบค่า

    setUser_fname(storedUser_fname || '');
    setUser_lname(storedUser_lname || '');
    console.log(storedUser_fname, "Not null");

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
  // ฟังก์ชันเมื่อผู้ใช้กดส่งฟอร์ม
  const handleSubmit = async e => {
    e.preventDefault();

    if (validate()) {
      try {
        console.log('Submitting form...');
        const formData = new FormData();
        formData.append('upload_date', values.upload_date);
        formData.append('subject', values.subject);
        formData.append('to_recipient', values.to_recipient);
        formData.append('document_type', values.document_type);
        formData.append('notes', values.notes);
        formData.append('user_fname', user_fname); // เพิ่มชื่อ
        formData.append('user_lname', user_lname); // เพิ่มนามสกุล
        console.log(user_fname, user_lname)
        if (values.file) {
          formData.append('file', values.file);
        }

        const response = await axios.post('http://localhost:3000/documents', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
       

        console.log('Upload successful', response);
      } catch (error) {
        console.error("Error during upload", error);
      }
       // ตั้งข้อความสำเร็จและเปิด Dialog
       setSuccessMessage('อัปโหลดเอกสารสำเร็จ');
       setDialogOpen(true);
       resetForm();
    }
  };



  // ฟังก์ชันสำหรับรีเซ็ตฟอร์ม
  const resetForm = () => {
    setValues({
      upload_date: "",
      subject: "",
      to_recipient: "",
      document_type: "",
      file: null, // ทำให้แน่ใจว่าไฟล์ถูกรีเซ็ต
      notes: ""
    });
    // รีเซ็ตค่าใน <input type="file"> ด้วย
    const fileInput = document.querySelector('input[type="file"]');
    if (fileInput) {
      fileInput.value = ""; // ทำให้ค่าใน <input type="file"> เป็นค่าว่าง
    }
  };



  // ฟังก์ชันเพื่อจัดการการนำทาง
  const navigate = useNavigate();
  const location = useLocation();

  // ฟังก์ชันสำหรับการออกจากระบบ
  const handleLogout = () => {
    const confirmLogout = window.confirm("คุณแน่ใจว่าต้องการออกจากระบบไหม?");
    if (confirmLogout) {
      localStorage.removeItem('username');
      navigate('/loginpage');
    }
  };

  // รายการเมนูใน Sidebar
  const menuItems = [
    { text: 'ติดตามเอกสาร', link: '/track', icon: <InsertDriveFile /> },
    { text: 'ส่งเอกสาร', link: '/fileupload', icon: <Description /> },
    { text: 'ข้อมูลผู้ใช้', link: `/profile/`, icon: <AccountCircle /> },
  ];

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
          <ListItem
            onClick={handleLogout}
            sx={{
              borderRadius: '4px',
              backgroundColor: '#f44336', // สีพื้นหลังที่โดดเด่น
              color: '#fff',
              fontWeight: 'bold',
              '&:hover': {
                backgroundColor: '#d32f2f', // สีพื้นหลังเมื่อ hover
              },
              '&:active': {
                backgroundColor: '#b71c1c', // สีพื้นหลังเมื่อคลิก
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

      <Box sx={{ flex: 1, p: 2, maxWidth: 800, mx: 'auto', bgcolor: '#f9f9f9', borderRadius: 2, boxShadow: 3 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 2 }}>

          <Typography variant="h4" gutterBottom>
            ส่งเอกสาร
          </Typography>

          {/* กรอบพื้นหลังสำหรับชื่อผู้ส่งเอกสาร */}
          <Box
            sx={{
              bgcolor: '#e3f2fd',
              p: 2,
              borderRadius: 1,
              mb: 3,
              border: '1px solid #bbdefb',
              boxShadow: 1,
              textAlign: 'center'
            }}
          >
            <Typography variant="h7" gutterBottom>
              {user_fname} {user_lname}
            </Typography>
          </Box>



          {/* แถวที่ 1: วันที่อัปโหลด */}
          <Box sx={{ width: '100%', mb: 2 }}>
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

          {/* แถวที่ 4: เลือกไฟล์และปุ่มอัปโหลด */}
          <Box sx={{ width: '100%', mb: 5, display: 'flex', justifyContent: 'center', gap: 2 }}>
            <TextField
              type="file"
              onChange={handleFileChange}
              sx={{ width: '380px' }}
              InputLabelProps={{ shrink: true }}
              error={!!errors.file}
              helperText={errors.file}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              disabled={!values.file}
              sx={{ width: '150px', height: '50px', fontSize: '16px' }}
            >
              Upload
            </Button>
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
      </Box>
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

export default FileUpload;

