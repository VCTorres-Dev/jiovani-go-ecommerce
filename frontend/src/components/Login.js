import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import setAuthToken from '../utils/setAuthToken';

const Login = ({ setUser }) => {
    const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    remember: false,
  });

  const { email, password, remember } = formData;
  const navigate = useNavigate();

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const apiBase = process.env.REACT_APP_API_URL || "http://localhost:5000/api";
      const res = await axios.post(
        `${apiBase}/auth/login`,
        formData
      );
      
      // Guardar token y configurar header de autorización
      localStorage.setItem("token", res.data.token);
      setAuthToken(res.data.token);
      
      // Guardar el objeto de usuario completo
      setUser(res.data.user);
      
      // Redirigir a la página principal
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Ha ocurrido un error. Inténtalo de nuevo.");
      console.error(err.response?.data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-100 flex justify-center items-center h-screen">
      <div className="w-1/2 h-screen hidden lg:block">
        <img
          src="/images/laura-chouette-bnPdoKs9d54-unsplash.jpg"
          alt="Frascos de perfume sobre una superficie decorativa"
          className="object-cover w-full h-full"
        />
      </div>
      <div className="lg:p-36 md:p-52 sm:20 p-8 w-full lg:w-1/2">
                <h1 className="text-2xl font-semibold mb-4">Iniciar Sesión</h1>
        <form onSubmit={onSubmit}>
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
              <span className="block sm:inline">{error}</span>
            </div>
          )}
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-600">
              Correo Electrónico
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
              value={email}
              onChange={onChange}
              autoComplete="off"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-600">
              Contraseña
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
              value={password}
              onChange={onChange}
              autoComplete="off"
              required
            />
          </div>
          <div className="mb-4 flex items-center">
            <input
              type="checkbox"
              id="remember"
              name="remember"
              className="text-blue-500"
              checked={remember}
              onChange={(e) =>
                setFormData({ ...formData, [e.target.name]: e.target.checked })
              }
            />
            <label htmlFor="remember" className="text-gray-600 ml-2">
              Recuérdame
            </label>
          </div>
                    <div className="mb-6 text-primary">
            <button type="button" className="hover:underline focus:outline-none">
              ¿Olvidaste tu contraseña?
            </button>
          </div>
                    <button
            type="submit"
            className="bg-primary hover:bg-secondary text-white font-semibold rounded-md py-2 px-4 w-full transition-colors duration-300 disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "Iniciando..." : "Iniciar Sesión"}
          </button>
        </form>
                <div className="mt-6 text-primary text-center">
          <a href="/register" className="hover:underline">
            ¿No tienes una cuenta? Regístrate aquí
          </a>
        </div>
      </div>
    </div>
  );
};

export default Login;
