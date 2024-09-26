// src/App.js
import React from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import Upload from './Component/Upload';
import UserCreate from './Component/UserCreate';
import UserUpdate from './Component/UserUpdate';
import File from './Component/File';
import Navbar from './AppBar/Navbar';
import Appbar from './AppBar/Appbar';
import './App.css';
import AdminLogin from './LoginFrom/AdminLogin';
import UserLogin from './LoginFrom/UserLogin';
import LoginPage from './LoginFrom/LoginPage';
import HomePage from './LoginFrom/HomePage';
import RegisterFrom from './LoginFrom/RegisterFrom';
import FileUpload from './LoginFrom/FileUpload';
import TrackDocuments from './LoginFrom/TrackDocuments';
import UserProfile from './LoginFrom/UserProfile';
import AdminHome from './Admin/AdminHome';
import Documents from './Admin/Documents';
import UserAccounts from './Admin/UserAccounts';
import UserList from './Admin/UserList';
import EditDocuments from './Admin/EditDocuments';
import ReceiptsList from './Admin/ReceiptsList';
import AddUser from './Admin/AddUser';
import EditUser from './Admin/EditUser';
import Addfile from './Admin/AddFile';
import EditDocument from './LoginFrom/EditDocument';
import UnreadDocuments from './Admin/UnreadDocuments';


function App() {
  return (
    <div className='App'>
      <AppContent />
    </div>
  );
}

function AppContent() {
  const location = useLocation();

  // ตรวจสอบว่าเป็นหน้า AdminHome หรือหน้าที่เกี่ยวข้องกับ AdminHome หรือไม่
  const isAdminHome = location.pathname.startsWith('/home') ||
                      location.pathname.startsWith('/doc') ||
                      location.pathname.startsWith('/edit') ||
                      location.pathname.startsWith('/list') ||
                      location.pathname.startsWith('/ac') ||
                      location.pathname.startsWith('/re') ||
                      location.pathname.startsWith('/newuser') ||
                      location.pathname.startsWith('/editu') ||
                      location.pathname.startsWith('/addfile') ||
                      location.pathname.startsWith('/unread') ;

  return (
    <>
      {!isAdminHome && (
        <>
          <Appbar />
          <Navbar />
        </>
      )}
      
      <Routes>
        <Route path='/' element={<LoginPage />} />
        <Route path='/upload' element={<Upload />} />
        <Route path='/create' element={<UserCreate />} />
        <Route path='/update/:id' element={<UserUpdate />} />
        <Route path='/file' element={<File />} />
        <Route path='/loginpage' element={<LoginPage />} />
        <Route path='/Admin' element={<AdminLogin />} />
        <Route path='/user' element={<UserLogin />} />
        <Route path='/registerfrom' element={<RegisterFrom />} />
        <Route path='/homepage' element={<HomePage />} />
        <Route path='/fileupload' element={<FileUpload />} />
        <Route path='/track' element={<TrackDocuments />} />
        <Route path='/profile/:id' element={<UserProfile />} />
        <Route path='/home' element={<AdminHome />} />
        <Route path='/doc' element={<Documents />} />
        <Route path='/ac' element={<UserAccounts />} />
        <Route path='/list' element={<UserList />} />
        <Route path='/edit/:id' element={<EditDocuments />} />
        <Route path='/rec' element={<ReceiptsList />} />
        <Route path='/newuser' element={<AddUser />} />
        <Route path='/editu/:id' element={<EditUser />} />
        <Route path='/addfile' element={<Addfile />} />
        <Route path='/user-edit/:id' element={<EditDocument />} />
        <Route path='/unread' element={<UnreadDocuments />} />



      </Routes>
    </>
  );
}

export default App;
