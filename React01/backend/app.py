from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
import os
import time

app = Flask(__name__)

# --- 1. CORS 設定強化 ---
# 確保所有 /api/* 路由都允許來自 React (5173) 的請求
CORS(app, resources={r"/api/*": {"origins": "*"}})

# 讀取環境變數
db_url = os.getenv('DATABASE_URL')

# 修正連線字串格式
if db_url and db_url.startswith("postgres://"):
    db_url = db_url.replace("postgres://", "postgresql://", 1)

app.config['SQLALCHEMY_DATABASE_URI'] = db_url or 'sqlite:///data.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

# --- 2. 資料模型 ---
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    bio = db.Column(db.String(200))

# --- 3. 初始化資料庫（加入錯誤處理與重試機制） ---
with app.app_context():
    # 在 Docker 中，資料庫啟動可能較慢，嘗試建立表格
    try:
        db.create_all()
        print("✅ PostgreSQL 表格檢查/建立成功！")
    except Exception as e:
        print(f"❌ 資料庫初始化失敗: {e}")
        # 這裡不崩潰，讓程式繼續跑，方便我們從 Log 觀察錯誤

# --- 4. API 路由 ---

@app.route('/api/users', methods=['GET'])
def get_users():
    try:
        users = User.query.all()
        output = [{"id": u.id, "name": u.name, "bio": u.bio} for u in users]
        return jsonify(output)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/users', methods=['POST'])
def add_user():
    try:
        data = request.json
        if not data or 'name' not in data:
            return jsonify({"error": "缺少必要欄位"}), 400
            
        new_user = User(name=data['name'], bio=data['bio'])
        db.session.add(new_user)
        db.session.commit()
        return jsonify({"message": "使用者已新增！"}), 201
    except Exception as e:
        db.session.rollback() # 發生錯誤時回滾，避免連線卡死
        print(f"新增失敗錯誤詳情: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/users/<int:user_id>', methods=['DELETE'])
def delete_user(user_id):
    try:
        user = db.session.get(User, user_id)
        if user:
            db.session.delete(user)
            db.session.commit()
            return jsonify({"message": f"使用者 {user_id} 已刪除"}), 200
        return jsonify({"message": "找不到該使用者"}), 404
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    # 確保 debug 模式開啟，host 設為 0.0.0.0 以便 Docker 映射
    app.run(debug=True, host='0.0.0.0', port=5000)