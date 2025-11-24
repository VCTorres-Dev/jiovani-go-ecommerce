import React, { useState, useEffect, Suspense, lazy } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import NavbarComponent from "./components/Navbar";
import AdminRoute from "./components/AdminRoute";
import setAuthToken from './utils/setAuthToken';
import axios from 'axios';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Register from './components/Register';
import Login from './components/Login';
import Cart from './components/Cart';
import "./App.css";

// Lazy load page components for code splitting
const HomePage = lazy(() => import("./pages/HomePage"));
const CatalogoDama = lazy(() => import("./pages/CatalogoDama"));
const CatalogoVaron = lazy(() => import("./pages/CatalogoVaron"));
const ContactPage = lazy(() => import("./pages/ContactPage"));
const PaymentResult = lazy(() => import("./pages/PaymentResult"));
const PaymentSimulate = lazy(() => import("./pages/PaymentSimulate"));

// Lazy load admin page components
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const ProductListAdmin = lazy(() => import('./pages/admin/ProductListAdmin'));
const UserListAdmin = lazy(() => import('./pages/admin/UserListAdmin'));
const AddProduct = lazy(() => import('./pages/admin/AddProduct'));
const EditProduct = lazy(() => import('./pages/admin/EditProduct'));
const AnalyticsPage = lazy(() => import('./pages/admin/AnalyticsPage'));
const BlogPage = lazy(() => import('./pages/BlogPage'));
const BlogPostPage = lazy(() => import('./pages/BlogPostPage'));
const MessagesPage = lazy(() => import('./pages/admin/MessagesPage'));
const MessageDetailPage = lazy(() => import('./pages/admin/MessageDetailPage'));


function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      console.log('====================================');
      console.log('[App.js] 🔄 INICIANDO loadUser()');
      console.log('====================================');

      const token = localStorage.getItem('token');
      console.log('[App.js] 🔑 Token en localStorage:', token ? `✅ EXISTE (${token.substring(0, 20)}...)` : '❌ NO EXISTE');

      try {
        if (token) {
          console.log('[App.js] 📤 Configurando header Authorization con token...');
          setAuthToken(token);
          console.log('[App.js] ✅ Header Authorization configurado');

          // NO setear user preliminar, esperar a la respuesta del backend
          // para evitar mostrar datos incompletos (sin username)

          const apiBase = process.env.REACT_APP_API_URL || process.env.REACT_APP_API_URL_REAL || "https://jiovani-go-ecommerce-production.up.railway.app/api";
          const url = `${apiBase}/auth/user`;
          console.log('[App.js] 🌐 Endpoint:', url);
          console.log('[App.js] 📡 Haciendo GET /auth/user...');

          const res = await axios.get(url);

          console.log('[App.js] ✅ RESPUESTA EXITOSA del servidor');
          console.log('[App.js] 📊 Status:', res.status);
          console.log('[App.js] 📦 Data completa:', JSON.stringify(res.data, null, 2));

          const userData = res.data.user || res.data;
          setUser(userData);

          console.log('[App.js] ✅ Usuario seteado en estado:', {
            id: userData._id || userData.id,
            username: userData.username,
            email: userData.email,
            role: userData.role
          });
        } else {
          console.log('[App.js] ⚠️ No hay token en localStorage, usuario queda como null');
          setUser(null);
        }
      } catch (err) {
        console.log('====================================');
        console.log('[App.js] ❌ ERROR al cargar usuario');
        console.log('====================================');
        console.error('[App.js] 📛 Error type:', err.name);
        console.error('[App.js] 📛 Error message:', err.message);
        console.error('[App.js] 📛 Tiene response?', !!err.response);

        if (err.response) {
          console.error('[App.js] 📛 Response status:', err.response.status);
          console.error('[App.js] 📛 Response data:', JSON.stringify(err.response.data, null, 2));
          console.error('[App.js] 📛 Response headers:', JSON.stringify(err.response.headers, null, 2));
        } else if (err.request) {
          console.error('[App.js] 📛 Request fue hecho pero no hubo respuesta');
          console.error('[App.js] 📛 Posible error de red o servidor caído');
        } else {
          console.error('[App.js] 📛 Error configurando request:', err.message);
        }

        // FIX: Solo eliminar token si es error de autenticación (401/403)
        // Si es error 500, 503 o error de red, MANTENER el token para que el próximo F5 funcione
        if (err.response && (err.response.status === 401 || err.response.status === 403)) {
          console.log('[App.js] 🚫 Token INVÁLIDO/EXPIRADO (401/403) → Cerrando sesión');
          localStorage.removeItem('token');
          setAuthToken(null);
          setUser(null);
          console.log('[App.js] 🗑️ Token eliminado de localStorage');
          console.log('[App.js] 🗑️ User seteado a null');
        } else {
          console.log('[App.js] ⚠️ Error TEMPORAL (Server/Red) → MANTENIENDO token');
          console.log('[App.js] 💾 Token se mantiene en localStorage para próximo F5');
          console.log('[App.js] ⚠️ User queda como null TEMPORALMENTE');
          // No borramos el token, pero el usuario quedará como null en esta sesión
          // hasta que recargue y el servidor responda.
        }
      } finally {
        setLoading(false);
        console.log('[App.js] ✅ loadUser FINALIZADO → loading = false');
        console.log('[App.js] 📊 Estado final:', {
          loading: false,
          user: user ? 'existe' : 'null',
          tokenEnLocalStorage: !!localStorage.getItem('token')
        });
        console.log('====================================\n');
      }
    };

    loadUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Router>
      <div>
        <NavbarComponent user={user} setUser={setUser} />
        <Cart />
        <Suspense fallback={<div>Cargando...</div>}>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/catalogo-dama" element={<CatalogoDama />} />
            <Route path="/catalogo-varon" element={<CatalogoVaron />} />
            <Route path="/contacto" element={<ContactPage />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login setUser={setUser} />} />

            {/* Payment Routes */}
            <Route path="/payment/result" element={<PaymentResult />} />
            <Route path="/payment/simulate" element={<PaymentSimulate />} />

            {/* Blog Routes */}
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/blog/:postId" element={<BlogPostPage />} />

            {/* Admin Protected Routes */}
            <Route element={<AdminRoute user={user} loading={loading} />}>
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/products" element={<ProductListAdmin />} />
              <Route path="/admin/products/add" element={<AddProduct />} />
              <Route path="/admin/products/edit/:id" element={<EditProduct />} />
              <Route path="/admin/users" element={<UserListAdmin />} />
              <Route path="/admin/analytics" element={<AnalyticsPage />} />
              <Route path="/admin/messages" element={<MessagesPage />} />
              <Route path="/admin/messages/:id" element={<MessageDetailPage />} />
              
            </Route>
          </Routes>
        </Suspense>
      </div>
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </Router>
  );
}

export default App;
