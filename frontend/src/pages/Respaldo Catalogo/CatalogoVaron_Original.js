// frontend/src/pages/CatalogoVaron.js
import React, { useState, useEffect } from "react";
import PerfumeCard from "../components/PerfumeCard";
import PerfumeDetailModal from "../components/PerfumeDetailModal";
import { getProducts } from "../services/productService";
import PropTypes from "prop-types";

const normalizeString = (str) => {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
};

const formatPrice = (price) => {
  return "$" + price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

const perfumes = [
  {
    id: "23432270",
    name: "Aroma Apolo",
    description:
      "Refinado y elegante, con notas de sándalo, cardamomo y lavanda. Inspirado en Bleu de Chanel.",
    image:
      "/images/Aroma_Varon_images/DALL·E 2024-06-15 12.54.00 - An elegant and minimalist perfume bottle with clean, modern lines and a slightly masculine touch. The bottle is made of transparent glass with a cool,.webp",
    price: formatPrice(Math.floor(Math.random() * 8000) + 7990),
    rating: 4.8,
    reviews: 28,
  },
  {
    id: "23432271",
    name: "Aroma Hércules",
    description:
      "Fresco y vibrante, con notas de pomelo, menta y mandarina roja. Similar a Versace Eros.",
    image:
      "/images/Aroma_Varon_images/DALL·E 2024-06-15 12.54.01 - An elegant and minimalist perfume bottle with clean, modern lines and a slightly masculine touch. The bottle is made of transparent glass with a cool,.webp",
    price: formatPrice(Math.floor(Math.random() * 8000) + 7990),
    rating: 4.6,
    reviews: 22,
  },
  {
    id: "23432272",
    name: "Aroma Zeus",
    description:
      "Poderoso y audaz, con notas de incienso, cuero y ámbar. Inspirado en Dior Homme.",
    image:
      "/images/Aroma_Varon_images/DALL·E 2024-06-15 12.54.03 - An elegant and minimalist perfume bottle with clean, modern lines and a slightly masculine touch. The bottle is made of transparent glass with a cool,.webp",
    price: formatPrice(Math.floor(Math.random() * 8000) + 7990),
    rating: 4.7,
    reviews: 30,
  },
  {
    id: "23432273",
    name: "Aroma Odín",
    description:
      "Misterioso y magnético, con notas de vainilla, vetiver y cuero. Similar a Tom Ford Oud Wood.",
    image:
      "/images/Aroma_Varon_images/DALL·E 2024-06-15 12.54.04 - An elegant and minimalist perfume bottle with clean, modern lines and a slightly masculine touch. The bottle is made of transparent glass with a cool,.webp",
    price: formatPrice(Math.floor(Math.random() * 8000) + 7990),
    rating: 4.8,
    reviews: 25,
  },
  {
    id: "23432274",
    name: "Aroma Thor",
    description:
      "Enérgico y fresco, con notas de bergamota, cedro y vetiver. Inspirado en Acqua di Parma Colonia.",
    image:
      "/images/Aroma_Varon_images/DALL·E 2024-06-15 12.54.06 - An elegant and minimalist perfume bottle with clean, modern lines and a slightly masculine touch. The bottle is made of transparent glass with a cool,.webp",
    price: formatPrice(Math.floor(Math.random() * 8000) + 7990),
    rating: 4.5,
    reviews: 23,
  },
  {
    id: "23432275",
    name: "Aroma Poseidón",
    description:
      "Marino y refrescante, con notas de algas marinas, sal y cítricos. Similar a Davidoff Cool Water.",
    image:
      "/images/Aroma_Varon_images/DALL·E 2024-06-15 12.54.07 - An elegant and minimalist perfume bottle with clean, modern lines and a slightly masculine touch. The bottle is made of transparent glass with a cool,.webp",
    price: formatPrice(Math.floor(Math.random() * 8000) + 7990),
    rating: 4.6,
    reviews: 21,
  },
  {
    id: "23432276",
    name: "Aroma Atenas",
    description:
      "Clásico y atemporal, con notas de lavanda, roble y almizcle. Inspirado en Paco Rabanne Pour Homme.",
    image:
      "/images/Aroma_Varon_images/DALL·E 2024-06-15 12.55.47 - An elegant and minimalist perfume bottle with clean, modern lines and a slightly masculine touch. The bottle is made of transparent glass with a cool,.webp",
    price: formatPrice(Math.floor(Math.random() * 8000) + 7990),
    rating: 4.7,
    reviews: 26,
  },
  {
    id: "23432277",
    name: "Aroma Esparta",
    description:
      "Intenso y robusto, con notas de cuero, tabaco y especias. Similar a Carolina Herrera CH Men.",
    image:
      "/images/Aroma_Varon_images/DALL·E 2024-06-15 12.55.49 - An elegant and minimalist perfume bottle with clean, modern lines and a slightly masculine touch. The bottle is made of transparent glass with a cool,.webp",
    price: formatPrice(Math.floor(Math.random() * 8000) + 7990),
    rating: 4.8,
    reviews: 29,
  },
  {
    id: "23432278",
    name: "Aroma Helios",
    description:
      "Luminoso y cálido, con notas de ámbar, almendra y vainilla. Inspirado en Jean Paul Gaultier Le Male.",
    image:
      "/images/Aroma_Varon_images/DALL·E 2024-06-15 12.55.50 - An elegant and minimalist perfume bottle with clean, modern lines and a slightly masculine touch. The bottle is made of transparent glass with a cool,.webp",
    price: formatPrice(Math.floor(Math.random() * 8000) + 7990),
    rating: 4.7,
    reviews: 28,
  },
  {
    id: "23432279",
    name: "Aroma Atlas",
    description:
      "Poderoso y vibrante, con notas de madera de cedro, sándalo y pimienta. Similar a Montblanc Explorer.",
    image:
      "/images/Aroma_Varon_images/DALL·E 2024-06-15 12.56.15 - An elegant and minimalist perfume bottle with clean, modern lines and a slightly masculine touch. The bottle is made of transparent glass with a cool,.webp",
    price: formatPrice(Math.floor(Math.random() * 8000) + 7990),
    rating: 4.6,
    reviews: 24,
  },
  {
    id: "23432280",
    name: "Aroma Minotauro",
    description:
      "Exótico y enigmático, con notas de incienso, cuero y oud. Inspirado en Amouage Interlude Man.",
    image:
      "/images/Aroma_Varon_images/DALL·E 2024-06-15 12.58.48 - An elegant and minimalist perfume bottle with clean, modern lines and a slightly masculine touch. The bottle is made of transparent glass with a cool,.webp",
    price: formatPrice(Math.floor(Math.random() * 8000) + 7990),
    rating: 4.7,
    reviews: 27,
  },
  {
    id: "23432281",
    name: "Aroma Hércules",
    description:
      "Vigoroso y fuerte, con notas de cítricos, madera de cedro y vetiver. Inspirado en Hermes Terre d'Hermes.",
    image:
      "/images/Aroma_Varon_images/DALL·E 2024-06-15 12.58.54 - An elegant and minimalist perfume bottle with clean, modern lines and a slightly masculine touch. The bottle design is modified with strong geometric .webp",
    price: formatPrice(Math.floor(Math.random() * 8000) + 7990),
    rating: 4.8,
    reviews: 31,
  },
  {
    id: "23432282",
    name: "Aroma Dionisio",
    description:
      "Exuberante y sensual, con notas de higo, vino tinto y maderas. Inspirado en Narciso Rodriguez for Him.",
    image:
      "/images/Aroma_Varon_images/DALL·E 2024-06-15 12.58.55 - An elegant and minimalist perfume bottle with clean, modern lines and a slightly masculine touch. The bottle design is modified with strong geometric .webp",
    price: formatPrice(Math.floor(Math.random() * 8000) + 7990),
    rating: 4.6,
    reviews: 22,
  },
  {
    id: "23432283",
    name: "Aroma Ares",
    description:
      "Intenso y enérgico, con notas de madera de agar, pimienta y especias. Similar a Valentino Uomo.",
    image:
      "/images/Aroma_Varon_images/DALL·E 2024-06-15 12.59.00 - An elegant and minimalist perfume bottle with clean, modern lines and a slightly masculine touch. The bottle design is modified with strong geometric .webp",
    price: formatPrice(Math.floor(Math.random() * 8000) + 7990),
    rating: 4.7,
    reviews: 30,
  },
  {
    id: "23432284",
    name: "Aroma Cronos",
    description:
      "Tierra y especias, con notas de canela, sándalo y almizcle. Inspirado en Givenchy Gentleman.",
    image:
      "/images/Aroma_Varon_images/DALL·E 2024-06-15 12.59.49 - An elegant and minimalist perfume bottle with clean, modern lines and a slightly masculine touch. The bottle design is modified with strong geometric .webp",
    price: formatPrice(Math.floor(Math.random() * 8000) + 7990),
    rating: 4.8,
    reviews: 27,
  },
  {
    id: "23432285",
    name: "Aroma Orfeo",
    description:
      "Elegante y misterioso, con notas de violeta, vetiver y cuero. Similar a Yves Saint Laurent La Nuit de L'Homme.",
    image:
      "/images/Aroma_Varon_images/DALL·E 2024-06-15 12.59.51 - An elegant and minimalist perfume bottle with clean, modern lines and a slightly masculine touch. The bottle design is modified with strong geometric .webp",
    price: formatPrice(Math.floor(Math.random() * 8000) + 7990),
    rating: 4.7,
    reviews: 24,
  },
  {
    id: "23432286",
    name: "Aroma Hefesto",
    description:
      "Fuerte y robusto, con notas de cuero, tabaco y maderas. Inspirado en Gucci Guilty Absolute.",
    image:
      "/images/Aroma_Varon_images/DALL·E 2024-06-15 13.00.04 - An elegant and minimalist perfume bottle with clean, modern lines and a slightly masculine touch. The bottle design is modified with strong geometric .webp",
    price: formatPrice(Math.floor(Math.random() * 8000) + 7990),
    rating: 4.6,
    reviews: 26,
  },
  {
    id: "23432287",
    name: "Aroma Artemisa",
    description:
      "Fresco y revitalizante, con notas de cítricos, menta y madera. Similar a Dolce & Gabbana Light Blue.",
    image:
      "/images/Aroma_Varon_images/DALL·E 2024-06-15 13.00.19 - An elegant and minimalist perfume bottle with clean, modern lines and a slightly masculine touch. The bottle design is modified with strong geometric .webp",
    price: formatPrice(Math.floor(Math.random() * 8000) + 7990),
    rating: 4.5,
    reviews: 21,
  },
  {
    id: "23432288",
    name: "Aroma Perseo",
    description:
      "Valiente y audaz, con notas de cuero, tabaco y especias. Inspirado en Tom Ford Noir.",
    image:
      "/images/Aroma_Varon_images/DALL·E 2024-06-15 13.00.37 - An elegant and minimalist perfume bottle with clean, modern lines and a slightly masculine touch. The bottle design is modified with strong geometric .webp",
    price: formatPrice(Math.floor(Math.random() * 8000) + 7990),
    rating: 4.7,
    reviews: 25,
  },
  {
    id: "23432289",
    name: "Aroma Hades",
    description:
      "Oscuro y misterioso, con notas de incienso, cuero y especias. Similar a Amouage Jubilation XXV.",
    image:
      "/images/Aroma_Varon_images/DALL·E 2024-06-15 13.10.30 - An elegant and minimalist perfume bottle with a distinctly masculine design. The bottle features strong geometric shapes and robust lines, crafted fro.webp",
    price: formatPrice(Math.floor(Math.random() * 8000) + 7990),
    rating: 4.6,
    reviews: 28,
  },
  {
    id: "23432290",
    name: "Aroma Júpiter",
    description:
      "Majestuoso y poderoso, con notas de incienso, cuero y ámbar. Inspirado en Clive Christian X for Men.",
    image:
      "/images/Aroma_Varon_images/DALL·E 2024-06-15 13.10.32 - An elegant and minimalist perfume bottle with a distinctly masculine design. The bottle features strong geometric shapes and robust lines, crafted fro.webp",
    price: formatPrice(Math.floor(Math.random() * 8000) + 7990),
    rating: 4.8,
    reviews: 30,
  },
  {
    id: "23432291",
    name: "Aroma Hermes",
    description:
      "Elegante y sofisticado, con notas de vetiver, madera de cedro y musgo de roble. Similar a Creed Aventus.",
    image:
      "/images/Aroma_Varon_images/DALL·E 2024-06-15 13.10.33 - An elegant and minimalist perfume bottle with a distinctly masculine design. The bottle features strong geometric shapes and robust lines, crafted fro.webp",
    price: formatPrice(Math.floor(Math.random() * 8000) + 7990),
    rating: 4.7,
    reviews: 27,
  },
  {
    id: "23432292",
    name: "Aroma Aquiles",
    description:
      "Valiente y heroico, con notas de cuero, tabaco y especias. Inspirado en Ralph Lauren Polo Red.",
    image:
      "/images/Aroma_Varon_images/DALL·E 2024-06-15 13.10.34 - An elegant and minimalist perfume bottle with a distinctly masculine design. The bottle features strong geometric shapes and robust lines, crafted fro.webp",
    price: formatPrice(Math.floor(Math.random() * 8000) + 7990),
    rating: 4.8,
    reviews: 29,
  },
];

const CatalogoVaron = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPerfume, setSelectedPerfume] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [perfumes, setPerfumes] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const products = await getProducts("varon");
        setPerfumes(products);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  const filteredPerfumes = perfumes.filter((perfume) =>
    normalizeString(perfume.name).includes(normalizeString(searchTerm))
  );

  const openModal = (perfume) => {
    setSelectedPerfume(perfume);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedPerfume(null);
    setIsModalOpen(false);
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-screen-xl mx-auto py-8">
        <h1 className="text-3xl font-bold text-center mb-8">
          Catálogo de Aromas para Varón
        </h1>
        <div className="relative mb-8">
          <input
            className="bg-zinc-800 text-zinc-200 font-mono ring-1 ring-zinc-700 focus:ring-2 focus:ring-blue-500 outline-none duration-300 placeholder:text-zinc-500 placeholder:opacity-50 rounded-full px-4 py-1 shadow-md focus:shadow-lg focus:shadow-blue-500"
            autoComplete="off"
            placeholder="Buscar aromas..."
            name="text"
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredPerfumes.map((perfume) => (
            <PerfumeCard
              key={perfume._id}
              perfume={perfume}
              onClick={() => openModal(perfume)}
            />
          ))}
        </div>
        <PerfumeDetailModal
          isOpen={isModalOpen}
          onClose={closeModal}
          perfume={selectedPerfume}
        />
      </div>
    </div>
  );
};

CatalogoVaron.propTypes = {
  perfumes: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      image: PropTypes.string.isRequired,
      _id: PropTypes.string.isRequired,
      price: PropTypes.string.isRequired,
      rating: PropTypes.number.isRequired,
      reviews: PropTypes.number.isRequired,
    })
  ),
};

export default CatalogoVaron;
