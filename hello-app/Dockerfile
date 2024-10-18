# # ใช้ Node.js runtime เวอร์ชั่น 20.5.0
# FROM node:20.5.0

# # ตั้งค่า directory ทำงานใน container
# WORKDIR /app

# # คัดลอก package.json และติดตั้ง dependencies
# COPY package.json ./
# RUN npm install

# # คัดลอกโค้ดทั้งหมดเข้า container
# COPY . .

# # ตั้งค่าพอร์ตให้ React รันที่พอร์ต 3001
# ENV PORT=3001

# # สร้าง build ของ React
# RUN npm run build

# # เปิดพอร์ต 3001
# EXPOSE 3001

# # รันแอปพลิเคชัน
# CMD ["npm", "start"]


# ใช้ Node.js runtime เวอร์ชั่น 20.5.0
FROM node:20.5.0

# ตั้งค่า directory ทำงานใน container
WORKDIR /app

# คัดลอก package.json และติดตั้ง dependencies
COPY package.json ./
RUN npm install

# คัดลอกโค้ดทั้งหมดเข้า container
COPY . .

# สร้าง build ของ React สำหรับโหมด production
RUN npm run build

# ติดตั้งเว็บเซิร์ฟเวอร์เพื่อเสิร์ฟไฟล์สถิต
RUN npm install -g serve

# เปิดพอร์ต 3001
EXPOSE 3001

# เสิร์ฟไฟล์จาก build
CMD ["serve", "-s", "build", "-l", "3001"]
