#!/usr/bin/env node
/**
 * Script para agregar las rutas a git y hacer push
 * Usar: node push-routes.js
 */

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

// Git path - use full path since it might not be in system PATH
const gitPath = 'C:\\Program Files\\Git\\cmd\\git.exe';
const git = (cmd) => execSync(`"${gitPath}" ${cmd}`, { encoding: 'utf-8' });

const projectRoot = __dirname;
const routesDir = path.join(projectRoot, 'backend', 'routes');

console.log('🚀 Starting git operations...\n');

try {
  // Cambiar al directorio del proyecto
  process.chdir(projectRoot);
  console.log(`✅ Working in: ${projectRoot}\n`);

  // Verificar que existe la carpeta de rutas
  if (!fs.existsSync(routesDir)) {
    throw new Error(`❌ Carpeta de rutas no encontrada: ${routesDir}`);
  }
  
  const routeFiles = fs.readdirSync(routesDir).filter(f => f.endsWith('.js'));
  console.log(`✅ Found ${routeFiles.length} route files:\n`);
  routeFiles.forEach(f => console.log(`   - ${f}`));
  console.log('');

  // Agregar la carpeta completa de rutas
  console.log('📦 Adding backend/routes/ to git...');
  git('add backend/routes/');
  console.log('✅ Routes added to git\n');

  // Verificar estado
  console.log('📋 Git status:');
  console.log(git('status --short'));

  // Hacer commit
  console.log('💾 Creating commit...');
  git('commit -m "FIX: Agregar todas las rutas de backend que faltaban (authRoutes, productRoutes, analyticsRoutes, orderRoutes, messageRoutes, paymentRoutes, userRoutes, contactRoutes)"');
  console.log('✅ Commit created\n');

  // Hacer push
  console.log('🚀 Pushing to GitHub...');
  git('push');
  console.log('✅ Push successful\n');

  console.log('🎉 ¡Éxito! Las rutas han sido agregadas a GitHub');
  console.log('⏳ Railway detectará el cambio en 30-60 segundos y redesplegará automáticamente\n');
  
} catch (error) {
  console.error('\n❌ Error during git operations:');
  console.error(error.message);
  process.exit(1);
}
