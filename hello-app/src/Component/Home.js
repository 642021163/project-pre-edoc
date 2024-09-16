import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { useNavigate } from 'react-router-dom';
import '../App.css';

function Home() {
  const [userData, setUserData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:3000/documents')
      .then(response => {
        setUserData(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching user data:', error);
        setError('Error fetching data');
        setLoading(false);
      });
  }, []);

  const navigate = useNavigate();

  const handleEdit = (document) => {
    setSelectedDocument(document);
    setEditMode(true);
    navigate(`/edit/${document.id}`);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSelectedDocument(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log('Sending data to server:', selectedDocument); // ตรวจสอบข้อมูลที่ส่งไป
      await axios.put(`http://localhost:3000/documents/${selectedDocument.id}`, selectedDocument);
      setEditMode(false);
      const response = await axios.get('http://localhost:3000/documents');
      setUserData(response.data);
    } catch (error) {
      console.error('Error updating document:', error);
      setError('Error updating document');
    }
  };

  const handleDelete = async (documentId) => {
    try {
      // ส่งคำขอลบไปยังเซิร์ฟเวอร์
      await axios.delete(`http://localhost:3000/documents/${documentId}`);

      // รีเฟรชข้อมูลหลังจากลบสำเร็จ
      const response = await axios.get('http://localhost:3000/documents');
      setUserData(response.data);
    } catch (error) {
      console.error('Error deleting document:', error);
      setError('Error deleting document');
    }
  };

  if (loading) {
    return <div className='loading'>Loading...</div>;
  }

  if (error) {
    return <div className='error'>{error}</div>;
  }

  return (
    <div className='css-upload'>

        <h2>Document Information</h2>
        <Container className='home-container'>
        <Row>
          <Col>
            <table className='user-table'>
              <thead>
                <tr>
                  <th>ชื่อ</th>
                  <th>เรื่อง</th>
                  <th>จาก</th>
                  <th>ถึง</th>
                  <th>ไฟล์</th>
                  <th>หมายเหตุ</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {userData.map(user => (
                  <tr key={user.id}>
                    <td>{user.full_name}</td>
                    <td>{user.subject}</td>
                    <td>{user.from_sender}</td>
                    <td>{user.to_recipient}</td>
                    <td>
                      {user.file_url ? (
                        <a href={`http://localhost:3000/uploads/${user.file_url}`} download>
                          View File
                        </a>
                      ) : 'No File'}
                    </td>
                    <td>{user.notes}</td>
                    <td>
                      <button className='edit-button' onClick={() => handleEdit(user)}>Edit</button>
                      <button className='delete-button' onClick={() => handleDelete(user.id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Col>
        </Row>

        
      </Container>
    </div>
  );
}

export default Home;
