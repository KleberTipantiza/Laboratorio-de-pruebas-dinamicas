function validarNumero(valor, nombre) {
  if (typeof valor !== 'number' || !Number.isFinite(valor)) {
    throw new TypeError(`${nombre} debe ser un número finito`);
  }
}

function calcularTotal(precio, cantidad, descuento) {
  validarNumero(precio, 'precio');
  validarNumero(cantidad, 'cantidad');
  validarNumero(descuento, 'descuento');

  if (precio < 0) {
    throw new RangeError('El precio no puede ser negativo');
  }
  if (cantidad <= 0) {
    throw new RangeError('La cantidad debe ser mayor que 0');
  }

  const subtotal = precio * cantidad;
  const valorDescuento = subtotal * descuento / 100;
  return subtotal - valorDescuento;
}
module.exports = { calcularTotal };