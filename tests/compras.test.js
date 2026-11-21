const { calcularTotal } = require('../src/compras');

// Pruebas derivadas de docs/matriz-casos.md (CP-01 a CP-18).
// El ID de cada caso aparece al inicio del nombre de la prueba para mantener la trazabilidad.

describe('RF-01: subtotal = precio x cantidad', () => {
  test('CP-01: calcula el total con datos válidos y sin descuento', () => {
    expect(calcularTotal(10, 3, 0)).toBe(30);
  });

  test('CP-17: precio 0 es válido y retorna 0 (supuesto 1)', () => {
    expect(calcularTotal(0, 5, 10)).toBe(0);
  });

  test('CP-18: cantidad decimal positiva es válida (supuesto 2)', () => {
    expect(calcularTotal(10, 0.5, 0)).toBe(5);
  });
});

describe('RF-02: descuento de 0 a 100 %', () => {
  test('CP-02: aplica un descuento intermedio', () => {
    expect(calcularTotal(100, 2, 25)).toBe(150);
  });

  test('CP-03: descuento 0 no modifica el subtotal (límite inferior)', () => {
    expect(calcularTotal(50, 2, 0)).toBe(100);
  });

  test('CP-04: descuento 100 produce total 0 (límite superior)', () => {
    expect(calcularTotal(80, 3, 100)).toBe(0);
  });
});

describe('RF-03: total con dos decimales', () => {
  test('CP-05: evita errores de punto flotante (0.1 x 3)', () => {
    expect(calcularTotal(0.1, 3, 0)).toBe(0.3);
  });

  test('CP-06: redondea a dos decimales (19.99 x 3 con 15 % de descuento)', () => {
    expect(calcularTotal(19.99, 3, 15)).toBe(50.97);
  });
});

describe('RF-04: RangeError por valores fuera de rango', () => {
  test('CP-07: precio negativo', () => {
    expect(() => calcularTotal(-5, 2, 10)).toThrow(RangeError);
  });

  test('CP-08: cantidad igual a 0', () => {
    expect(() => calcularTotal(10, 0, 0)).toThrow(RangeError);
  });

  test('CP-09: cantidad negativa', () => {
    expect(() => calcularTotal(10, -1, 0)).toThrow(RangeError);
  });

  test('CP-10: descuento menor que 0', () => {
    expect(() => calcularTotal(10, 1, -1)).toThrow(RangeError);
  });

  test('CP-11: descuento mayor que 100', () => {
    expect(() => calcularTotal(10, 1, 101)).toThrow(RangeError);
  });
});

describe('RF-05: TypeError por entradas no numéricas o no finitas', () => {
  test('CP-12: string numérico no se acepta como número', () => {
    expect(() => calcularTotal('10', 2, 0)).toThrow(TypeError);
  });

  test('CP-13: null en la cantidad', () => {
    expect(() => calcularTotal(10, null, 0)).toThrow(TypeError);
  });

  test('CP-14: NaN en el precio', () => {
    expect(() => calcularTotal(NaN, 2, 0)).toThrow(TypeError);
  });

  test('CP-15: Infinity en la cantidad', () => {
    expect(() => calcularTotal(10, Infinity, 0)).toThrow(TypeError);
  });
});

describe('RF-04 y RF-05: prioridad entre errores (tabla de decisión)', () => {
  test('CP-16: el tipo se valida antes que el rango (supuesto 3)', () => {
    expect(() => calcularTotal(-5, '2', 0)).toThrow(TypeError);
  });
});
