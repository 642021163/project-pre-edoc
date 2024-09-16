// import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';

// const Layout = ({ children }) => {
//   const [username, setUsername] = useState(null);
//   const [userId, setUserId] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const storedUsername = localStorage.getItem('username');
//         const storedUserId = localStorage.getItem('userId');
//         if (!storedUsername) {
//           navigate('/loginpage');
//         } else {
//           setUsername(storedUsername);
//           setUserId(storedUserId);
//         }

//         await Promise.all([
//           fetchUserCount(),
//           fetchDocumentCount()
//         ]);
//       } catch (error) {
//         console.error('Error fetching data:', error);
//         setError('Error fetching data');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [navigate]);

//   if (loading) return <div>Loading...</div>;
//   if (error) return <div>{error}</div>;

//   return (
//     <div>
//       {/* ส่วนนี้คือ Layout ของแอปที่ใช้ร่วมกันทุกหน้า */}
//       {children}
//     </div>
//   );
// };

// export default Layout;
