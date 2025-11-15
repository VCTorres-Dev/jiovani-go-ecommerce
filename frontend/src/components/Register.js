import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const { username, email, password, confirmPassword } = formData;
  const navigate = useNavigate();

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    setLoading(true);
    try {
      // Extraemos confirmPassword para no enviarlo al backend
      const { confirmPassword, ...payload } = formData;
      const apiBase = process.env.REACT_APP_API_URL || "http://localhost:5000/api";
      await axios.post(
        `${apiBase}/auth/register`,
        payload
      );
      setSuccess("¡Cuenta creada con éxito! Serás redirigido al inicio de sesión.");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Ha ocurrido un error al crear la cuenta.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form
        onSubmit={onSubmit}
        className="flex flex-col items-center justify-center px-6 py-8 mx-auto lg:py-0"
      >
        <div className="w-full bg-white rounded-lg shadow border md:mt-0 sm:max-w-md xl:p-0">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                        <p className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl">
              Crear una cuenta
            </p>
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                <span className="block sm:inline">{error}</span>
              </div>
            )}
            {success && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
                <span className="block sm:inline">{success}</span>
              </div>
            )}
            <div>
                                          <label className="block mb-2 text-sm font-medium text-gray-900">
                Tu nombre de usuario
              </label>
              <input
                placeholder="JohnDoe"
                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5"
                id="username"
                name="username"
                type="text"
                value={username}
                onChange={onChange}
                required
              />
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-900">
                Correo Electrónico
              </label>
              <input
                placeholder="example@example.com"
                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5"
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={onChange}
                required
              />
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-900">
                Contraseña
              </label>
              <input
                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5"
                placeholder="••••••••"
                id="password"
                name="password"
                type="password"
                value={password}
                onChange={onChange}
                required
              />
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-900">
                Confirma tu contraseña
              </label>
              <input
                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5"
                placeholder="••••••••"
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={onChange}
                required
              />
            </div>
            <div className="flex items-start">
                            <div className="flex items-center h-5">
                <input
                  className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300"
                  type="checkbox"
                  aria-describedby="terms"
                  id="terms"
                  required
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="terms" className="font-light text-gray-500">
                  Acepto los{' '}
                  <button
                    type="button"
                    className="font-medium text-primary hover:underline"
                  >
                    Términos y Condiciones
                  </button>
                </label>
              </div>
            </div>
                        <button
              className="w-full bg-primary hover:bg-secondary text-white focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center transition-colors duration-300 disabled:opacity-50"
              type="submit"
              disabled={loading}
            >
              {loading ? "Creando cuenta..." : "Crear cuenta"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Register;
