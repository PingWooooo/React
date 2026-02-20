import React from 'react';
import './Card.css';

function Card({ id, title, content, children, onDelete }) {
  return (
    <div className="card" style={{ position: 'relative' }}>
      {onDelete && (
        <button
          onClick={() => onDelete(id)}
          style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            background: '#ff4d4d',
            color: 'white',
            border: 'none',
            borderRadius: '50%',
            width: '25px',
            height: '25px',
            cursor: 'pointer'
          }}
        >
          ✕
        </button>
      )}
      <h2>{title}</h2>
      <p>{content}</p>
      {children && <div>{children}</div>}
    </div>
  );
}

export default Card;
