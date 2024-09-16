// // src/Admin/AdminAppbar.js
// import React, { useState } from 'react';
// import { AppBar, Box, Toolbar, Typography, IconButton, InputBase, Badge, Drawer, CssBaseline, List, ListItem, ListItemIcon, ListItemText, Divider, Tooltip } from '@mui/material';
// import { Search, Notifications, Home, PersonAdd } from '@mui/icons-material';

// const drawerWidth = 240;

// function AdminAppbar() {
//   const [search, setSearch] = useState('');

//   const handleSearchChange = (event) => {
//     setSearch(event.target.value);
//   };

//   const handleBackToHome = () => {
//     // ใส่โค้ดสำหรับกลับไปหน้า Home
//     console.log('Back to Home');
//   };

//   const handleAddUser = () => {
//     // ใส่โค้ดสำหรับไปหน้า Add User
//     console.log('Add User');
//   };

//   return (
//     <Box sx={{ display: 'flex' }}>
//       <CssBaseline />
//       {/* AppBar ด้านบน */}
//       <AppBar position="fixed" sx={{ width: `calc(100% - ${drawerWidth}px)`, ml: `${drawerWidth}px` }}>
//         <Toolbar>
//           <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
//             Admin Dashboard
//           </Typography>
//           <Box sx={{ display: 'flex', alignItems: 'center' }}>
//             {/* ช่องค้นหา */}
//             <Box sx={{ display: 'flex', alignItems: 'center', backgroundColor: '#fff', borderRadius: '4px', px: 1, mx: 2 }}>
//               <IconButton sx={{ p: '10px' }}>
//                 <Search />
//               </IconButton>
//               <InputBase
//                 placeholder="Search…"
//                 value={search}
//                 onChange={handleSearchChange}
//                 sx={{ ml: 1, flex: 1 }}
//               />
//             </Box>
//             {/* ชื่อผู้ใช้ */}
//             <Typography variant="body1" sx={{ mr: 2 }}>
//               Username
//             </Typography>
//             {/* สัญลักษณ์แจ้งเตือน */}
//             <IconButton sx={{ color: 'inherit' }}>
//               <Badge badgeContent={4} color="error">
//                 <Notifications />
//               </Badge>
//             </IconButton>
//           </Box>
//         </Toolbar>
//       </AppBar>

//       {/* เมนูด้านข้าง */}
//       <Drawer
//         sx={{
//           width: drawerWidth,
//           flexShrink: 0,
//           '& .MuiDrawer-paper': {
//             width: drawerWidth,
//             boxSizing: 'border-box',
//             bgcolor: '#1A2035',  // สีพื้นหลังของ Drawer (สีเข้ม)
//             color: '#B9BABF',    // สีของตัวหนังสือ (สีขาว/เทาอ่อน)
//           },
//         }}
//         variant="permanent"
//         anchor="left"
//       >
//         <Toolbar />
//         <Divider />
//         <List>
//           {/* เมนู Home */}
//           <Tooltip title="Home" arrow>
//             <ListItem button onClick={handleBackToHome}>
//               <ListItemIcon sx={{ color: '#ddd' }}>
//                 <Home />
//               </ListItemIcon>
//               <ListItemText primary="Home" />
//             </ListItem>
//           </Tooltip>

//           {/* เมนู Add User */}
//           <Tooltip title="Add User" arrow>
//             <ListItem button onClick={handleAddUser}>
//               <ListItemIcon sx={{ color: '#ddd' }}>
//                 <PersonAdd />
//               </ListItemIcon>
//               <ListItemText primary="Add User" />
//             </ListItem>
//           </Tooltip>
//         </List>
//       </Drawer>

//       {/* เนื้อหาส่วนที่เหลือ */}
//       <Box component="main" sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3 }}>
//         <Toolbar />
//         {/* ใส่เนื้อหาของหน้า Dashboard หรืออื่นๆ ที่นี่ */}
//         <Typography paragraph>
//           Welcome to the Admin Dashboard.
//         </Typography>
//       </Box>
//     </Box>
//   );
// }

// export default AdminAppbar;
