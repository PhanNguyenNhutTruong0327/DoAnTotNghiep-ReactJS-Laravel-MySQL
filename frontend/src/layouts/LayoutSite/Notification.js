import React, { useState } from 'react';
import '../../assets/frontend/css/style.css';
function Notification({ message, onClose }) {
    return (
        <div className="notification">
            <p>{message}</p>
            <button onClick={onClose}>Tắt</button>
        </div>
    );
}

export default Notification;
