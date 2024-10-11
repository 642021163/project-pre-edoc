import React, { useEffect, useState } from 'react';
import {
  Box, CssBaseline, Typography, Paper, Button, Grid, TextField, FormControl,
  InputLabel, Select, MenuItem, DialogActions,
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { format, parseISO } from 'date-fns';
import Layout from '../LayoutAdmin/Layout';
import Swal from 'sweetalert2';


function EditDocuments() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [document, setDocument] = useState({
    upload_date: '',
    user_id: localStorage.getItem('user_id'),
    subject: '',
    to_recipient: '',
    document_number: '',
    document_type: '',
    status: '',
    recipient: '',
    notes: ''
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [recipients, setRecipients] = useState([]);
  const [documentId, setDocumentId] = useState('');
  const [adminId, setAdminId] = useState('');
  const [dateReceived, setDateReceived] = useState('');
  const [paperCost, setPaperCost] = useState('');
  const [isReceived, setIsReceived] = useState(false);
  const [docId, setDocId] = useState(id);
  const [activeTab, setActiveTab] = useState('all'); // ตัวอย่างการใช้ useState
  const [allDocuments, setAllDocuments] = useState([]); // ค่าพื้นฐาน
  const [unreadDocuments, setUnreadDocuments] = useState([]);
  const [documents, setDocuments] = useState([]);

  const [pdfPages, setPdfPages] = useState(''); // สถานะสำหรับเก็บจำนวนหน้าของ PDF
  const [savings, setSavings] = useState(null); // สถานะสำหรับเก็บผลลัพธ์การประหยัดกระดาษ
  const combinedNotes = `${document.notes || 'ไม่มีหมายเหตุจากผู้ใช้'}\n\nตอบกลับจากแอดมิน: ${document.admin_reply || 'ไม่มีการตอบกลับ'}`;



  const statusOptions = [
    { value: 0, label: 'รอดำเนินการ' },
    { value: 1, label: 'กำลังดำเนินการ' },
    { value: 2, label: 'ดำเนินการเรียบร้อย' }
  ];
  const document_typeOptions = ([
    { value: 'เอกสารภายใน', label: 'เอกสารภายใน' },
    { value: 'เอกสารภายนอก', label: 'เอกสารภายนอก' },
    { value: 'เอกสารสำคัญ', label: 'เอกสารสำคัญ' }
  ]);


  // ฟังก์ชันสำหรับการเพิ่ม event beforeunload เพื่อเตือนก่อนออกจากหน้า
  const addNavigationWarning = () => {
    window.addEventListener('beforeunload', handleBeforeUnload);
  };

  // ฟังก์ชันสำหรับการลบ event beforeunload
  const removeNavigationWarning = () => {
    window.removeEventListener('beforeunload', handleBeforeUnload);
  };

  // ฟังก์ชันจัดการการแจ้งเตือนเมื่อออกจากหน้า
  const handleBeforeUnload = (e) => {
    const confirmationMessage = 'คุณยังไม่ได้บันทึกการเปลี่ยนแปลง หากคุณออกจากหน้านี้ ข้อมูลที่คุณทำจะสูญหาย';
    e.returnValue = confirmationMessage; // สำหรับเบราว์เซอร์เก่า
    return confirmationMessage;
  };

  useEffect(() => {
    // เพิ่ม event `beforeunload` เมื่อเริ่มแก้ไขเอกสาร
    addNavigationWarning();

    return () => {
      // ลบ event `beforeunload` เมื่อออกจากหน้า
      removeNavigationWarning();
    };
  }, []);

  const handleStatusChange = async (docId) => {
    try {
      await axios.put(`http://localhost:3000/document/${docId}/status`, { status: document.status });

      // ลบการแจ้งเตือนเมื่อเปลี่ยนสถานะเอกสารสำเร็จ
      removeNavigationWarning();

      Swal.fire({
        icon: 'success',
        title: 'สถานะเอกสารถูกอัปเดต',
        text: 'สถานะของเอกสารได้รับการเปลี่ยนเรียบร้อยแล้ว'
      });

    } catch (error) {
      console.error('Error updating document status:', error);
    }
  };

  // ดึงข้อมูลผู้ใช้จากเซิร์ฟเวอร์
  useEffect(() => {
    const fetchDocument = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/document/${id}`);
        setDocument(response.data);
      } catch (error) {
        console.error('เกิดข้อผิดพลาดในการดึงข้อมูลเอกสาร:', error.response?.data || error.message);
        setError('เกิดข้อผิดพลาดในการดึงข้อมูลเอกสาร');
      } finally {
        setLoading(false);
      }
    };
    const fetchAdmins = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/admins');
        setRecipients(response.data);
      } catch (error) {
        console.error('Error fetching admins:', error);
      }
    };

    fetchAdmins();
    fetchDocument();
  }, [id]);


  if (loading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>{error}</div>;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDocument(prev => ({
      ...prev,
      [name]: value
    }));
    // เช็คว่าถ้าเป็นการเปลี่ยนแปลงสถานะให้เรียก handleStatusChange
    if (name === 'status') {
      handleStatusChange(id); // เรียกใช้ handleStatusChange
    }
  };


  // จัดการการส่งฟอร์ม
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // รวมข้อความจากหมายเหตุของผู้ใช้กับการตอบกลับของแอดมิน
      const combinedNotes = `${document.notes || 'ไม่มีหมายเหตุจากผู้ใช้'}\n\nตอบกลับจากแอดมิน: ${document.admin_reply || 'ไม่มีการตอบกลับ'}`;

      // สร้างข้อมูลเอกสารใหม่พร้อมรวมหมายเหตุทั้งสองส่วน
      const updatedDocument = {
        ...document,
        notes: combinedNotes, // บันทึกหมายเหตุรวมทั้งสองส่วนในฟิลด์ notes
      };

      // อัปเดตข้อมูลในฐานข้อมูลผ่าน API
      await axios.put(`http://localhost:3000/documents/${id}`, updatedDocument);
      console.log('Document updated successfully.');

      removeNavigationWarning(); // ลบการแจ้งเตือนเมื่อบันทึกข้อมูลสำเร็จ

      // แจ้งเตือนเมื่อบันทึกสำเร็จด้วย SweetAlert2
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'บันทึกข้อมูลเรียบร้อยแล้ว',
        showConfirmButton: false,
        timer: 1500 // ปิดการแจ้งเตือนอัตโนมัติหลังจาก 1.5 วินาที
      });

      setTimeout(() => {
        navigate('/doc');
      }, 1500);

    } catch (error) {
      console.error('เกิดข้อผิดพลาดในการอัปเดตเอกสาร:', error.response?.data || error.message);

      // แจ้งเตือนเมื่อเกิดข้อผิดพลาดด้วย SweetAlert2
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'เกิดข้อผิดพลาดในการอัปเดตเอกสาร',
      });
    }
  };


  const handleDocumentReceive = async (docId) => {
    try {
      // อัปเดตสถานะเอกสารเป็น 'กำลังดำเนินการ'
      const updateStatusResponse = await axios.put(`http://localhost:3000/document/${docId}/status`, {
        received_by: adminId
      });
      console.log('Update status response:', updateStatusResponse.data);

      // บันทึกข้อมูลการรับเอกสารพร้อมค่าประหยัด
      const receiptResponse = await axios.post('http://localhost:3000/document-stats', {
        documentId: docId,
        adminId: adminId,
        dateReceived: new Date().toISOString().split('T')[0],
        paperCost: savings // ใช้ค่าการประหยัดที่คำนวณได้
      });
      console.log('Receipt response:', receiptResponse.data);

    } catch (error) {
      console.error('Error handling document receive:', error);
    }
  };


  const handleReceiveButtonClick = (docId) => {
    console.log('Document ID clicked:', docId);

    // ตรวจสอบสถานะเอกสารก่อนการเรียกใช้งาน
    const document = documents.find(doc => doc.document_id === docId);

    if (document && document.status !== 1) {
      console.log('Document status is not 1, proceeding with receive...');
      handleDocumentReceive(docId);
    } else {
      console.log('Document status is 1 or document not found, skipping receive.');
    }
  };

  // const handleSavePaperCost = async () => {
  //   try {
  //     await axios.post('http://localhost:3000/document-stats', {
  //       paperCost: savings // ค่าการประหยัดกระดาษที่คำนวณได้
  //     });
  //     Swal.fire({
  //       icon: 'success',
  //       title: 'บันทึกสำเร็จ',
  //       text: 'ค่าประหยัดกระดาษถูกบันทึกเรียบร้อยแล้ว'
  //     });
  //   } catch (error) {
  //     console.error('Error saving paper cost:', error);
  //     Swal.fire({
  //       icon: 'error',
  //       title: 'เกิดข้อผิดพลาด',
  //       text: 'ไม่สามารถบันทึกค่าประหยัดกระดาษได้'
  //     });
  //   }
  // };
  // ฟังก์ชันสำหรับคำนวณและบันทึกค่าประหยัดกระดาษ
  const calculateSavings = async () => {
    // ตรวจสอบจำนวนหน้าของ PDF ก่อนคำนวณ
    if (pdfPages > 0) {
      // สมมุติว่าคุณมีอัตราการประหยัดกระดาษต่อหน้ากระดาษ
      const savingsPerPage = 0.9; // ตัวอย่าง: ประหยัด 0.5 บาทต่อหน้า
      const calculatedSavings = pdfPages * savingsPerPage;
      const documentId = document.document_id; // ตรวจสอบว่าคุณดึง id มาอย่างถูกต้อง

      // ตั้งค่าการประหยัด
      setSavings(calculatedSavings);

      // ดึง user_id จาก localStorage
      const userId = localStorage.getItem('user_id'); // แทนที่ 'user_id' ด้วยคีย์ที่คุณใช้จัดเก็บใน localStorage

      // Log สำหรับตรวจสอบค่าที่ได้
      console.log('PDF Pages:', pdfPages);
      console.log('Savings per Page:', savingsPerPage);
      console.log('Calculated Savings:', calculatedSavings);
      console.log('User ID from localStorage:', userId);

      if (!userId) {
        console.error('User ID not found in localStorage.');
        return;
      }

      try {
        // Log ค่าที่จะส่งไปยัง backend
        console.log('Sending data to backend:', {
          document_id: document.document_id,
          user_id: userId,
          paper_cost: calculatedSavings,
        });

        // ส่งข้อมูลไปยังฐานข้อมูล
        const response = await axios.post('http://localhost:3000/api/document_receipts', {
          document_id: document.document_id, // รหัสเอกสารที่ต้องการบันทึก
          user_id: userId, // รหัสแอดมินที่เกี่ยวข้องจาก localStorage
          paper_cost: calculatedSavings, // ค่าการประหยัดที่คำนวณได้
        });

        console.log('Savings recorded:', response.data);
        // แสดงข้อความสำเร็จหรือตั้งค่า state อื่นๆ ตามต้องการ
      } catch (error) {
        console.error('Error saving savings to database:', error);
      }
    } else {
      console.error('Please enter a valid number of PDF pages.');
    }
  };




  const handleCancel = () => {
    navigate('/doc');
  };

  return (
    <Layout>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <Box component="main" sx={{ flexGrow: 1, p: 1 }}>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', textAlign: 'left', color: '#1976d2' }}>แก้ไขเอกสาร</Typography>
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
                      label="ผู้ส่ง"
                      name="user_fullname"
                      value={`${document.user_fname} ${document.user_lname}`}  // รวมทั้งชื่อและนามสกุล
                      onChange={handleChange}
                      fullWidth
                      required
                      InputProps={{
                        readOnly: true,  // ให้ไม่สามารถแก้ไขได้
                      }}
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
                      InputProps={{
                        readOnly: true,  // ให้ไม่สามารถแก้ไขได้
                      }}
                    />
                  </Grid>

                  {/* Row 3 */}
                  <Grid item xs={12} md={6}>
                    <TextField
                      label="เรื่อง"
                      name="subject"
                      value={document.subject}
                      onChange={handleChange}
                      fullWidth
                      required
                      InputProps={{
                        readOnly: true,  // ให้ไม่สามารถแก้ไขได้
                      }}
                    />
                  </Grid>

                  {/* Row 4 */}
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth>
                      <InputLabel>ผู้รับเอกสาร</InputLabel>
                      <Select
                        label="Recipient"
                        name="recipient"
                        value={document.recipient || ''}
                        onChange={handleChange}
                        required
                        disabled={!!document.recipient}
                      >
                        {recipients.length > 0 ? (
                          recipients.map(admin => (
                            <MenuItem key={admin.user_id} value={admin.user_id}>
                              {admin.user_fname} {admin.user_lname}
                            </MenuItem>
                          ))
                        ) : (
                          <MenuItem value="">No Recipients Available</MenuItem>
                        )}
                      </Select>
                    </FormControl>
                  </Grid>


                  {/* Row 5*/}
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth>
                      <InputLabel>ประเภทเอกสาร</InputLabel>
                      <Select
                        label="Document Type"
                        name="document_type"
                        value={document.document_type}
                        onChange={handleChange}
                        required
                        
                      >
                        {document_typeOptions.map(option => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  {/* Row 6 */}
                  <Grid item xs={12} md={6}>
                    <TextField
                      label="เลขที่เอกสาร"
                      name="document_number"
                      value={document.document_number}
                      onChange={handleChange}
                      fullWidth
                      required
                    />
                  </Grid>


                  {/* Row 7 */}
                  {/* ช่องสำหรับหมายเหตุจากผู้ใช้ (read-only) */}
                  <Grid item xs={12} md={6}>
                    <TextField
                      label="หมายเหตุจากผู้ใช้"
                      name="user_notes"
                      value={document.notes}
                      fullWidth
                      multiline
                      rows={4}
                      InputProps={{
                        readOnly: true, // เพื่อไม่ให้แอดมินแก้ไขข้อความจากผู้ใช้ได้
                      }}
                    />
                  </Grid>

                  {/* ช่องสำหรับการตอบกลับของแอดมิน */}
                  {/* <Grid item xs={12} md={6}>
                    <TextField
                      label="ตอบกลับจากแอดมิน"
                      name="admin_reply"
                      value={document.admin_reply || ''} // ใช้ state ในการจัดการค่าการตอบกลับ
                      onChange={handleChange}
                      fullWidth
                      multiline
                      rows={4}
                    />
                  </Grid> */}


                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth>
                      <InputLabel>สถานะ</InputLabel>
                      <Select
                        label="Status"
                        name="status"
                        value={document.status}
                        onChange={handleChange}
                        required
                      >
                        {statusOptions.map(option => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>

                  {/* เงื่อนไขในการแสดง TextField และ Button */}
                  {document.status === 2 && (
                    <Grid item xs={12} md={6}>
                      <TextField
                        label="จำนวนหน้าของ PDF"
                        type="number"
                        value={pdfPages}
                        onChange={(e) => setPdfPages(e.target.value)}
                        fullWidth
                      />
                      <Box sx={{ p: 1 }}>
                        <Button variant="contained" color="primary" onClick={calculateSavings}>
                          คำนวณการประหยัด
                        </Button>
                        {savings > 0 && (
                          <Typography variant="subtitle1" sx={{ mt: 2 }}>
                            ประหยัดค่ากระดาษ: {savings} บาท
                          </Typography>
                        )}
                        {/* <Button variant="contained" color="secondary" onClick={handleSavePaperCost}>
                          บันทึกค่าประหยัดกระดาษ
                        </Button> */}
                      </Box>
                    </Grid>
                  )}

                  {/* <Button
                    variant="contained"
                    color={isReceived ? "success" : "primary"}
                    // onClick={() => handleReceiveDocument(docId)}
                    disabled={isReceived}
                  >
                    {isReceived ? 'เอกสารได้รับการบันทึกแล้ว' : 'รับเอกสาร'}
                  </Button> */}
                  {/* 
                  <Box>
                    {console.log(documents, 'documents')} 
                    {documents.map((doc) => {
                      const isDocReceived = doc.isReceived || false; 
                      return (
                        <Button
                          key={doc.document_id}
                          variant="contained"
                          color={isDocReceived ? "success" : "primary"}
                          onClick={() => handleReceiveButtonClick(doc.document_id)}
                          disabled={isDocReceived}
                        >
                          {isDocReceived ? 'เอกสารได้รับการบันทึกแล้ว' : 'รับเอกสาร'}
                        </Button>
                      );
                    })}
                  </Box> */}

                </Grid>
              </Box>
              <DialogActions style={{ justifyContent: 'center' }}>
                <Button
                  type="submit"
                  color="primary"
                  variant="contained"
                  style={{ marginRight: '8px' }} // เพิ่มระยะห่างขวาเล็กน้อย
                >
                  บันทึก
                </Button>
                <Button
                  color="error"
                  variant="outlined"
                  onClick={handleCancel}
                >
                  ยกเลิก
                </Button>
              </DialogActions>
            </form>
          </Paper>
        </Box>
      </Box>
    </Layout>
  );
}

export default EditDocuments;
