import React from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import "./LoginRequiredModal.css";

const LoginRequiredModal = ({ onClose }) => {
  const navigate = useNavigate();

  const handleLoginRedirect = () => {
    navigate("/login");
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={onClose}>
          &times;
        </span>
        <div className="modal-body">
          <h2>Iniciar Sesión Requerido</h2>
          <p>Debes iniciar sesión para efectuar una compra.</p>
          <button className="btn" onClick={handleLoginRedirect}>
            Iniciar Sesión
          </button>
        </div>
      </div>
    </div>
  );
};

LoginRequiredModal.propTypes = {
  onClose: PropTypes.func.isRequired,
};

export default LoginRequiredModal;
