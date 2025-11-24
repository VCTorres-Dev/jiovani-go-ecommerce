import axios from 'axios';

const setAuthToken = token => {
  console.log('====================================');
  console.log('[setAuthToken] 🔧 Función llamada');
  console.log('====================================');

  if (token) {
    console.log('[setAuthToken] ✅ Token recibido:', token.substring(0, 20) + '...');
    console.log('[setAuthToken] 📝 Configurando axios.defaults.headers.common["Authorization"]');

    // Apply authorization token to every request if logged in
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    console.log('[setAuthToken] ✅ Header configurado exitosamente');
    console.log('[setAuthToken] 🔍 Verificando:', axios.defaults.headers.common['Authorization'] ? '✅ Header existe' : '❌ Header NO existe');
  } else {
    console.log('[setAuthToken] ⚠️ Token es NULL/undefined → Eliminando header');

    // Delete auth header
    delete axios.defaults.headers.common['Authorization'];

    console.log('[setAuthToken] ✅ Header Authorization eliminado');
    console.log('[setAuthToken] 🔍 Verificando:', !axios.defaults.headers.common['Authorization'] ? '✅ Header eliminado' : '❌ Header AÚN existe');
  }

  console.log('[setAuthToken] 📊 Estado actual de headers comunes:', Object.keys(axios.defaults.headers.common));
  console.log('====================================\n');
};

export default setAuthToken;
