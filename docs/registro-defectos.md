# Registro de defectos – `calcularTotal`

**Versión probada:** código inicial de `src/compras.js` (evidencia inicial)
**Ambiente:** Windows, Node.js [versión], Jest 30, `jest --runInBand`
**Evidencia de detección:** `evidencias/pruebas-iniciales.txt` (12 pruebas fallidas y 6 aprobadas de 18)

## Resumen

| ID | Título | Requisito | Casos que lo detectan | Severidad | Prioridad | Estado |
|---|---|---|---|---|---|---|
| DEF-01 | El total no se redondea a dos decimales | RF-03 | CP-05, CP-06 | Alta | Alta | Cerrado |
| DEF-02 | Se aceptan precios y cantidades fuera de rango | RF-04 | CP-07, CP-08, CP-09 | Alta | Alta | Cerrado |
| DEF-03 | Se aceptan descuentos fuera de 0–100 % | RF-04 | CP-10, CP-11 | Alta | Alta | Cerrado |
| DEF-04 | No se validan los tipos ni los valores no finitos | RF-05 | CP-12, CP-13, CP-14, CP-15, CP-16 | Media | Media | Cerrado |

## DEF-01 – El total no se redondea a dos decimales

- **Requisito:** RF-03 (total con dos decimales).
- **Pasos para reproducir:**
  1. Ejecutar `npm test -- --verbose`.
  2. Observar las pruebas CP-05 y CP-06, o llamar `calcularTotal(0.1, 3, 0)` y `calcularTotal(19.99, 3, 15)`.
- **Resultado esperado:** `0.3` y `50.97`.
- **Resultado real:** `0.30000000000000004` y `50.9745`.
- **Severidad:** Alta. Una función de cálculo monetario devuelve importes con decimales indebidos y no existe alternativa aceptable para quien consume el valor.
- **Prioridad:** Alta. Afecta a cualquier compra con precios decimales o descuentos.
- **Evidencia:** `evidencias/pruebas-iniciales.txt`, fallos de CP-05 y CP-06.
- **Commit de correcion:** Fix(DEF-01): redondea el total a dos decimales (RF-03) [a38dc2a9c8c7762db57fbb05ab19d319598bc815]

## DEF-02 – Se aceptan precios y cantidades fuera de rango

- **Requisito:** RF-04 (`RangeError` para precio negativo o cantidad ≤ 0).
- **Pasos para reproducir:**
  1. Ejecutar `npm test -- --verbose`.
  2. Observar CP-07, CP-08 y CP-09, o llamar `calcularTotal(-5, 2, 10)`, `calcularTotal(10, 0, 0)` y `calcularTotal(10, -1, 0)`.
- **Resultado esperado:** la función lanza `RangeError` en los tres casos.
- **Resultado real:** la función no lanza ninguna excepción y devuelve un valor calculado (por ejemplo, un total negativo).
- **Severidad:** Alta. Permite generar totales negativos o nulos para compras inválidas.
- **Prioridad:** Alta.
- **Evidencia:** `evidencias/pruebas-iniciales.txt`, fallos de CP-07, CP-08 y CP-09 (`Received function did not throw`).
- **Commit de correcion:** Fix(DEF-02): rechaza precios negativos y cantidades menores o iguales a 0 (RF-04)[61a4dbcd5e2e05118d6e4f58af07413b27492fa4]

## DEF-03 – Se aceptan descuentos fuera de 0–100 %

- **Requisito:** RF-04 (`RangeError` para descuento fuera de rango) y RF-02.
- **Pasos para reproducir:**
  1. Ejecutar `npm test -- --verbose`.
  2. Observar CP-10 y CP-11, o llamar `calcularTotal(10, 1, -1)` y `calcularTotal(10, 1, 101)`.
- **Resultado esperado:** la función lanza `RangeError`.
- **Resultado real:** no lanza excepción. Un descuento mayor que 100 produce un total negativo y uno menor que 0 incrementa el total.
- **Severidad:** Alta. Altera el importe cobrado al cliente.
- **Prioridad:** Alta.
- **Evidencia:** `evidencias/pruebas-iniciales.txt`, fallos de CP-10 y CP-11.
- **Commit de correcion:** Fix(DEF-03): rechaza descuentos fuera del rango 0-100 (RF-04)
[3b5304053a5cd66d80a1b0f71d4e2bd53b201466]

## DEF-04 – No se validan los tipos ni los valores no finitos

- **Requisito:** RF-05 (`TypeError` para entradas no numéricas o no finitas).
- **Pasos para reproducir:**
  1. Ejecutar `npm test -- --verbose`.
  2. Observar CP-12 a CP-16, o llamar `calcularTotal('10', 2, 0)`, `calcularTotal(10, null, 0)`, `calcularTotal(NaN, 2, 0)`, `calcularTotal(10, Infinity, 0)` y `calcularTotal(-5, '2', 0)`.
- **Resultado esperado:** la función lanza `TypeError`.
- **Resultado real:** no lanza excepción. JavaScript convierte los valores de forma implícita: `'10'` se trata como número, `null` como 0 y `NaN` o `Infinity` se propagan al resultado.
- **Severidad:** Media. Los valores incorrectos suelen provenir de la capa que invoca la función, y esa capa puede filtrarlos, pero el módulo devuelve resultados silenciosamente erróneos.
- **Prioridad:** Media.
- **Evidencia:** `evidencias/pruebas-iniciales.txt`, fallos de CP-12 a CP-16.
- **Commit de correcion:** Fix(DEF-04): valida tipos numéricos y valores finitos (RF-05)[d2e439843fd8b6ce4eb6de67eac5ee2e3dcf7755]

## Plan de corrección (sin modificar los requisitos)

Se corregirá de forma incremental, con una ejecución completa de Jest y un commit después de cada defecto:

1. DEF-04: validación de tipos y valores finitos (se hace primero para respetar el orden de validación del supuesto 3).
2. DEF-02 y DEF-03: validación de rangos.
3. DEF-01: redondeo a dos decimales.

Después de cada paso se verifica que los casos que ya pasaban (CP-01 a CP-04, CP-17 y CP-18) sigan aprobados, y al final se guarda `evidencias/pruebas-finales.txt`.
