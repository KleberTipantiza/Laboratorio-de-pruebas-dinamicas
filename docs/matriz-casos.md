# Matriz de casos de prueba – `calcularTotal(precio, cantidad, descuento)`

**Técnicas:** PE = partición de equivalencia · VL = valor límite · TD = tabla de decisión · EE = estimación de errores
**Estado inicial de todos los casos:** Pendiente (se actualizará despues de ejecutar sobre el código inicial y luego de las correcciones).

| ID | Requisito | Técnica | Datos (precio, cantidad, descuento) | Resultado esperado | Prioridad | Estado |
|---|---|---|---|---|---|---|
| CP-01 | RF-01 | PE (válida) | 10, 3, 0 | Retorna `30` | Alta | Pendiente |
| CP-02 | RF-02 | PE (válida) | 100, 2, 25 | Retorna `150` | Alta | Pendiente |
| CP-03 | RF-02 | VL (descuento mínimo) | 50, 2, 0 | Retorna `100` (sin descuento) | Alta | Pendiente |
| CP-04 | RF-02, RF-03 | VL (descuento máximo) | 80, 3, 100 | Retorna `0` | Alta | Pendiente |
| CP-05 | RF-03 | EE (punto flotante) | 0.1, 3, 0 | Retorna `0.3` (dos decimales) | Alta | Pendiente |
| CP-06 | RF-03 | PE (redondeo) | 19.99, 3, 15 | Retorna `50.97` | Alta | Pendiente |
| CP-07 | RF-04 | PE (precio inválido) | -5, 2, 10 | Lanza `RangeError` | Alta | Pendiente |
| CP-08 | RF-04 | VL (cantidad = 0) | 10, 0, 0 | Lanza `RangeError` | Alta | Pendiente |
| CP-09 | RF-04 | PE (cantidad inválida) | 10, -1, 0 | Lanza `RangeError` | Alta | Pendiente |
| CP-10 | RF-04 | VL (descuento bajo el mínimo) | 10, 1, -1 | Lanza `RangeError` | Alta | Pendiente |
| CP-11 | RF-04 | VL (descuento sobre el máximo) | 10, 1, 101 | Lanza `RangeError` | Alta | Pendiente |
| CP-12 | RF-05 | EE (string numérico) | "10", 2, 0 | Lanza `TypeError` | Alta | Pendiente |
| CP-13 | RF-05 | PE (no numérico) | 10, null, 0 | Lanza `TypeError` | Media | Pendiente |
| CP-14 | RF-05 | EE (`NaN`) | NaN, 2, 0 | Lanza `TypeError` | Alta | Pendiente |
| CP-15 | RF-05 | EE (`Infinity`) | 10, Infinity, 0 | Lanza `TypeError` | Alta | Pendiente |
| CP-16 | RF-04, RF-05 | TD (prioridad de errores) | -5, "2", 0 | Lanza `TypeError` (el tipo se valida antes que el rango) | Media | Pendiente |
| CP-17 | RF-01, RF-04 | VL (precio = 0, supuesto 1) | 0, 5, 10 | Retorna `0` | Media | Pendiente |
| CP-18 | RF-01 | VL (cantidad decimal, supuesto 2) | 10, 0.5, 0 | Retorna `5` | Baja | Pendiente |
| CP-19 | RNF-01 | Exploratoria | 19.99, 3, 15 repetido 100 000 veces | Tiempo total medido y registrado; sin errores | Baja | Pendiente |

## Cobertura por requisito

| Requisito | Casos | Técnicas aplicadas |
|---|---|---|
| RF-01 | CP-01, CP-17, CP-18 | PE, VL |
| RF-02 | CP-02, CP-03, CP-04 | PE, VL |
| RF-03 | CP-04, CP-05, CP-06 | VL, EE, PE |
| RF-04 | CP-07 a CP-11, CP-16, CP-17 | PE, VL, TD |
| RF-05 | CP-12 a CP-16 | PE, EE, TD |
| RNF-01 | CP-19 | Exploratoria |

## Notas
- CP-17 y CP-18 dependen de los supuestos 1 y 2 del plan de pruebas (`docs/plan-pruebas.md`, sección 3).
- CP-16 depende del supuesto 3 (los tipos se validan antes que los rangos).
- Los casos CP-01 a CP-18 se automatizarán en `tests/compras.test.js` (Fase B). CP-19 se mide con un script aparte (Fase D).