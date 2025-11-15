import React, { useState } from "react";
import { Link } from "react-router-dom";
import SelectionModal from "../components/SelectionModal";
import { blogPosts } from "../data/blogPosts";
import { ArrowRightIcon } from '@heroicons/react/20/solid';
import LightBulbIcon from "../icons/lightbulb-alt-svgrepo-com.svg";
import StarIcon from "../icons/star-sharp-svgrepo-com.svg";
import GlobeIcon from "../icons/planet-svgrepo-com.svg";
import "../App.css";

function HomePage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAvatarError = (e) => {
    e.target.onerror = null; // Prevents infinite loops
    const name = e.target.alt || "User";
    e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
      name
    )}&background=D4AF37&color=fff&size=96&bold=true`;
  };

  return (
    <div className="bg-white text-gray-800 min-h-screen">
      {/* Hero Section */}
      <section className="relative hero-section bg-white">
        <div className="absolute inset-0 overflow-hidden">
          <img
            src="/images/laura-chouette-bnPdoKs9d54-unsplash.jpg"
            alt="Hero"
            className="w-full h-full object-cover opacity-90"
          />
        </div>
        <div className="relative z-10 flex flex-col items-center justify-center min-h-screen text-center text-white bg-black bg-opacity-30">
          <h1 className="text-6xl font-bold mb-4">
            Descubre la esencia del lujo
          </h1>
          <p className="text-2xl mb-8">
            Perfumes con esencias seleccionadas y exclusivas.
          </p>
          <div className="flex gap-4">
            <Link to="/catalogo-dama">
              <button className="bg-gold-600 hover:bg-darkGold-600 text-white font-bold py-3 px-6 rounded shadow-lg transition-transform transform hover:scale-105">
                Aromas para Dama
              </button>
            </Link>
            <Link to="/catalogo-varon">
              <button className="bg-gold-600 hover:bg-darkGold-600 text-white font-bold py-3 px-6 rounded shadow-lg transition-transform transform hover:scale-105">
                Aromas para Varón
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="values-section py-16 bg-gray-50">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-extrabold text-gray-900">
              Nuestros Valores
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Comprometidos con la excelencia y la innovación
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-8">
            {[
              {
                title: "Innovación",
                description:
                  "Nos esforzamos por estar siempre a la vanguardia de la industria de fragancias.",
                icon: (
                  <img
                    src={LightBulbIcon}
                    alt="Innovación"
                    className="w-12 h-12 mx-auto"
                  />
                ),
              },
              {
                title: "Calidad",
                description:
                  "Utilizamos solo los mejores ingredientes para crear nuestras fragancias únicas.",
                icon: (
                  <img
                    src={StarIcon}
                    alt="Calidad"
                    className="w-12 h-12 mx-auto"
                  />
                ),
              },
              {
                title: "Sostenibilidad",
                description:
                  "Comprometidos con prácticas sostenibles y respetuosas con el medio ambiente.",
                icon: (
                  <img
                    src={GlobeIcon}
                    alt="Sostenibilidad"
                    className="w-12 h-12 mx-auto"
                  />
                ),
              },
            ].map((value) => (
              <div key={value.title} className="value-card">
                {value.icon}
                <h3>{value.title}</h3>
                <p>{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Preview Section */}
      <section className="blog-preview-section py-16 bg-gray-50">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl">
              Desde Nuestro Diario Aromático
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-600">
              Descubre historias, consejos y secretos del fascinante mundo de las fragancias.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {blogPosts.slice(0, 3).map((post) => (
              <Link to={`/blog/${post.id}`} key={post.id} className="group flex flex-col bg-white shadow-lg rounded-xl overflow-hidden transform hover:-translate-y-2 transition-transform duration-300">
                <div className="relative">
                  <img src={post.imageUrl} alt={post.title} className="w-full h-56 object-cover" />
                  <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-10 transition-opacity duration-300"></div>
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <p className="text-sm text-gold-600 font-semibold mb-2">{post.category}</p>
                  <h3 className="text-xl font-bold text-gray-800 mb-3">{post.title}</h3>
                  <p className="text-gray-600 mb-4 flex-grow h-20 overflow-hidden text-ellipsis">{post.excerpt}</p>
                  <div className="mt-auto pt-4 border-t border-gray-100">
                    <span className="text-gold-600 font-semibold group-hover:text-darkGold-600 transition-colors duration-300 flex items-center">
                      Leer más <ArrowRightIcon className="h-5 w-5 ml-2 transform group-hover:translate-x-1 transition-transform duration-300" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          <div className="text-center mt-16">
            <Link to="/blog">
              <button className="bg-gold-600 hover:bg-darkGold-600 text-white font-bold py-3 px-8 rounded-lg shadow-lg transition-transform transform hover:scale-105">
                Visita Nuestro Blog
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl">
              Experiencias que Inspiran Aroma
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-600">
              La opinión de nuestros clientes es nuestro mayor orgullo.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                quote:
                  "Increíbles fragancias y excelente servicio. Jiovanni Go nunca decepciona.",
                name: "Carlos Mendoza",
                avatar: "/testimonial-1.jpeg",
                rating: 5,
              },
              {
                quote:
                  "Cada aroma es único y de alta calidad. No puedo recomendarlo lo suficiente. ¡Mi nueva marca favorita!",
                name: "Laura Fernández",
                avatar: "/testimonial-2.jpeg",
                rating: 5,
              },
              {
                quote:
                  "Desde que descubrí Jiovanni Go, no he vuelto a otra marca. Simplemente los mejores en el mercado.",
                name: "Javier Gómez",
                avatar: "/testimonial-3.jpeg",
                rating: 5,
              },
            ].map((testimonial, index) => (
              <div
                key={index}
                className="bg-gray-50 shadow-lg rounded-xl p-8 text-center flex flex-col items-center transition-transform transform hover:scale-105 hover:shadow-2xl duration-300"
              >
                <img
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  className="w-24 h-24 rounded-full mb-4 object-cover shadow-md bg-gray-200"
                  onError={handleAvatarError}
                />
                <div className="flex justify-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <img
                      key={i}
                      src={StarIcon}
                      alt="star"
                      className="w-5 h-5"
                    />
                  ))}
                </div>
                <p className="text-gray-600 italic mb-4 flex-grow">
                  "{testimonial.quote}"
                </p>
                <h3 className="text-lg font-bold text-gray-900">
                  - {testimonial.name}
                </h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="cta-section py-16 bg-gold-500">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-extrabold text-white mb-4">
            Descubre tu aroma perfecto
          </h2>
          <p className="text-lg text-white mb-8">
            Explora nuestra amplia gama de fragancias y encuentra la que mejor
            se adapte a tu estilo.
          </p>
          <button
            className="bg-white text-gold-600 font-bold py-3 px-6 rounded shadow-lg transition-transform transform hover:scale-105"
            onClick={() => setIsModalOpen(true)}
          >
            Comienza Ahora
          </button>
        </div>
      </section>

      {/* Selection Modal */}
      <SelectionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
      {/* Footer profesional */}
      <footer className="bg-gray-900 text-gray-200 text-center py-6 mt-12">
        © {new Date().getFullYear()} Jiovanni Go. Todos los derechos reservados.
      </footer>
    </div>
  );
}

export default HomePage;
