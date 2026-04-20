# 🍽️ Restaurant Manager System

## 📌 Giới thiệu

Hệ thống **Restaurant Manager** là một website quản lý nội bộ cho nhà hàng, giúp nhân viên và quản trị viên thực hiện các nghiệp vụ như:

* Quản lý bàn ăn
* Đặt bàn cho khách
* Gọi món
* Quản lý menu
* Quản lý nhân viên
* Xem báo cáo doanh thu

Hệ thống được xây dựng theo mô hình **Client - Server (3-tier architecture)**, đảm bảo tính mở rộng và dễ bảo trì. 

---

## 👥 Đối tượng sử dụng

* **Admin**: quản lý toàn bộ hệ thống
* **Staff**: phục vụ khách, đặt bàn, gọi món
* **Customer**: không thao tác trực tiếp (thông qua staff)

---

## ⚙️ Công nghệ sử dụng

### Frontend

* React + Vite
* React Router
* Axios

### Backend

* Java Spring Boot
* Spring Security + JWT
* JPA / Hibernate

### Database

* MySQL

### DevOps

* Docker
* Docker Compose

---

## 🏗️ Kiến trúc hệ thống

Hệ thống gồm 3 thành phần chính:

```
Frontend (React)
        ↓
Backend (Spring Boot API)
        ↓
Database (MySQL)
```

---

## 🚀 Cách chạy project bằng Docker (QUAN TRỌNG)

### 🔧 Yêu cầu

* Cài Docker Desktop

---

### ▶️ Bước 1: Clone project

```bash
git clone <link-repo>
cd RestaurentManager
```

---

### ▶️ Bước 2: Chạy toàn bộ hệ thống

```bash
docker compose up --build
```

👉 Lần đầu sẽ hơi lâu (build image)

---

### ▶️ Bước 3: Truy cập

* 🌐 Frontend: http://localhost:5173
* 🔧 Backend: http://localhost:8080
* 🛢 MySQL: localhost:3307

---

### 🛑 Dừng hệ thống

```bash
docker compose down
```

---

### ❗ Reset database (nếu lỗi)

```bash
docker compose down -v
docker compose up --build
```

---

## 📦 Cấu trúc project

```
RestaurentManager/
│
├── restaurant-fe/        # Frontend (React)
├── restaurant-be/        # Backend (Spring Boot)
├── docker-compose.yml
└── README.md
```

---

## 🔐 Environment

Backend sử dụng file `.env`:

```env
DB_USERNAME=root
DB_PASSWORD=your_password
SIGNER_KEY=your_secret_key
```

---

## ✨ Các chức năng chính

### 👨‍🍳 Staff

* Đặt bàn
* Gọi món
* Xem lịch sử
* Xem menu

### 👑 Admin

* Quản lý nhân viên
* Quản lý bàn
* Quản lý menu
* Xem báo cáo

---

## 📊 API tiêu biểu

* `POST /auth/login` → đăng nhập
* `GET /dining-tables` → danh sách bàn
* `POST /orders` → tạo order
* `GET /reports/summary` → thống kê

---

## 🧠 Luồng hoạt động

1. User thao tác trên frontend
2. Frontend gọi API backend
3. Backend xử lý + validate JWT
4. Truy vấn MySQL
5. Trả dữ liệu về frontend

---

## ⚠️ Lưu ý quan trọng

* Không dùng `localhost` trong Docker → dùng `mysql`
* Nếu lỗi port:

  * đổi `3306 -> 3307`
* Nếu lỗi DB:

  * reset volume

---
## UI:

![alt text](/UI/Anh1.png)
![alt text](/UI/Anh2.png)
![alt text](/UI/Anh3.png)
![alt text](/UI/Anh4.png)
![alt text](/UI/Anh5.png)
![alt text](/UI/Anh6.png)
![alt text](/UI/Anh7.png)
![alt text](/UI/Anh8.png)
![alt text](/UI/Anh9.png)
![alt text](/UI/Anh10.png)
![alt text](/UI/Anh11.png)
![alt text](/UI/Anh12.png)
![alt text](/UI/Anh13.png)
![alt text](/UI/Anh14.png)
![alt text](/UI/Anh15.png)
![alt text](/UI/Anh16.png)



## 🚀 Hướng phát triển

* Deploy lên server (VPS)
* Tách frontend → Vercel
* Thêm thanh toán online
* Tối ưu UI/UX

---

## 👨‍💻 Tác giả

* Nguyễn Trọng Toàn
* PTIT - CNTT

---

## 🎯 Kết luận

Dự án đã hoàn thành các chức năng quản lý cơ bản của nhà hàng, hỗ trợ:

* giảm sai sót
* tăng hiệu quả quản lý
* dễ mở rộng trong tương lai 

---
