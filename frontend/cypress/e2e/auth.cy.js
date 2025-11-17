describe('Autenticación UI', () => {
  beforeEach(() => {
    cy.clearLocalStorageAndCookies();
  });

  it('UI-14: Página de login carga', () => {
    cy.visit('/login');
    cy.get('form').should('exist');
    cy.get('input[type="email"], input[name="email"]').should('exist');
    cy.get('input[type="password"], input[name="password"]').should('exist');
    cy.get('button[type="submit"]').should('exist');
  });

  it('UI-15: Página de registro carga', () => {
    cy.visit('/register');
    cy.get('form').should('exist');
    cy.get('input').should('have.length.greaterThan', 2);
  });

  it('UI-16: Login con campos vacíos muestra error', () => {
    cy.visit('/login');
    cy.get('button[type="submit"]').click();
    // Debe haber validación HTML5
    cy.get('input:invalid').should('exist');
  });

  it('UI-17: Link entre login y registro funciona', () => {
    cy.visit('/login');
    cy.contains(/registr/i).click();
    cy.url().should('include', '/register');
  });

  it('UI-18: Formulario de login se puede completar', () => {
    cy.visit('/login');
    cy.get('input[type="email"], input[name="email"]').type('test@example.com');
    cy.get('input[type="password"], input[name="password"]').type('password123');

    // Verificar que los valores se ingresaron
    cy.get('input[type="email"], input[name="email"]').should('have.value', 'test@example.com');
  });
});

describe('Navegación General', () => {
  it('UI-19: Logo redirige a home', () => {
    cy.visit('/catalogo-dama');
    cy.get('a[href="/"]').first().click();
    cy.url().should('eq', Cypress.config().baseUrl + '/');
  });

  it('UI-20: Página 404 no existe (todas las rutas deben funcionar)', () => {
    cy.visit('/');
    cy.visit('/catalogo-dama');
    cy.visit('/catalogo-varon');
    cy.visit('/contacto');
    cy.visit('/blog');
    // Todas deberían cargar sin error
  });
});
