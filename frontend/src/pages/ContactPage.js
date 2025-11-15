import React, { useState } from "react";
import {
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";
import { FaFacebookF, FaTwitter, FaInstagram } from "react-icons/fa";
import { sendMessage } from "../services/messageService";
import { toast } from "react-toastify";

const ContactPage = () => {
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    telefono: "",
    asunto: "consulta-producto", // Valor por defecto para el select
    mensaje: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

    const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await sendMessage(formData);
      toast.success("¡Mensaje enviado con éxito! Gracias por contactarnos.");
      setFormData({
        nombre: "",
        email: "",
        telefono: "",
        asunto: "consulta-producto",
        mensaje: "",
      });
    } catch (error) {
      toast.error(error.toString());
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 animate-fadeIn">
      {/* Hero Section */}
      <div
        className="relative text-white py-24 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.pexels.com/photos/965989/pexels-photo-965989.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1')",
        }}
      >
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-extrabold mb-6 tracking-tight">
            Contáctanos
          </h1>
          <p className="text-xl max-w-3xl mx-auto leading-relaxed">
            Estamos aquí para ayudarte. Ponte en contacto con nuestros expertos
            para cualquier consulta.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
          {/* Formulario de Contacto (más ancho) */}
          <div className="lg:col-span-3 bg-white rounded-xl shadow-lg p-8 border border-gray-100">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Envíanos un mensaje
            </h2>
            <p className="text-gray-600 mb-8">
              Completa el formulario y te responderemos a la brevedad.
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="nombre"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    Nombre completo *
                  </label>
                  <input
                    type="text"
                    id="nombre"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 transition"
                    placeholder="Tu nombre"
                  />
                </div>
                <div>
                  <label
                    htmlFor="telefono"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    Teléfono
                  </label>
                  <input
                    type="tel"
                    id="telefono"
                    name="telefono"
                    value={formData.telefono}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 transition"
                    placeholder="(Opcional)"
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 transition"
                  placeholder="tu@email.com"
                />
              </div>
              <div>
                <label
                  htmlFor="asunto"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Asunto *
                </label>
                <select
                  id="asunto"
                  name="asunto"
                  value={formData.asunto}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 transition bg-white"
                >
                  <option value="consulta-producto">Consulta sobre un producto</option>
                  <option value="informacion-compra">Información sobre una compra</option>
                  <option value="asesoramiento">Solicitar asesoramiento</option>
                  <option value="reclamo">Reclamo o sugerencia</option>
                  <option value="otro">Otro</option>
                </select>
              </div>
              <div>
                <label
                  htmlFor="mensaje"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Mensaje *
                </label>
                <textarea
                  id="mensaje"
                  name="mensaje"
                  rows="5"
                  value={formData.mensaje}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 transition"
                  placeholder="Escribe tu mensaje aquí..."
                ></textarea>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gold-600 text-white font-bold py-3 px-8 rounded-lg shadow-lg hover:bg-darkGold-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gold-500 transition-all disabled:opacity-50"
                >
                  {isSubmitting ? "Enviando..." : "Enviar Mensaje"}
                </button>
              </div>
            </form>
          </div>

          {/* Columna de Información (más estrecha) */}
          <div className="lg:col-span-2 space-y-8">
            {/* Info Cards */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                Información de Contacto
              </h3>
              <div className="space-y-5">
                <InfoItem
                  icon={<MapPinIcon />}
                  title="Nuestra Tienda"
                  text="Av. Siempreviva 742, Springfield"
                />
                <InfoItem
                  icon={<PhoneIcon />}
                  title="Llámanos"
                  text="(+51) 987 654 321"
                />
                <InfoItem
                  icon={<EnvelopeIcon />}
                  title="Escríbenos"
                  text="contacto@dejoaromas.com"
                />
                <InfoItem
                  icon={<ClockIcon />}
                  title="Horario"
                  text="Lunes a Sábado: 10am - 8pm"
                />
              </div>
            </div>

            {/* Social Media & Image Card */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="w-full h-48 md:h-80 rounded-xl overflow-hidden shadow-lg mt-4 mb-6">
                <iframe
                  title="Mapa Talca, Chile"
                  src="https://www.google.com/maps?q=-35.4264,-71.6554&z=13&output=embed"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full h-full"
                ></iframe>
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Síguenos
                </h3>
                <div className="flex justify-center space-x-5">
                  <SocialIcon href="#" icon={<FaFacebookF />} />
                  <SocialIcon href="#" icon={<FaTwitter />} />
                  <SocialIcon href="#" icon={<FaInstagram />} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper components para un código más limpio
const InfoItem = ({ icon, title, text }) => (
  <div className="flex items-start space-x-4">
    <div className="flex-shrink-0 bg-gold-100 p-3 rounded-full">
      {React.cloneElement(icon, { className: "w-6 h-6 text-gold-600" })}
    </div>
    <div>
      <h4 className="text-lg font-semibold text-gray-800">{title}</h4>
      <p className="text-gray-600">{text}</p>
    </div>
  </div>
);

const SocialIcon = ({ href, icon }) => (
  <a
    href={href}
    className="text-gray-500 hover:text-gold-600 transition-colors duration-300"
  >
    {React.cloneElement(icon, { className: "w-7 h-7" })}
  </a>
);

export default ContactPage;
