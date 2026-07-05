# Todo List App

Ứng dụng Todo List full-stack dùng React TypeScript ở frontend, Express Sequelize ở backend và MySQL chạy bằng Docker.

Project hỗ trợ các chức năng chính:

- Thêm công việc mới.
- Xem danh sách công việc.
- Sửa công việc.
- Xóa công việc.
- Đổi trạng thái hoàn thành/chưa hoàn thành.
- Tìm kiếm công việc theo tên.
- Lọc theo trạng thái.
- Sắp xếp mới nhất/cũ nhất.
- Phân trang.
- Chọn số lượng item hiển thị trên mỗi trang.

## Công Nghệ Sử Dụng

### Frontend

- React `19.2.7`
- React DOM `19.2.7`
- TypeScript `6.0.3`
- Vite `8.1.3`
- ESLint `10.6.0`

### Backend

- Node.js `24.16.0`
- npm `11.13.0`
- Express `4.22.2`
- Sequelize `6.37.8`
- MySQL2 `3.22.5`
- CORS `2.8.6`
- Dotenv `16.6.1`
- Nodemon `3.1.14`

### Database và Docker

- MySQL Docker image: `mysql:8.0`
- Docker đã kiểm thử: `29.6.1`
- Docker Compose đã kiểm thử: `v5.1.4`

> Lưu ý: `package.json` có thể dùng ký hiệu version dạng `^`, nhưng `package-lock.json` đã khóa version thực tế. Khi chạy `npm install`, npm sẽ cài theo lockfile.

## Yêu Cầu Môi Trường

Máy cần cài sẵn:

- Node.js `24.16.0` hoặc phiên bản tương thích Node 24.x.
- npm `11.13.0` hoặc phiên bản đi kèm Node 24.x.
- Docker Desktop.
- Docker Compose.

Kiểm tra version:

```bash
node -v
npm -v
docker --version
docker-compose --version
```

Nếu máy dùng Docker Compose dạng plugin mới, có thể dùng:

```bash
docker compose version
```

Trong project này, lệnh đã kiểm thử trên máy dev là:

```bash
docker-compose
```

## Cấu Trúc Thư Mục

```txt
todo-app/
├── backend/
│   ├── src/
│   │   ├── app.js
│   │   ├── server.js
│   │   ├── config/
│   │   │   └── database.js
│   │   ├── controllers/
│   │   │   └── todo.controller.js
│   │   ├── middlewares/
│   │   │   ├── error.middleware.js
│   │   │   └── notFound.middleware.js
│   │   ├── models/
│   │   │   ├── index.js
│   │   │   └── todo.model.js
│   │   └── routes/
│   │       └── todo.routes.js
│   ├── .env
│   ├── package.json
│   └── package-lock.json
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   └── todoApi.ts
│   │   ├── components/
│   │   │   ├── Pagination.tsx
│   │   │   ├── TodoFilters.tsx
│   │   │   ├── TodoForm.tsx
│   │   │   └── TodoItem.tsx
│   │   ├── types/
│   │   │   └── todo.ts
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   ├── package.json
│   └── package-lock.json
├── docker-compose.yml
├── .gitignore
└── README.md
```

## Cấu Hình Database

Database chạy bằng Docker MySQL.

File [docker-compose.yml](./docker-compose.yml):

```yaml
services:
  mysql:
    image: mysql:8.0
    container_name: todo_mysql
    restart: always
    environment:
      MYSQL_ROOT_PASSWORD: root
      MYSQL_DATABASE: todo_db
      MYSQL_USER: todo_user
      MYSQL_PASSWORD: todo_password
    ports:
      - "3307:3306"
    volumes:
      - todo_mysql_data:/var/lib/mysql

volumes:
  todo_mysql_data:
```

File [backend/.env](./backend/.env):

```env
PORT=5000
DB_HOST=localhost
DB_PORT=3307
DB_NAME=todo_db
DB_USER=todo_user
DB_PASSWORD=todo_password
```

`.env` được giữ lại trong Git theo yêu cầu của project để người clone về có thể chạy ngay.

## Hướng Dẫn Chạy Project

### Bước 1: Clone project

```bash
git clone <repository-url>
cd todo-app
```

Nếu nhận project bằng file zip, giải nén rồi mở terminal tại thư mục `todo-app`.

### Bước 2: Chạy MySQL bằng Docker

Ở thư mục root `todo-app`, chạy:

```bash
docker-compose up -d
```

Nếu máy dùng Docker Compose plugin mới:

```bash
docker compose up -d
```

Kiểm tra container:

```bash
docker-compose ps
```

Kết quả mong muốn:

```txt
todo_mysql   mysql:8.0   Up   0.0.0.0:3307->3306/tcp
```

Đợi khoảng 10-30 giây sau khi container chạy lần đầu để MySQL khởi tạo database.

### Bước 3: Cài và chạy Backend

Mở terminal thứ nhất:

```bash
cd backend
npm install
npm run dev
```

Backend chạy ở:

```txt
http://localhost:5000
```

Khi chạy thành công, terminal backend sẽ hiện tương tự:

```txt
Database connected successfully
Database synced successfully
Server is running at http://localhost:5000
```

Kiểm tra API bằng trình duyệt hoặc Postman:

```txt
http://localhost:5000/
```

Kết quả:

```json
{
  "success": true,
  "message": "Todo List API is running"
}
```

Kiểm tra danh sách todo:

```txt
http://localhost:5000/api/todos
```

### Bước 4: Cài và chạy Frontend

Mở terminal thứ hai:

```bash
cd frontend
npm install
npm run dev
```

Frontend chạy ở:

```txt
http://localhost:5173
```

Mở trình duyệt và truy cập:

```txt
http://localhost:5173
```

Frontend mặc định gọi API ở:

```txt
http://localhost:5000/api
```

Nếu muốn đổi API URL, có thể tạo file `frontend/.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

## Scripts

### Backend

Chạy development với nodemon:

```bash
cd backend
npm run dev
```

Chạy production đơn giản:

```bash
cd backend
npm start
```

### Frontend

Chạy development:

```bash
cd frontend
npm run dev
```

Build production:

```bash
cd frontend
npm run build
```

Preview bản build:

```bash
cd frontend
npm run preview
```

Lint:

```bash
cd frontend
npm run lint
```

## API Endpoints

Base URL:

```txt
http://localhost:5000/api
```

### Health check

```http
GET /
```

### Lấy danh sách todo

```http
GET /api/todos
```

Query params hỗ trợ:

| Param | Kiểu | Mặc định | Mô tả |
| --- | --- | --- | --- |
| `search` | string | `''` | Tìm kiếm theo title |
| `status` | `all`, `completed`, `pending` | `all` | Lọc trạng thái |
| `page` | number | `1` | Trang hiện tại |
| `limit` | number | `10` | Số item mỗi trang |
| `sort` | `newest`, `oldest` | `newest` | Sắp xếp theo ngày tạo |

Ví dụ:

```txt
http://localhost:5000/api/todos?search=docker&status=all&page=1&limit=5&sort=newest
```

### Lấy chi tiết todo

```http
GET /api/todos/:id
```

### Tạo todo

```http
POST /api/todos
```

Body:

```json
{
  "title": "Học Docker",
  "description": "Chạy MySQL bằng Docker Compose"
}
```

### Cập nhật todo

```http
PUT /api/todos/:id
```

Body:

```json
{
  "title": "Học React",
  "description": "Ôn lại component, props và state",
  "is_completed": false
}
```

### Đổi trạng thái todo

```http
PATCH /api/todos/:id/toggle
```

### Xóa todo

```http
DELETE /api/todos/:id
```

## Database Schema

Model `Todo` dùng table `todos`.

| Field | Kiểu | Mô tả |
| --- | --- | --- |
| `id` | integer unsigned | Khóa chính, tự tăng |
| `title` | string | Tên công việc |
| `description` | text, nullable | Mô tả công việc |
| `is_completed` | boolean | Trạng thái hoàn thành |
| `created_at` | datetime | Thời gian tạo |
| `updated_at` | datetime | Thời gian cập nhật |

Backend đang dùng:

```js
sequelize.sync({ alter: true })
```

Nên khi backend chạy, Sequelize sẽ tự đồng bộ table theo model.

## Kiểm Tra Trước Khi Nộp/Review

Chạy Docker:

```bash
docker-compose up -d
docker-compose ps
```

Kiểm tra backend:

```bash
cd backend
npm install
npm run dev
```

Kiểm tra frontend:

```bash
cd frontend
npm install
npm run lint
npm run build
npm run dev
```

Kiểm tra nhanh trên browser:

```txt
http://localhost:5000/
http://localhost:5000/api/todos
http://localhost:5173
```

## Lưu Ý Về .gitignore

Project có `.gitignore` ở root để không đưa các file/thư mục sinh ra trong quá trình chạy lên Git:

- `node_modules/`
- `dist/`
- `build/`
- log files
- cache files
- editor files

Riêng `.env` không bị ignore. File `backend/.env` nên được commit theo yêu cầu để người clone về chạy được ngay.
