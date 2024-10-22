#!/bin/sh

# รอให้ MySQL พร้อมใช้งาน
until nc -z "$DB_HOST" "$DB_PORT"; do
  echo "Waiting for MySQL..."
  sleep 2
done

# เมื่อ MySQL พร้อมใช้งานแล้วให้รันแอปพลิเคชัน
exec node server.js
