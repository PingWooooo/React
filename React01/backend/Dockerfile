# 使用輕量級 Python 作為基底
FROM python:3.11-slim

# 設定工作目錄
WORKDIR /app

# 複製依賴清單並安裝
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# 複製所有程式碼
COPY . .

# 告訴 Docker 執行這條指令啟動 Flask
CMD ["python", "app.py"]