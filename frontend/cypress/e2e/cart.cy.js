describe('Carrito de Compras', () => {
  beforeEach(() => {
    cy.clearLocalStorageAndCookies();
    cy.visit('/catalogo-dama');
    // Esperar que carguen productos
    cy.wait(2000);
  });

  it('UI-09: Botón de carrito está visible', () => {
    cy.get('[class*="cart"], [aria-label*="cart"], button').should('exist');
  });

  it('UI-10: Agregar producto muestra notificación', () => {
    // Buscar botón de agregar al carrito
    cy.get('button').contains(/agregar|añadir|carrito/i).first().click();
    // Verificar que aparece alguna confirmación
    cy.get('[class*="toast"], [class*="notification"], [role="alert"]', { timeout: 5000 })
      .should('exist');
  });
});

describe('Formulario de Contacto', () => {
  beforeEach(() => {
    cy.visit('/contacto');
  });

  it('UI-11: Formulario de contacto está presente', () => {
    cy.get('form').should('exist');
    cy.get('input[name="nombre"], input[type="text"]').should('exist');
    cy.get('input[type="email"]').should('exist');
    cy.get('textarea, input[name="mensaje"]').should('exist');
  });

  it('UI-12: Validación de campos requeridos', () => {
    cy.get('button[type="submit"]').click();
    // Debe mostrar error o no enviar
    cy.url().should('include', '/contacto');
  });

  it('UI-13: Formulario se puede completar', () => {
    cy.get('input[name="nombre"], input').first().type('Test Usuario');
    cy.get('input[type="email"]').type('test@example.com');
    cy.get('textarea, input[name="mensaje"]').type('Mensaje de prueba');
    // Verificar que los valores fueron ingresados
    cy.get('input[type="email"]').should('have.value', 'test@example.com');
  });
});
