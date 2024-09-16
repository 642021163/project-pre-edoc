import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function EditDocument() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [document, setDocument] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDocument = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/documents/${id}`);
        setDocument(response.data);
      } catch (error) {
        console.error('Error fetching document:', error);
        setError('Error fetching document');
      } finally {
        setLoading(false);
      }
    };

    fetchDocument();
  }, [id]);

  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setDocument(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:3000/documents/${id}`, document);
      navigate('/home');
    } catch (error) {
      console.error('Error updating document:', error);
      setError('Error updating document');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="container">
      <h3>Edit Document</h3>
      <form onSubmit={handleSubmit}>
        <div>
          <label>ชื่อ:</label>
          <input
            type='text'
            name='full_name'
            value={document?.full_name || ''}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>เรื่อง:</label>
          <input
            type='text'
            name='subject'
            value={document?.subject || ''}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>จาก:</label>
          <input
            type='text'
            name='from_sender'
            value={document?.from_sender || ''}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>ถึง:</label>
          <input
            type='text'
            name='to_recipient'
            value={document?.to_recipient || ''}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>หมายเหตุ:</label>
          <textarea
            name='notes'
            value={document?.notes || ''}
            onChange={handleChange}
          />
        </div>
        <div className='form-actions'>
                <button type="submit" className='submit-button'>Submit</button>
                <button type="button" className='cancel-button'onClick={() => navigate('/home')}>Cancel</button>
              </div>
      </form>
    </div>
  );
}

export default EditDocument;


