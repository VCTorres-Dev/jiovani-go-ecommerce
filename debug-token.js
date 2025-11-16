// Script para debugging: copiar y pegar en la consola del navegador

const token = localStorage.getItem('token');
if (token) {
  console.log('🔑 Token encontrado en localStorage');
  console.log('Token completo:', token);
  
  try {
    const payload = token.split('.')[1];
    const decoded = JSON.parse(atob(payload));
    console.log('\n📦 Token decodificado:');
    console.log(JSON.stringify(decoded, null, 2));
    
    console.log('\n🔍 Extracción de datos:');
    console.log('- decoded.user?.id:', decoded.user?.id);
    console.log('- decoded.id:', decoded.id);
    console.log('- decoded.user?.email:', decoded.user?.email);
    console.log('- decoded.email:', decoded.email);
    console.log('- decoded.user?.role:', decoded.user?.role);
    console.log('- decoded.role:', decoded.role);
    console.log('- decoded.user?.username:', decoded.user?.username);
    console.log('- decoded.username:', decoded.username);
    
    if (decoded.exp) {
      const expDate = new Date(decoded.exp * 1000);
      const now = new Date();
      console.log('\n⏰ Expiración:');
      console.log('- Expira en:', expDate.toLocaleString());
      console.log('- Ahora:', now.toLocaleString());
      console.log('- ¿Expirado?:', decoded.exp * 1000 < Date.now());
    }
  } catch (err) {
    console.error('❌ Error decodificando token:', err);
  }
} else {
  console.log('❌ No hay token en localStorage');
}
