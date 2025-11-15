import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
} from "@nextui-org/react";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import DejoAromasLogo from "./DejoAromasLogo";
import setAuthToken from "../utils/setAuthToken";
import { useCart } from "../context/CartContext";
import { FaShoppingCart } from "react-icons/fa";

export default function NavbarComponent({ user, setUser }) {
  const navigate = useNavigate();
  const { cartItems, toggleCart } = useCart();
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setAuthToken(null); // Clear auth header from axios
    setUser(null);
    navigate("/");
  };

  return (
    <Navbar shouldHideOnScroll variant="sticky" className="bg-white shadow-md">
      <NavbarBrand>
        <RouterLink to="/" className="flex items-center">
          <DejoAromasLogo />
          <p className="font-bold text-lg ml-2">Jiovanni Go</p>
        </RouterLink>
      </NavbarBrand>
      <NavbarContent className="hidden sm:flex gap-6" justify="center">
        <NavbarItem>
          <RouterLink
            to="/"
            className="text-lg hover:text-accent transition-colors duration-200"
          >
            Home
          </RouterLink>
        </NavbarItem>
        <NavbarItem>
          <RouterLink
            to="/catalogo-dama"
            className="text-lg hover:text-accent transition-colors duration-200"
          >
            Catálogo Dama
          </RouterLink>
        </NavbarItem>
        <NavbarItem>
          <RouterLink
            to="/catalogo-varon"
            className="text-lg hover:text-accent transition-colors duration-200"
          >
            Catálogo Varón
          </RouterLink>
        </NavbarItem>
        <NavbarItem>
          <RouterLink
            to="/contacto"
            className="text-lg hover:text-accent transition-colors duration-200"
          >
            Contacto
          </RouterLink>
        </NavbarItem>
        <NavbarItem>
          <RouterLink
            to="/blog"
            className="text-lg hover:text-accent transition-colors duration-200"
          >
            Blog
          </RouterLink>
        </NavbarItem>
        {/* Admin Panel Link */}
        {user && user.role === 'admin' && (
          <NavbarItem>
            <RouterLink
              to="/admin/dashboard"
              className="text-lg font-semibold text-gold hover:text-yellow-600 transition-colors duration-200"
            >
              Panel Admin
            </RouterLink>
          </NavbarItem>
        )}
      </NavbarContent>
      <NavbarContent justify="end">
        <NavbarItem>
          <div style={{ position: 'relative', display: 'inline-flex' }}>
            <button onClick={toggleCart} className="text-2xl text-gray-600 hover:text-accent transition-colors">
              <FaShoppingCart />
            </button>
            {totalItems > 0 && (
              <span 
                style={{
                  position: 'absolute',
                  top: '-5px',
                  right: '-8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  backgroundColor: '#f31260',
                  color: 'white',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  border: '2px solid white'
                }}
              >
                {totalItems}
              </span>
            )}
          </div>
        </NavbarItem>
        {user ? (
          <>
            <NavbarItem className="hidden lg:flex">
              <span className="text-gray-600">Hola, {user.username}</span>
            </NavbarItem>
            <NavbarItem>
              <button
                onClick={handleLogout}
                className="group flex items-center justify-start w-11 h-11 bg-red-600 rounded-full cursor-pointer relative overflow-hidden transition-all duration-200 shadow-lg hover:w-32 hover:rounded-lg active:translate-x-1 active:translate-y-1"
              >
                <div className="flex items-center justify-center w-full transition-all duration-300 group-hover:justify-start group-hover:px-3">
                  <svg className="w-4 h-4" viewBox="0 0 512 512" fill="white">
                    <path d="M377.9 105.9L500.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L377.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1-128 0c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM160 96L96 96c-17.7 0-32 14.3-32 32l0 256c0 17.7 14.3 32 32 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c-53 0-96-43-96-96L0 128C0 75 43 32 96 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32z"></path>
                  </svg>
                </div>
                <div className="absolute right-5 transform translate-x-full opacity-0 text-white text-lg font-semibold transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100">
                  Logout
                </div>
              </button>
            </NavbarItem>
          </>
        ) : (
          <NavbarItem>
            <button
              onClick={() => navigate("/login")}
              className="relative px-8 py-2 rounded-md bg-white border-2 border-yellow-500 overflow-hidden group"
            >
              <span className="absolute w-full h-full top-0 left-0 bg-yellow-500 transition-all duration-700 transform -translate-x-full group-hover:translate-x-0"></span>
              <span className="relative z-10 text-yellow-500 group-hover:text-white">
                Iniciar Sesión
              </span>
            </button>
          </NavbarItem>
        )}
      </NavbarContent>
    </Navbar>
  );
}
