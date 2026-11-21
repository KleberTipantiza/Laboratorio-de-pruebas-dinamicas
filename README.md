# Laboratorio de pruebas dinámicas – Módulo de cálculo de compras

El repositorio contiene la planificación, el diseño, la automatización con Jest, la gestión de defectos y el reporte de pruebas de la función `calcularTotal(precio, cantidad, descuento)`, un módulo de cálculo de compras entregado con defectos intencionales.

## Requisitos evaluados

| ID | Requisito |
|---|---|
| RF-01 | `subtotal = precio × cantidad` para números positivos |
| RF-02 | Descuento de 0 a 100 % |
| RF-03 | Total con dos decimales (100 % produce 0) |
| RF-04 | `RangeError` para precio negativo, cantidad ≤ 0 o descuento fuera de rango |
| RF-05 | `TypeError` para entradas no numéricas o no finitas |
| RNF-01 | Exploración limitada de rendimiento |

## Estructura del repositorio

```
.
├── src/
│   └── compras.js              # Módulo bajo prueba (versión corregida)
├── tests/
│   ├── compras.test.js         # 18 pruebas automatizadas con Jest (CP-01 a CP-18)
│   └── rendimiento.js          # Medición exploratoria de rendimiento (CP-19)
├── docs/
│   ├── plan-pruebas.md         # Alcance, riesgos, tipos, niveles, ambiente y criterios
│   ├── matriz-casos.md         # 19 casos con trazabilidad por requisito
│   ├── registro-defectos.md    # 4 defectos confirmados (DEF-01 a DEF-04)
│   └── reporte-pruebas.md      # Resultados, cobertura y riesgos residuales
├── evidencias/
│   ├── pruebas-iniciales.txt   # Ejecución sobre el código con defectos
│   ├── pruebas-finales.txt     # Ejecución tras las correcciones (regresión)
│   └── rendimiento.txt         # Salida de la medición de rendimiento
├── package.json
├── package-lock.json
└── README.md
```

## Requisitos previos

- Node.js (el proyecto se desarrolló con la versión v24.10.0)
- npm (incluido con Node.js)

## Instalación

```bash
git clone https://github.com/KleberTipantiza/Laboratorio-de-pruebas-dinamicas.git
cd Laboratorio-de-pruebas-dinamicas
npm install
```

## Ejecución de las pruebas

```bash
npm test
```

Este comando ejecuta `jest --runInBand`. Para ver el detalle de cada caso:

```bash
npm test -- --verbose
```

**Resultado esperado con el código corregido:** 18 pruebas aprobadas de 18.

## Medición de rendimiento

```bash
npm run rendimiento
```

Mide 5 corridas de 100 000 llamadas a `calcularTotal` (camino válido y camino de error) e imprime el ambiente de ejecución, la mediana, el promedio por llamada y las llamadas por segundo. Es una medición exploratoria, no una prueba de carga: sus limitaciones se describen en `docs/reporte-pruebas.md`.

## Defectos detectados y corregidos

| ID | Defecto | Requisito | Severidad |
|---|---|---|---|
| DEF-01 | El total no se redondea a dos decimales | RF-03 | Alta |
| DEF-02 | Se aceptan precios y cantidades fuera de rango | RF-04 | Alta |
| DEF-03 | Se aceptan descuentos fuera de 0–100 % | RF-04 | Alta |
| DEF-04 | No se validan tipos ni valores no finitos | RF-05 | Media |

Cada defecto se corrigió en un commit independiente, sin modificar los requisitos ni las pruebas. El detalle está en `docs/registro-defectos.md`.

## Resultados

| Ejecución | Evidencia | Aprobadas | Fallidas |
|---|---|---|---|
| Inicial (código con defectos) | `evidencias/pruebas-iniciales.txt` | 6 | 12 |
| Final (código corregido, con regresión) | `evidencias/pruebas-finales.txt` | 18 | 0 |

## Trazabilidad

Requisito → Caso (`docs/matriz-casos.md`) → Prueba automatizada (`tests/compras.test.js`) → Ejecución (`evidencias/`) → Defecto (`docs/registro-defectos.md`).

El identificador de cada caso (CP-01 a CP-19) aparece al inicio del nombre de la prueba correspondiente.
