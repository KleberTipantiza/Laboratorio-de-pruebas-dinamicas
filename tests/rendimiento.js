// CP-19 / RNF-01: medición exploratoria de rendimiento de calcularTotal.
// Uso: npm run rendimiento
// No es una prueba de carga formal: mide el tiempo de ejecución local de la función aislada.

const os = require('os');
const { calcularTotal } = require('../src/compras');

const LLAMADAS = 100000; // llamadas por corrida
const CORRIDAS = 5; // corridas medidas
const CALENTAMIENTO = 20000; // llamadas previas para estabilizar el motor JIT

const entradas = [
  [10, 3, 0],
  [100, 2, 25],
  [19.99, 3, 15],
  [0.1, 3, 0],
  [80, 3, 100],
];

function medirCaminoValido() {
  let acumulado = 0; // evita que el motor descarte las llamadas
  const inicio = process.hrtime.bigint();
  for (let i = 0; i < LLAMADAS; i++) {
    const [p, c, d] = entradas[i % entradas.length];
    acumulado += calcularTotal(p, c, d);
  }
  const fin = process.hrtime.bigint();
  return { ms: Number(fin - inicio) / 1e6, acumulado };
}

function medirCaminoInvalido() {
  let errores = 0;
  const inicio = process.hrtime.bigint();
  for (let i = 0; i < LLAMADAS; i++) {
    try {
      calcularTotal(-5, 2, 10);
    } catch (e) {
      errores++;
    }
  }
  const fin = process.hrtime.bigint();
  return { ms: Number(fin - inicio) / 1e6, errores };
}

function resumir(nombre, tiempos) {
  const ordenados = [...tiempos].sort((a, b) => a - b);
  const mediana = ordenados[Math.floor(ordenados.length / 2)];
  const promedioUs = (mediana * 1000) / LLAMADAS;
  console.log(`\n${nombre}`);
  console.log(`  Tiempos por corrida (ms): ${tiempos.map((t) => t.toFixed(2)).join(', ')}`);
  console.log(`  Mínimo: ${ordenados[0].toFixed(2)} ms | Mediana: ${mediana.toFixed(2)} ms | Máximo: ${ordenados[ordenados.length - 1].toFixed(2)} ms`);
  console.log(`  Promedio por llamada (según mediana): ${promedioUs.toFixed(3)} µs`);
  console.log(`  Llamadas por segundo (según mediana): ${Math.round(LLAMADAS / (mediana / 1000)).toLocaleString('en-US')}`);
}

console.log('=== Medición exploratoria de rendimiento (RNF-01 / CP-19) ===');
console.log(`Fecha: ${new Date().toISOString()}`);
console.log(`Node.js: ${process.version}`);
console.log(`Sistema: ${os.type()} ${os.release()} (${os.arch()})`);
console.log(`CPU: ${os.cpus()[0].model} (${os.cpus().length} núcleos)`);
console.log(`RAM total: ${(os.totalmem() / 1024 ** 3).toFixed(1)} GB`);
console.log(`Llamadas por corrida: ${LLAMADAS} | Corridas: ${CORRIDAS} | Calentamiento: ${CALENTAMIENTO}`);

for (let i = 0; i < CALENTAMIENTO; i++) {
  const [p, c, d] = entradas[i % entradas.length];
  calcularTotal(p, c, d);
}

const tiemposValidos = [];
const tiemposInvalidos = [];
for (let r = 0; r < CORRIDAS; r++) {
  tiemposValidos.push(medirCaminoValido().ms);
  tiemposInvalidos.push(medirCaminoInvalido().ms);
}

resumir('Camino válido (entradas correctas)', tiemposValidos);
resumir('Camino inválido (RangeError por precio negativo)', tiemposInvalidos);

console.log('\nCriterio de referencia (informativo): 100 000 llamadas válidas en menos de 1 000 ms.');
const medianaValida = [...tiemposValidos].sort((a, b) => a - b)[Math.floor(CORRIDAS / 2)];
console.log(`Resultado: ${medianaValida < 1000 ? 'dentro' : 'fuera'} del criterio de referencia (mediana ${medianaValida.toFixed(2)} ms).`);
