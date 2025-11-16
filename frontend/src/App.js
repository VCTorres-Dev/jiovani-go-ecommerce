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
      const token = localStorage.getItem('token');
      try {
        if (token) {
          setAuthToken(token);
          const apiBase = process.env.REACT_APP_API_URL || "http://localhost:5000/api";
          const res = await axios.get(`${apiBase}/auth/user`);
          // El backend retorna { success: true, user: {...} }
          setUser(res.data.user || res.data);
        }
      } catch (err) {
        console.error('Error loading user:', err.response ? err.response.data : err.message);
        localStorage.removeItem('token');
        setAuthToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
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
