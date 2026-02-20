import { useState, useEffect } from 'react';
import axios from 'axios';
import Card from './components/Card';

function App() {
  const [users, setUsers] = useState([]);
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');

  // 抓取資料的函式
  const fetchUsers = () => {
    axios.get('http://127.0.0.1:5000/api/users').then(res => setUsers(res.data));
  };

  useEffect(() => { fetchUsers(); }, []);

  // 處理表單送出
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !bio) return alert("請填寫完整資訊");

    axios.post('http://127.0.0.1:5000/api/users', { name, bio })
      .then(() => {
        setName(''); // 清空欄位
        setBio('');
        fetchUsers(); // 重新抓取資料，畫面就會自動更新！
      });
  };

  // --- 新增：刪除邏輯 ---
  const handleDelete = (id) => {
    if (window.confirm("確定要刪除這位成員嗎？")) {
      axios.delete(`http://127.0.0.1:5000/api/users/${id}`)
        .then(() => {
          // 成功後，重新抓取清單 (或是從本地狀態過濾掉，速度更快)
          setUsers(users.filter(user => user.id !== id));
        })
        .catch(err => alert("刪除失敗"));
    }
  };

  return (
    <div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ textAlign: 'center' }}>全端名片管理系統</h1>

      {/* 新增表單 */}
      <form onSubmit={handleSubmit} style={{ marginBottom: '40px', padding: '20px', border: '1px solid #ddd', borderRadius: '10px' }}>
        <h3>新增成員</h3>
        <input placeholder="名字" value={name} onChange={e => setName(e.target.value)} style={{ display: 'block', margin: '10px 0', padding: '8px', width: '100%' }} />
        <input placeholder="簡介" value={bio} onChange={e => setBio(e.target.value)} style={{ display: 'block', margin: '10px 0', padding: '8px', width: '100%' }} />
        <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>新增到資料庫</button>
      </form>

      {/* 列表顯示 */}
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
        {users.map(user => (
          <Card key={user.id} 
                id={user.id} // 記得傳入 id 
                title={user.name} 
                content={user.bio}
                onDelete={handleDelete} // 把函式傳給子組件 
          />
        ))}
      </div>
    </div>
  );
}

export default App;