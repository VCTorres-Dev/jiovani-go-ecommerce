const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');
const Product = require("./models/Product");
const User = require("./models/User"); // Importar el modelo de Usuario
require("dotenv").config();

const perfumesDama = [
  {
    name: "Aroma Berlín",
    description:
      "Refleja audacia y modernidad con una fragancia explosiva de pera, grosella negra, iris, jazmín, flor de azahar del naranjo y vainilla. Si te gusta La Vie Est Belle, te encantará Aroma Berlín.",
    imageURL: "/images/dama_01.webp",
    price: 12990,
    rating: 4.8,
    reviews: 24,
    gender: "dama",
    stock: 100,
    tags: ["Frutal", "Floral", "Dulce"],
  },
  {
    name: "Aroma Zúrich",
    description:
      "Notas frescas de limón siciliano y manzana Granny Smith se entrelazan con la seductora flor de campanilla y la sensualidad del bambú. Si te gusta DOLCE & GABBANA Light Blue, te encantará Aroma Zúrich.",
    imageURL: "/images/dama_02.webp",
    price: 13990,
    rating: 4.5,
    reviews: 30,
    gender: "dama",
    stock: 100,
    tags: ["Cítrico", "Frutal", "Fresco"],
  },
  {
    name: "Aroma París",
    description:
      "Combina rosa negra, orquídea de vainilla y praliné en un abrazo cálido y envolvente. Perfecto para noches románticas. Si te gusta La Nuit Trésor, te encantará Aroma París.",
    imageURL: "/images/dama_03.webp",
    price: 14990,
    rating: 4.7,
    reviews: 45,
    gender: "dama",
    stock: 100,
    tags: ["Floral", "Dulce", "Oriental"],
  },
  {
    name: "Aroma Riviera",
    description:
      "Notas de ylang-ylang, jazmín de Grasse y sándalo crean un aroma fresco y cautivador. Si te gusta CHANEL Nº5, te encantará Aroma Riviera.",
    imageURL: "/images/dama_04.webp",
    price: 15990,
    rating: 4.6,
    reviews: 40,
    gender: "dama",
    stock: 100,
    tags: ["Floral", "Amaderado"],
  },
  {
    name: "Aroma Buenos Aires",
    description:
      "Captura la esencia de la ciudad que nunca duerme con notas de nardo, jazmín y haba tonka. Si te gusta GOOD GIRL de Carolina Herrera, te encantará Aroma Buenos Aires.",
    imageURL: "/images/dama_05.webp",
    price: 16990,
    rating: 4.5,
    reviews: 38,
    gender: "dama",
    stock: 100,
    tags: ["Floral", "Dulce"],
  },
  {
    name: "Aroma Amalfi",
    description:
      "Combina notas de limón primofiore, jazmín de agua y cedro, creando un aroma luminoso y energizante. Perfecto para días soleados y aventuras al aire libre. Si te gusta ACQUA di GIOIA, te encantará Aroma Amalfi.",
    imageURL: "/images/dama_06.webp",
    price: 17990,
    rating: 4.4,
    reviews: 32,
    gender: "dama",
    stock: 100,
    tags: ["Cítrico", "Fresco", "Amaderado"],
  },
  {
    name: "Aroma Manhattan",
    description:
      "Combina notas de manzana verde, pepino y magnolia, creando un aroma fresco y moderno. Si te gusta BE DELICIOUS, te encantará Aroma Manhattan.",
    imageURL: "/images/dama_07.webp",
    price: 18990,
    rating: 4.5,
    reviews: 29,
    gender: "dama",
    stock: 100,
    tags: ["Frutal", "Fresco", "Floral"],
  },
  {
    name: "Aroma Ibiza",
    description:
      "Combina nectarina, grosella negra y almizcle, evocando noches interminables y aventuras inolvidables. Si te gusta CAN CAN, te encantará Aroma Ibiza.",
    imageURL: "/images/dama_08.webp",
    price: 19990,
    rating: 4.3,
    reviews: 35,
    gender: "dama",
    stock: 100,
    tags: ["Frutal", "Dulce"],
  },
  {
    name: "Aroma Tokio",
    description:
      "Evoca la intensidad de la vida nocturna con notas de bergamota, pimienta rosa y sándalo. Si te gusta 212 SEXI, te encantará Aroma Tokio.",
    imageURL: "/images/dama_09.webp",
    price: 20990,
    rating: 4.6,
    reviews: 42,
    gender: "dama",
    stock: 100,
    tags: ["Cítrico", "Especiado", "Amaderado"],
  },
  {
    name: "Aroma Atenas",
    description:
      "Combina notas de mandarina verde, jazmín de agua y vainilla salada, creando un aroma poderoso y seductor. Si te gusta OLYMPEA, te encantará Aroma Atenas.",
    imageURL: "/images/dama_10.webp",
    price: 21990,
    rating: 4.7,
    reviews: 50,
    gender: "dama",
    stock: 100,
    tags: ["Cítrico", "Floral", "Dulce"],
  },
  {
    name: "Aroma Barcelona",
    description:
      "Combina notas de bergamota, agua de rosas y cuero, creando un aroma cálido y envolvente. Si te gusta CH, te encantará Aroma Barcelona.",
    imageURL: "/images/dama_11.webp",
    price: 22990,
    rating: 4.4,
    reviews: 34,
    gender: "dama",
    stock: 100,
    tags: ["Cítrico", "Floral", "Amaderado"],
  },
  {
    name: "Aroma Milano",
    description:
      "Combina la frescura de la flor de azahar con la calidez de la vainilla de Madagascar y el almizcle blanco. Si te gusta GIORGIO ARMANI MY WAY, te encantará Aroma Milano.",
    imageURL: "/images/dama_12.webp",
    price: 23990,
    rating: 4.5,
    reviews: 40,
    gender: "dama",
    stock: 100,
    tags: ["Floral", "Dulce", "Oriental"],
  },
  {
    name: "Aroma Venecia",
    description:
      "Mezcla de bergamota, almizcle blanco y flor de azahar, creando una fragancia etérea y seductora. Si te gusta VERSACE CRYSTAL NOIR, te encantará Aroma Venecia.",
    imageURL: "/images/dama_13.webp",
    price: 24990,
    rating: 4.6,
    reviews: 43,
    gender: "dama",
    stock: 100,
    tags: ["Floral"],
  },
  {
    name: "Aroma Praga",
    description:
      "Una mezcla celestial de pera, bergamota y almizcle blanco, evoca la majestuosidad de Praga. Si te gusta BURBERRY HER, te encantará Aroma Praga.",
    imageURL: "/images/dama_14.webp",
    price: 25990,
    rating: 4.6,
    reviews: 37,
    gender: "dama",
    stock: 100,
    tags: ["Frutal", "Cítrico", "Fresco"],
  },
  {
    name: "Aroma Bruselas",
    description:
      "Una fragancia moderna y audaz con notas de frambuesa, peonía y almizcle blanco. Si te gusta COACH NEW YORK, te encantará Aroma Bruselas.",
    imageURL: "/images/dama_15.webp",
    price: 26990,
    rating: 4.5,
    reviews: 31,
    gender: "dama",
    stock: 100,
    tags: ["Floral", "Amaderado"],
  },
  {
    name: "Aroma Lisboa",
    description:
      "Refleja la elegancia y sofisticación con notas de bergamota, jazmín y sándalo. Si te gusta JIMMY CHOO, te encantará Aroma Lisboa.",
    imageURL: "/images/dama_16.webp",
    price: 27990,
    rating: 4.7,
    reviews: 41,
    gender: "dama",
    stock: 100,
    tags: ["Cítrico", "Floral", "Amaderado"],
  },
  {
    name: "Aroma Estocolmo",
    description:
      "Una fragancia vibrante con notas de manzana verde, lirio de los valles y almizcle blanco. Si te gusta DKNY BE DELICIOUS, te encantará Aroma Estocolmo.",
    imageURL: "/images/dama_17.webp",
    price: 28990,
    rating: 4.8,
    reviews: 44,
    gender: "dama",
    stock: 100,
    tags: ["Dulce", "Oriental"],
  },
  {
    name: "Aroma Londres",
    description:
      "Una fragancia potente y distintiva, con notas de manzana, piña y abedul, capturando la esencia de la realeza y el poder londinense. Si te gusta Aventus For Her de Creed, te encantará Aroma Londres.",
    imageURL: "/images/dama_18.webp",
    price: 29990,
    rating: 4.6,
    reviews: 47,
    gender: "dama",
    stock: 100,
    tags: ["Frutal", "Floral", "Amaderado"],
  },
  {
    name: "Aroma Nueva York",
    description:
      "Audaz y energizante, esta fragancia combina notas de jengibre, mandarina y almizcle, ideal para la mujer moderna y valiente. Si te gusta 212 Heroes de Carolina Herrera, te encantará Aroma Nueva York.",
    imageURL: "/images/dama_19.webp",
    price: 30990,
    rating: 4.5,
    reviews: 39,
    gender: "dama",
    stock: 100,
    tags: ["Audaz", "Energizante", "Cítrico"],
  },
];

const perfumesVaron = [
  {
    name: "Aroma Apolo",
    description:
      "Refinado y elegante, con notas de sándalo, cardamomo y lavanda. Inspirado en Bleu de Chanel.",
    imageURL: "/images/varon_01.webp",
    price: 12990,
    rating: 4.8,
    reviews: 22,
    gender: "varon",
    stock: 100,
    tags: ["Amaderado", "Especiado", "Fresco"],
  },
  {
    name: "Aroma Zeus",
    description:
      "Poderoso e imponente, con notas de cuero, tabaco y ámbar. Inspirado en Dior Homme Intense.",
    imageURL: "/images/varon_02.webp",
    price: 13990,
    rating: 4.7,
    reviews: 30,
    gender: "varon",
    stock: 100,
    tags: ["Amaderado", "Oriental"],
  },
  {
    name: "Aroma Poseidón",
    description:
      "Fresco y marino, con notas de bergamota, neroli y cedro. Inspirado en Acqua di Giò.",
    imageURL: "/images/varon_03.webp",
    price: 14990,
    rating: 4.6,
    reviews: 28,
    gender: "varon",
    stock: 100,
    tags: ["Fresco", "Cítrico", "Amaderado"],
  },
  {
    name: "Aroma Ares",
    description:
      "Misterioso y magnético, con notas de incienso, pimienta negra y cuero. Inspirado en Tom Ford Oud Wood.",
    imageURL: "/images/varon_04.webp",
    price: 15990,
    rating: 4.8,
    reviews: 25,
    gender: "varon",
    stock: 100,
    tags: ["Especiado", "Oriental", "Amaderado"],
  },
  {
    name: "Aroma Thor",
    description:
      "Enérgico y fresco, con notas de bergamota, cedro y vetiver. Inspirado en Acqua di Parma Colonia.",
    imageURL: "/images/varon_05.webp",
    price: 16990,
    rating: 4.5,
    reviews: 23,
    gender: "varon",
    stock: 100,
    tags: ["Cítrico", "Fresco", "Amaderado"],
  },
  {
    name: "Aroma Odín",
    description:
      "Sabio y profundo, con notas de musgo de roble, pachulí y ámbar. Inspirado en Terre d'Hermès.",
    imageURL: "/images/varon_06.webp",
    price: 17990,
    rating: 4.7,
    reviews: 26,
    gender: "varon",
    stock: 100,
    tags: ["Amaderado", "Oriental", "Tierra"],
  },
  {
    name: "Aroma Loki",
    description:
      "Juguetón y travieso, con notas de jengibre, cardamomo y pimienta. Inspirado en Spicebomb.",
    imageURL: "/images/varon_07.webp",
    price: 18990,
    rating: 4.6,
    reviews: 24,
    gender: "varon",
    stock: 100,
    tags: ["Especiado", "Fresco"],
  },
  {
    name: "Aroma Vulcano",
    description:
      "Intenso y robusto, con notas de cuero, tabaco y especias. Inspirado en Bvlgari Man in Black.",
    imageURL: "/images/varon_08.webp",
    price: 19990,
    rating: 4.8,
    reviews: 29,
    gender: "varon",
    stock: 100,
    tags: ["Amaderado", "Especiado", "Oriental"],
  },
  {
    name: "Aroma Helios",
    description:
      "Luminoso y cálido, con notas de ámbar, almendra y vainilla. Inspirado en Jean Paul Gaultier Le Male.",
    imageURL: "/images/varon_09.webp",
    price: 20990,
    rating: 4.7,
    reviews: 28,
    gender: "varon",
    stock: 100,
    tags: ["Dulce", "Oriental"],
  },
  {
    name: "Aroma Ícaro",
    description:
      "Aventurero y audaz, con notas de menta, lavanda y notas marinas. Inspirado en Invictus.",
    imageURL: "/images/varon_10.webp",
    price: 21990,
    rating: 4.5,
    reviews: 25,
    gender: "varon",
    stock: 100,
    tags: ["Fresco", "Aromático"],
  },
  {
    name: "Aroma Narciso",
    description:
      "Elegante y seductor, con notas de rosa, jazmín y almizcle. Inspirado en Dior Homme.",
    imageURL: "/images/varon_11.webp",
    price: 22990,
    rating: 4.6,
    reviews: 27,
    gender: "varon",
    stock: 100,
    tags: ["Floral", "Almizclado"],
  },
  {
    name: "Aroma Atlas",
    description:
      "Vigoroso y fuerte, con notas de pomelo, vetiver y pimienta. Inspirado en Versace Dylan Blue.",
    imageURL: "/images/varon_12.webp",
    price: 23990,
    rating: 4.8,
    reviews: 31,
    gender: "varon",
    stock: 100,
    tags: ["Cítrico", "Fresco", "Especiado"],
  },
  {
    name: "Aroma Dionisio",
    description:
      "Exuberante y sensual, con notas de higo, vino tinto y maderas. Inspirado en Narciso Rodriguez for Him.",
    imageURL: "/images/varon_13.webp",
    price: 24990,
    rating: 4.6,
    reviews: 22,
    gender: "varon",
    stock: 100,
    tags: ["Frutal", "Amaderado"],
  },
  {
    name: "Aroma Morfeo",
    description:
      "Relajante y suave, con notas de lavanda, sándalo y manzanilla. Inspirado en Prada L'Homme.",
    imageURL: "/images/varon_14.webp",
    price: 25990,
    rating: 4.7,
    reviews: 26,
    gender: "varon",
    stock: 100,
    tags: ["Aromático", "Amaderado"],
  },
  {
    name: "Aroma Cronos",
    description:
      "Tierra y especias, con notas de canela, sándalo y almizcle. Inspirado en Givenchy Gentleman.",
    imageURL: "/images/varon_15.webp",
    price: 26990,
    rating: 4.8,
    reviews: 27,
    gender: "varon",
    stock: 100,
    tags: ["Especiado", "Amaderado", "Oriental"],
  },
  {
    name: "Aroma Orfeo",
    description:
      "Elegante y misterioso, con notas de violeta, vetiver y cuero. Similar a Yves Saint Laurent La Nuit de L'Homme.",
    imageURL: "/images/varon_16.webp",
    price: 27990,
    rating: 4.7,
    reviews: 24,
    gender: "varon",
    stock: 100,
    tags: ["Floral", "Amaderado"],
  },
  {
    name: "Aroma Hefesto",
    description:
      "Fuerte y robusto, con notas de cuero, tabaco y maderas. Inspirado en Gucci Guilty Absolute.",
    imageURL: "/images/varon_17.webp",
    price: 28990,
    rating: 4.6,
    reviews: 26,
    gender: "varon",
    stock: 100,
    tags: ["Amaderado", "Oriental"],
  },
  {
    name: "Aroma Artemisa",
    description:
      "Fresco y revitalizante, con notas de cítricos, menta y madera. Similar a Dolce & Gabbana Light Blue.",
    imageURL: "/images/varon_18.webp",
    price: 29990,
    rating: 4.5,
    reviews: 21,
    gender: "varon",
    stock: 100,
    tags: ["Cítrico", "Fresco", "Amaderado"],
  },
  {
    name: "Aroma Perseo",
    description:
      "Valiente y audaz, con notas de cuero, tabaco y especias. Inspirado en Tom Ford Noir.",
    imageURL: "/images/varon_19.webp",
    price: 30990,
    rating: 4.7,
    reviews: 25,
    gender: "varon",
    stock: 100,
    tags: ["Amaderado", "Especiado", "Oriental"],
  },
  {
    name: "Aroma Hades",
    description:
      "Oscuro y misterioso, con notas de incienso, cuero y especias. Similar a Amouage Jubilation XXV.",
    imageURL: "/images/varon_20.webp",
    price: 31990,
    rating: 4.6,
    reviews: 28,
    gender: "varon",
    stock: 100,
    tags: ["Oriental", "Especiado"],
  },
  {
    name: "Aroma Júpiter",
    description:
      "Majestuoso y poderoso, con notas de incienso, cuero y ámbar. Inspirado en Clive Christian X for Men.",
    imageURL: "/images/varon_21.webp",
    price: 32990,
    rating: 4.8,
    reviews: 30,
    gender: "varon",
    stock: 100,
    tags: ["Oriental", "Amaderado"],
  },
  {
    name: "Aroma Hermes",
    description:
      "Elegante y sofisticado, con notas de vetiver, madera de cedro y musgo de roble. Similar a Creed Aventus.",
    imageURL: "/images/varon_22.webp",
    price: 33990,
    rating: 4.7,
    reviews: 27,
    gender: "varon",
    stock: 100,
    tags: ["Amaderado", "Fresco"],
  },
  {
    name: "Aroma Aquiles",
    description:
      "Valiente y heroico, con notas de cuero, tabaco y especias. Inspirado en Ralph Lauren Polo Red.",
    imageURL: "/images/varon_23.webp",
    price: 34990,
    rating: 4.8,
    reviews: 29,
    gender: "varon",
    stock: 100,
    tags: ["Amaderado", "Especiado", "Oriental"],
  },
  {
    name: "Aroma Marte",
    description:
      "Intenso y ardiente, con notas de pimienta, cuero y madera. Similar a Guerlain L'Homme Ideal.",
    imageURL: "/images/varon_24.webp",
    price: 35990,
    rating: 4.6,
    reviews: 32,
    gender: "varon",
    stock: 100,
    tags: ["Especiado", "Amaderado"],
  },
];

const importData = async () => {
  try {
    // Conectar a MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB conectado para el seeder...");

    // Limpiar datos existentes
    await Product.deleteMany();
    console.log("Productos existentes eliminados.");
    await User.deleteMany();
    console.log("Usuarios existentes eliminados.");

    // Crear usuario administrador
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);

    const adminUser = new User({
      username: 'admin',
      email: 'admin@dejoaromas.com',
      password: hashedPassword,
      role: 'admin'
    });

    await adminUser.save();
    console.log('Usuario administrador creado exitosamente.');

    // Insertar productos
    const products = [...perfumesDama, ...perfumesVaron];
    await Product.insertMany(products);
    console.log("Productos importados exitosamente!");

    console.log('¡Seeding completado!');
    process.exit();
  } catch (error) {
    console.error(`Error durante la importación de datos: ${error}`);
    process.exit(1);
  }
};

importData();
