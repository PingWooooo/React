
# 全端名片管理系統（React + Flask + PostgreSQL + Docker）

## 專案簡介

這是一個以 React (Vite) 為前端、Flask 為後端、PostgreSQL 為資料庫，並以 Docker 容器化的全端名片管理系統範例。你可以用來學習全端開發、Docker 部署，或作為個人專案起點。

---

## 專案結構

```
├── docker-compose.yaml         # Docker 多服務協作設定
├── .env                       # 敏感環境變數（資料庫帳密等）
├── backend/                   # 後端 Flask API
│   ├── app.py                 # 主程式
│   ├── requirements.txt       # Python 依賴
│   └── Dockerfile             # Backend Docker 設定
├── frontend/                  # 前端 React (Vite)
│   ├── src/                   # React 原始碼
│   ├── package.json           # 前端依賴
│   └── Dockerfile             # Frontend Docker 設定
└── ...
```

---

## 快速開始

### 1. 下載專案

```bash
git clone <本專案網址>
cd React01
```

### 2. 設定環境變數

請確認根目錄有 `.env` 檔案，內容範例如下：

```env
POSTGRES_USER=myuser
POSTGRES_PASSWORD=mypassword
POSTGRES_DB=mydatabase
DATABASE_URL=postgresql://myuser:mypassword@db:5432/mydatabase
```

### 3. 一鍵啟動所有服務

```bash
docker-compose up --build
```

### 4. 服務說明

- 前端： http://localhost:5173
- 後端 API： http://localhost:5000/api/users
- PostgreSQL：localhost:5432

---

## 主要功能

- 新增、查詢、刪除名片成員
- 前端 React/Vite，後端 Flask RESTful API
- PostgreSQL 資料庫
- 完全容器化，開發/部署一致

---

## 常見問題

1. **資料庫連線失敗？**
	 - 請確認 `.env` 設定正確，且未被 git 上傳（已在 .gitignore）
	 - 第一次啟動時，資料庫可能較慢，Flask 會自動重試

2. **前端無法連線 API？**
	 - 請確認後端服務已啟動，且 API 路徑為 `/api/users`
	 - 若跨網段請檢查 CORS 設定

3. **如何重置資料庫？**
	 - 停止服務後，刪除 `postgres_data` volume：
		 ```bash
		 docker-compose down -v
		 ```

---

## 進階：自訂 Docker 配置

### docker-compose.yaml 範例

```yaml
version: '3.8'
services:
	db:
		image: postgres:15
		env_file:
			- .env
		ports:
			- "5432:5432"
		volumes:
			- postgres_data:/var/lib/postgresql/data
	backend:
		build: ./backend
		ports:
			- "5000:5000"
		volumes:
			- ./backend:/app
		env_file:
			- .env
		depends_on:
			- db
	frontend:
		build: ./frontend
		ports:
			- "5173:5173"
		volumes:
			- ./frontend:/app
			- /app/node_modules
		depends_on:
			- backend
volumes:
	db_data:
	postgres_data:
```

---

## 聯絡/授權

歡迎 fork、star、改作！如有問題請開 issue。
