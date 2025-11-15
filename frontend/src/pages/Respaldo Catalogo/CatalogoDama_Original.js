// frontend/src/pages/CatalogoDama.js
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
    id: "23432252",
    name: "Aroma Berlín",
    description:
      "Refleja audacia y modernidad con una fragancia explosiva de pera, grosella negra, iris, jazmín, flor de azahar del naranjo y vainilla. Si te gusta La Vie Est Belle, te encantará Aroma Berlín.",
    image:
      "/images/aroma_images/DALL·E 2024-06-03 14.07.50 - An elegant and minimalist perfume bottle with clean, modern lines. The bottle is made of transparent glass with a soft golden hue, placed on a smooth,.webp",
    price: formatPrice(Math.floor(Math.random() * 8000) + 7990),
    rating: 4.8,
    reviews: 24,
  },
  {
    id: "23432253",
    name: "Aroma Zúrich",
    description:
      "Notas frescas de limón siciliano y manzana Granny Smith se entrelazan con la seductora flor de campanilla y la sensualidad del bambú. Si te gusta DOLCE & GABBANA Light Blue, te encantará Aroma Zúrich.",
    image:
      "/images/aroma_images/DALL·E 2024-06-03 14.08.10 - An elegant and minimalist perfume bottle with clean, modern lines. The bottle is made of transparent glass with a soft golden hue, placed on a smooth,.webp",
    price: formatPrice(Math.floor(Math.random() * 8000) + 7990),
    rating: 4.5,
    reviews: 30,
  },
  {
    id: "23432254",
    name: "Aroma París",
    description:
      "Combina rosa negra, orquídea de vainilla y praliné en un abrazo cálido y envolvente. Perfecto para noches románticas. Si te gusta La Nuit Trésor, te encantará Aroma París.",
    image:
      "/images/aroma_images/DALL·E 2024-06-03 14.08.11 - An elegant and minimalist perfume bottle with clean, modern lines. The bottle is made of transparent glass with a soft golden hue, placed on a smooth,.webp",
    price: formatPrice(Math.floor(Math.random() * 8000) + 7990),
    rating: 4.7,
    reviews: 45,
  },
  {
    id: "23432255",
    name: "Aroma Riviera",
    description:
      "Notas de ylang-ylang, jazmín de Grasse y sándalo crean un aroma fresco y cautivador. Si te gusta CHANEL Nº5, te encantará Aroma Riviera.",
    image:
      "/images/aroma_images/DALL·E 2024-06-03 14.08.12 - An elegant and minimalist perfume bottle with clean, modern lines. The bottle is made of transparent glass with a soft golden hue, placed on a smooth,.webp",
    price: formatPrice(Math.floor(Math.random() * 8000) + 7990),
    rating: 4.6,
    reviews: 40,
  },
  {
    id: "23432256",
    name: "Aroma Buenos Aires",
    description:
      "Captura la esencia de la ciudad que nunca duerme con notas de nardo, jazmín y haba tonka. Si te gusta GOOD GIRL de Carolina Herrera, te encantará Aroma Buenos Aires.",
    image:
      "/images/aroma_images/DALL·E 2024-06-03 14.08.13 - An elegant and minimalist perfume bottle with clean, modern lines. The bottle is made of transparent glass with a soft golden hue, placed on a smooth,.webp",
    price: formatPrice(Math.floor(Math.random() * 8000) + 7990),
    rating: 4.5,
    reviews: 38,
  },
  {
    id: "23432257",
    name: "Aroma Amalfi",
    description:
      "Combina notas de limón primofiore, jazmín de agua y cedro, creando un aroma luminoso y energizante. Perfecto para días soleados y aventuras al aire libre. Si te gusta ACQUA di GIOIA, te encantará Aroma Amalfi.",
    image:
      "/images/aroma_images/DALL·E 2024-06-03 14.08.15 - An elegant and minimalist perfume bottle with clean, modern lines. The bottle is made of transparent glass with a soft golden hue, placed on a smooth,.webp",
    price: formatPrice(Math.floor(Math.random() * 8000) + 7990),
    rating: 4.4,
    reviews: 32,
  },
  {
    id: "23432258",
    name: "Aroma Manhattan",
    description:
      "Combina notas de manzana verde, pepino y magnolia, creando un aroma fresco y moderno. Si te gusta BE DELICIOUS, te encantará Aroma Manhattan.",
    image:
      "/images/aroma_images/DALL·E 2024-06-03 14.08.16 - An elegant and minimalist perfume bottle with clean, modern lines. The bottle is made of transparent glass with a soft golden hue, placed on a smooth,.webp",
    price: formatPrice(Math.floor(Math.random() * 8000) + 7990),
    rating: 4.5,
    reviews: 29,
  },
  {
    id: "23432259",
    name: "Aroma Ibiza",
    description:
      "Combina nectarina, grosella negra y almizcle, evocando noches interminables y aventuras inolvidables. Si te gusta CAN CAN, te encantará Aroma Ibiza.",
    image:
      "/images/aroma_images/DALL·E 2024-06-03 14.08.17 - An elegant and minimalist perfume bottle with clean, modern lines. The bottle is made of transparent glass with a soft golden hue, placed on a smooth,.webp",
    price: formatPrice(Math.floor(Math.random() * 8000) + 7990),
    rating: 4.3,
    reviews: 35,
  },
  {
    id: "23432260",
    name: "Aroma Tokio",
    description:
      "Evoca la intensidad de la vida nocturna con notas de bergamota, pimienta rosa y sándalo. Si te gusta 212 SEXI, te encantará Aroma Tokio.",
    image:
      "/images/aroma_images/DALL·E 2024-06-03 14.08.48 - An elegant and minimalist perfume bottle with clean, modern lines. The bottle is made of transparent glass with a soft golden hue, placed on a smooth,.webp",
    price: formatPrice(Math.floor(Math.random() * 8000) + 7990),
    rating: 4.6,
    reviews: 42,
  },
  {
    id: "23432261",
    name: "Aroma Atenas",
    description:
      "Combina notas de mandarina verde, jazmín de agua y vainilla salada, creando un aroma poderoso y seductor. Si te gusta OLYMPEA, te encantará Aroma Atenas.",
    image:
      "/images/aroma_images/DALL·E 2024-06-03 18.20.08 - An elegant and minimalist perfume bottle with clean, modern lines and a slightly feminine touch. The bottle is made of transparent glass with a soft g.webp",
    price: formatPrice(Math.floor(Math.random() * 8000) + 7990),
    rating: 4.7,
    reviews: 50,
  },
  {
    id: "23432262",
    name: "Aroma Barcelona",
    description:
      "Combina notas de bergamota, agua de rosas y cuero, creando un aroma cálido y envolvente. Si te gusta CH, te encantará Aroma Barcelona.",
    image:
      "/images/aroma_images/DALL·E 2024-06-03 18.20.10 - An elegant and minimalist perfume bottle with clean, modern lines and a slightly feminine touch. The bottle is made of transparent glass with a soft g.webp",
    price: formatPrice(Math.floor(Math.random() * 8000) + 7990),
    rating: 4.4,
    reviews: 34,
  },
  {
    id: "23432263",
    name: "Aroma Milano",
    description:
      "Combina la frescura de la flor de azahar con la calidez de la vainilla de Madagascar y el almizcle blanco. Si te gusta GIORGIO ARMANI MY WAY, te encantará Aroma Milano.",
    image:
      "/images/aroma_images/DALL·E 2024-06-03 18.20.11 - An elegant and minimalist perfume bottle with clean, modern lines and a slightly feminine touch. The bottle is made of transparent glass with a soft g.webp",
    price: formatPrice(Math.floor(Math.random() * 8000) + 7990),
    rating: 4.5,
    reviews: 40,
  },
  {
    id: "23432264",
    name: "Aroma Venecia",
    description:
      "Mezcla de bergamota, almizcle blanco y flor de azahar, creando una fragancia etérea y seductora. Si te gusta VERSACE CRYSTAL NOIR, te encantará Aroma Venecia.",
    image:
      "/images/aroma_images/DALL·E 2024-06-03 18.20.13 - An elegant and minimalist perfume bottle with clean, modern lines and a slightly feminine touch. The bottle is made of transparent glass with a soft g.webp",
    price: formatPrice(Math.floor(Math.random() * 8000) + 7990),
    rating: 4.6,
    reviews: 43,
  },
  {
    id: "23432265",
    name: "Aroma Praga",
    description:
      "Una mezcla celestial de pera, bergamota y almizcle blanco, evoca la majestuosidad de Praga. Si te gusta BURBERRY HER, te encantará Aroma Praga.",
    image:
      "/images/aroma_images/DALL·E 2024-06-03 18.26.58 - An elegant and minimalist perfume bottle with clean, modern lines and a slightly feminine touch. The bottle is made of transparent glass with a soft g.webp",
    price: formatPrice(Math.floor(Math.random() * 8000) + 7990),
    rating: 4.7,
    reviews: 49,
  },
  {
    id: "23432266",
    name: "Aroma Bruselas",
    description:
      "Una fragancia moderna y audaz con notas de frambuesa, peonía y almizcle blanco. Si te gusta COACH NEW YORK, te encantará Aroma Bruselas.",
    image:
      "/images/aroma_images/DALL·E 2024-06-03 18.26.59 - An elegant and minimalist perfume bottle with clean, modern lines and a slightly feminine touch. The bottle is made of transparent glass with a soft g.webp",
    price: formatPrice(Math.floor(Math.random() * 8000) + 7990),
    rating: 4.5,
    reviews: 31,
  },
  {
    id: "23432267",
    name: "Aroma Lisboa",
    description:
      "Refleja la elegancia y sofisticación con notas de bergamota, jazmín y sándalo. Si te gusta JIMMY CHOO, te encantará Aroma Lisboa.",
    image:
      "/images/aroma_images/DALL·E 2024-06-03 18.27.01 - An elegant and minimalist perfume bottle with clean, modern lines and a slightly feminine touch. The bottle is made of transparent glass with a soft g.webp",
    price: formatPrice(Math.floor(Math.random() * 8000) + 7990),
    rating: 4.6,
    reviews: 41,
  },
  {
    id: "23432268",
    name: "Aroma Estocolmo",
    description:
      "Una fragancia vibrante con notas de manzana verde, lirio de los valles y almizcle blanco. Si te gusta DKNY BE DELICIOUS, te encantará Aroma Estocolmo.",
    image:
      "/images/aroma_images/DALL·E 2024-06-03 18.31.45 - An elegant and minimalist perfume bottle with clean, modern lines and a slightly feminine touch. The bottle is made of transparent glass with a soft g.webp",
    price: formatPrice(Math.floor(Math.random() * 8000) + 7990),
    rating: 4.7,
    reviews: 48,
  },
  {
    id: "23432269",
    name: "Aroma Londres",
    description:
      "Una fragancia potente y distintiva, con notas de manzana, piña y abedul, capturando la esencia de la realeza y el poder londinense. Si te gusta Aventus For Her de Creed, te encantará Aroma Londres.",
    image:
      "/images/aroma_images/DALL·E 2024-06-03 18.31.53 - An elegant and minimalist perfume bottle with clean, modern lines and a slightly feminine touch. The bottle is made of transparent glass with a soft g.webp",
    price: formatPrice(Math.floor(Math.random() * 8000) + 7990),
    rating: 4.6,
    reviews: 47,
  },
  {
    id: "23432270",
    name: "Aroma Nueva York",
    description:
      "Audaz y energizante, esta fragancia combina notas de jengibre, mandarina y almizcle, ideal para la mujer moderna y valiente. Si te gusta 212 Heroes de Carolina Herrera, te encantará Aroma Nueva York.",
    image:
      "/images/aroma_images/DALL·E 2024-06-03 18.39.26 - An elegant and minimalist perfume bottle with clean, modern lines and a slightly feminine touch. The bottle is made of transparent glass with a soft g.webp",
    price: formatPrice(Math.floor(Math.random() * 8000) + 7990),
    rating: 4.5,
    reviews: 39,
  },
  {
    id: "23432271",
    name: "Aroma Madrid",
    description:
      "Una fragancia moderna y urbana, con notas de gardenia, almizcle y sándalo, diseñada para la mujer cosmopolita. Si te gusta 212 de Carolina Herrera, te encantará Aroma Madrid.",
    image:
      "/images/aroma_images/DALL·E 2024-06-03 14.07.50 - An elegant and minimalist perfume bottle with clean, modern lines. The bottle is made of transparent glass with a soft golden hue, placed on a smooth,.webp",
    price: formatPrice(Math.floor(Math.random() * 8000) + 7990),
    rating: 4.7,
    reviews: 52,
  },
  {
    id: "23432272",
    name: "Aroma Kyoto",
    description:
      "Delicada y romántica, con notas de violeta, rosa y almizcle blanco, evocando la belleza de la naturaleza. Si te gusta Flower by Kenzo, te encantará Aroma Kyoto.",
    image:
      "/images/aroma_images/DALL·E 2024-06-03 14.08.10 - An elegant and minimalist perfume bottle with clean, modern lines. The bottle is made of transparent glass with a soft golden hue, placed on a smooth,.webp",
    price: formatPrice(Math.floor(Math.random() * 8000) + 7990),
    rating: 4.4,
    reviews: 33,
  },
  {
    id: "23432273",
    name: "Aroma Roma",
    description:
      "Seductora y provocativa, esta fragancia combina notas de grosella negra, regaliz y vainilla, ideal para la mujer que disfruta de la vida. Si te gusta Be Tempted de DKNY, te encantará Aroma Roma.",
    image:
      "/images/aroma_images/DALL·E 2024-06-03 14.08.11 - An elegant and minimalist perfume bottle with clean, modern lines. The bottle is made of transparent glass with a soft golden hue, placed on a smooth,.webp",
    price: formatPrice(Math.floor(Math.random() * 8000) + 7990),
    rating: 4.6,
    reviews: 36,
  },
  {
    id: "23432274",
    name: "Aroma Miami",
    description:
      "Elegante y sofisticada, con notas de bergamota, limón y sándalo, perfecta para cualquier ocasión. Si te gusta Carolina Herrera de Carolina Herrera, te encantará Aroma Miami.",
    image:
      "/images/aroma_images/DALL·E 2024-06-03 14.08.12 - An elegant and minimalist perfume bottle with clean, modern lines. The bottle is made of transparent glass with a soft golden hue, placed on a smooth,.webp",
    price: formatPrice(Math.floor(Math.random() * 8000) + 7990),
    rating: 4.5,
    reviews: 29,
  },
  {
    id: "23432275",
    name: "Aroma Viena",
    description:
      "Una fragancia que captura la fuerza y el carácter, con notas de manzana, piña y abedul. Ideal para la mujer segura de sí misma. Si te gusta Aventus For Her de Creed, te encantará Aroma Viena.",
    image:
      "/images/aroma_images/DALL·E 2024-06-03 14.08.13 - An elegant and minimalist perfume bottle with clean, modern lines. The bottle is made of transparent glass with a soft golden hue, placed on a smooth,.webp",
    price: formatPrice(Math.floor(Math.random() * 8000) + 7990),
    rating: 4.7,
    reviews: 45,
  },
];

const CatalogoDama = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPerfume, setSelectedPerfume] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [perfumes, setPerfumes] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const products = await getProducts("dama");
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
          Catálogo de Aromas para Dama
        </h1>
        <div className="relative mb-8">
          <input
            className="bg-zinc-200 text-zinc-600 font-mono ring-1 ring-zinc-400 focus:ring-2 focus:ring-gold-600 outline-none duration-300 placeholder:text-zinc-600 placeholder:opacity-50 rounded-full px-4 py-1 shadow-md focus:shadow-lg focus:shadow-gold-600"
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

CatalogoDama.propTypes = {
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

export default CatalogoDama;
