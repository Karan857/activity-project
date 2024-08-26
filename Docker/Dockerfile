# เลือก image base ที่ใช้
FROM node:18-alpine

# ตั้ง working directory
WORKDIR /app

# Copy ไฟล์ package.json และ package-lock.json และติดตั้ง dependencies
COPY package*.json ./
RUN npm install

# Copy source code ทั้งหมด
COPY . .

# ระบุพอร์ตที่แอปพลิเคชันจะใช้
EXPOSE 3000

# คำสั่งเริ่มต้นในการรันแอปพลิเคชัน
CMD ["npm", "start"]
