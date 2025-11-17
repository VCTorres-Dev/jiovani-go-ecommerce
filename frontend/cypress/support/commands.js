// ***********************************************
// Custom commands for JiovaniGo E2E tests
// ***********************************************

/**
 * Comando personalizado para hacer login
 * @param {string} email - Email del usuario
 * @param {string} password - Contraseña
 */
Cypress.Commands.add('login', (email, password) => {
  cy.request({
    method: 'POST',
    url: 'http://localhost:5000/api/auth/login',
    body: { email, password }
  }).then((response) => {
    window.localStorage.setItem('token', response.body.token);
  });
});

/**
 * Comando para limpiar localStorage y cookies
 */
Cypress.Commands.add('clearLocalStorageAndCookies', () => {
  cy.clearLocalStorage();
  cy.clearCookies();
});

/**
 * Comando para navegar al catálogo y agregar un producto
 */
Cypress.Commands.add('addProductToCart', () => {
  cy.visit('/catalogo-dama');
  cy.wait(2000); // Esperar que carguen los productos
  cy.get('button').contains(/agregar|añadir|carrito/i).first().click();
});
