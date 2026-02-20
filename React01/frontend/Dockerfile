# 使用 Node.js
FROM node:20-alpine

WORKDIR /app

# 先複製 package.json 確保緩存優化
COPY package*.json ./
RUN npm install

COPY . .

# 暴露 Vite 預設端口
EXPOSE 5173

# 啟動開發伺服器
CMD ["npm", "run", "dev", "--", "--host"]