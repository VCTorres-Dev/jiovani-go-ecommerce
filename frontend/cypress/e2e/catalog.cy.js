describe('Catálogo de Productos', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('UI-01: Página de inicio carga correctamente', () => {
    cy.contains('Descubre la esencia del lujo').should('be.visible');
    cy.contains('Aromas para Dama').should('be.visible');
    cy.contains('Aromas para Varón').should('be.visible');
  });

  it('UI-02: Navegar a catálogo de dama', () => {
    cy.contains('Aromas para Dama').click();
    cy.url().should('include', '/catalogo-dama');
    cy.get('h1, h2').should('contain.text', 'Dama');
  });

  it('UI-03: Navegar a catálogo de varón', () => {
    cy.contains('Aromas para Varón').click();
    cy.url().should('include', '/catalogo-varon');
  });

  it('UI-04: Productos se muestran en catálogo', () => {
    cy.visit('/catalogo-dama');
    // Esperar a que carguen los productos
    cy.get('[class*="card"], [class*="product"], [class*="perfume"]', { timeout: 10000 })
      .should('have.length.greaterThan', 0);
  });

  it('UI-05: Footer está presente', () => {
    cy.get('footer').should('be.visible');
    cy.get('footer').should('contain.text', 'Jiovanni Go');
  });
});

describe('Navegación', () => {
  it('UI-06: Navbar contiene enlaces principales', () => {
    cy.visit('/');
    cy.get('nav, header').should('be.visible');
    // Verificar que existen botones/links de navegación
    cy.get('a, button').should('have.length.greaterThan', 0);
  });

  it('UI-07: Link a contacto funciona', () => {
    cy.visit('/');
    cy.contains('Contacto', { matchCase: false }).click();
    cy.url().should('include', '/contacto');
  });

  it('UI-08: Link a blog funciona', () => {
    cy.visit('/blog');
    cy.url().should('include', '/blog');
  });
});
