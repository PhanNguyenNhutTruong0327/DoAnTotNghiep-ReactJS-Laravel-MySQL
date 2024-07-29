import React from "react";
import PropTypes from "prop-types";

const ChatIcons = ({ onClose }) => {
    return (
        <div className="chat-icons">
            <div className="icon facebook-icon">
                <a href="https://www.facebook.com/letien.tran.180/" target="_blank" rel="noopener noreferrer">
                    <i className="fab fa-facebook-messenger"></i>
                </a>
            </div>
            <div className="icon zalo-icon">
                <a href="https://zalo.me" target="_blank" rel="noopener noreferrer">
                    <i className="fab fa-zalo"></i>
                </a>
            </div>
            <div className="icon instagram-icon">
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                    <i className="fab fa-instagram"></i>
                </a>
            </div>
            <div className="close-icon" onClick={onClose}>
                <i className="fas fa-times"></i>
            </div>
        </div>
    );
};

ChatIcons.propTypes = {
    onClose: PropTypes.func.isRequired,
};

export default ChatIcons;
