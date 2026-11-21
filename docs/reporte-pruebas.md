# Reporte de pruebas – Módulo de cálculo de compras
**Autor:** Kleber Tipantiza · **Fecha:** 11/21/2026
## 1. Resumen ejecutivo
Se evaluó dinámicamente la función `calcularTotal(precio, cantidad, descuento)` frente a los requisitos RF-01 a RF-05 y RNF-01. Sobre el código inicial se ejecutaron 18 pruebas automatizadas con Jest: **6 aprobaron y 12 fallaron**. Los fallos se agruparon en **4 defectos confirmados** (DEF-01 a DEF-04). Tras corregirlos de forma incremental, sin modificar requisitos ni pruebas, la ejecución final obtuvo **[18 aprobadas y 0 fallidas]**, incluida la regresión de los casos que ya funcionaban.
**Conclusión:** Con la evidencia disponible, el módulo cumple los criterios de salida definidos en el plan y puede liberarse, con los riesgos residuales indicados en la sección 8.
## 2. Alcance y ambiente
- **Objeto probado:** `src/compras.js`, nivel unidad, enfoque de caja negra.
- **Casos diseñados:** 19 (CP-01 a CP-19) en `docs/matriz-casos.md`. CP-01 a CP-18 están automatizados en `tests/compras.test.js` y CP-19 se mide con `tests/rendimiento.js`.
- **Ambiente:** Windows_NT 10.0.26300 (x64), Node.js v24.10.0, npm, Jest 30 con `jest --runInBand`, CPU: 12th Gen Intel(R) Core(TM) i5-12450H (12 núcleos), y RAM total: 15.7 GB.
- **Supuestos adoptados** (ver `docs/plan-pruebas.md`, sección 3): precio 0 válido, cantidades decimales válidas, tipos validados antes que rangos.
## 3. Resultados de la ejecución
| Ejecución | Evidencia | Aprobadas | Fallidas | Total |
|---|---|---|---|---|
| Inicial (código con defectos) | `evidencias/pruebas-iniciales.txt` | 6 | 12 | 18 |
| Tras corregir DEF-04 | Commit: d2e439843fd8b6ce4eb6de67eac5ee2e3dcf7755 | 11 | 7 | 18 |
| Tras corregir DEF-02 | Commit: 61a4dbcd5e2e05118d6e4f58af07413b27492fa4 | 14 | 4 | 18 |
| Tras corregir DEF-03 | Commit: 3b5304053a5cd66d80a1b0f71d4e2bd53b201466 | 16 | 2 | 18 |
| Final (tras DEF-01) | `evidencias/pruebas-finales.txt` | 18 | 0 | 18 |
Casos que fallaron al inicio: CP-05, CP-06 y CP-07 a CP-16. Casos que pasaron desde el inicio: CP-01 a CP-04, CP-17 y CP-18.
## 4. Defectos
| ID | Título | Requisito | Casos | Severidad | Corrección (commit) | Estado |
|---|---|---|---|---|---|---|
| DEF-01 | El total no se redondea a dos decimales | RF-03 | CP-05, CP-06 | Alta | a38dc2a9c8c7762db57fbb05ab19d319598bc815 | Cerrado |
| DEF-02 | Se aceptan precios y cantidades fuera de rango | RF-04 | CP-07, CP-08, CP-09 | Alta | 61a4dbcd5e2e05118d6e4f58af07413b27492fa4 | Cerrado |
| DEF-03 | Se aceptan descuentos fuera de 0–100 % | RF-04 | CP-10, CP-11 | Alta | 3b5304053a5cd66d80a1b0f71d4e2bd53b201466 | Cerrado |
| DEF-04 | No se validan tipos ni valores no finitos | RF-05 | CP-12 a CP-16 | Media | d2e439843fd8b6ce4eb6de67eac5ee2e3dcf7755 | Cerrado |
El detalle de cada defecto (pasos, resultado esperado, resultado real y evidencia) está en `docs/registro-defectos.md`.
## 5. Cobertura por requisito
| Requisito | Casos | Resultado inicial | Resultado final |
|---|---|---|---|
| RF-01 Subtotal | CP-01, CP-17, CP-18 | Aprobados | Aprobados |
| RF-02 Descuento 0–100 % | CP-02, CP-03, CP-04 | Aprobados | Aprobados |
| RF-03 Dos decimales | CP-04, CP-05, CP-06 | CP-05 y CP-06 fallidos | Aprobados |
| RF-04 `RangeError` | CP-07 a CP-11, CP-16, CP-17 | CP-07 a CP-11 y CP-16 fallidos | Aprobados |
| RF-05 `TypeError` | CP-12 a CP-16 | Fallidos | Aprobados |
| RNF-01 Rendimiento | CP-19 | No ejecutado | Ejecutado (sección 6) |
**Cobertura funcional:** los 5 requisitos funcionales tienen al menos un caso automatizado asociado (5 de 5).
## 6. Medición exploratoria de rendimiento (RNF-01, CP-19)
- **Script:** `tests/rendimiento.js`, ejecutado con `npm run rendimiento`. Evidencia en `evidencias/rendimiento.txt`.
- **Método:** 20 000 llamadas de calentamiento y luego 5 corridas de 100 000 llamadas con cinco combinaciones de datos válidos. También se midió el camino de error (`RangeError`).
| Camino | Mediana por corrida (ms) | Promedio por llamada (µs) | Llamadas por segundo |
|---|---|---|---|
| Válido | 3.86 | 0.039 | 25,882,597 |
| Inválido (`RangeError`) | 745.49 | 7.455 | 134,141 |
- **Criterio de referencia (informativo):** 100 000 llamadas válidas en menos de 1 000 ms. Resultado: [3.86 ms / 745.49 ms].
- **Observación para la reflexión:** el camino que lanza excepciones suele ser más lento que el camino válido, porque crear un objeto `Error` captura la pila de llamadas. Esto es esperable y no es un defecto, pero conviene tenerlo presente si la función recibiera muchas entradas inválidas.
**Limitaciones de la medición**
- Se mide la función aislada en un solo equipo, sin carga concurrente, sin red y sin otras capas de la aplicación.
- El resultado depende del hardware, la versión de Node.js y la carga del sistema en ese momento, por lo que no es extrapolable a producción.
- El primer lote de llamadas puede ser más lento por la optimización del motor, por eso se usa la mediana y no el promedio.
- No existe un umbral de rendimiento en la especificación, así que el criterio de referencia es propio y solo orientativo.
## 7. Regresión
Tras cada corrección se ejecutó la batería completa de 18 pruebas. La ejecución final (`evidencias/pruebas-finales.txt`) es la evidencia de regresión completa.
## 8. Riesgos residuales
| ID | Riesgo residual | Impacto | Recomendación |
|---|---|---|---|
| RR-01 | **Punto flotante:** el redondeo con `Math.round((x + Number.EPSILON) * 100) / 100` es adecuado para los casos probados, pero el dinero en números de punto flotante puede acumular errores en otros valores | Medio | Calcular en centavos enteros o usar una librería decimal |
| RR-02 | **Valores extremos:** no se probaron valores cercanos a `Number.MAX_VALUE`; un producto muy grande puede desbordar a `Infinity` y devolver un total no finito sin lanzar error | Medio | Agregar casos de valores extremos y validar el resultado |
| RR-03 | **Supuestos de la especificación:** precio 0, cantidades decimales y orden de validación fueron decisiones propias | Medio | Confirmar los supuestos con el responsable del producto |
| RR-04 | **Alcance limitado a nivel unidad:** no hay pruebas de integración, sistema ni aceptación | Medio | Probar el módulo dentro del flujo real de compra |
| RR-05 | **Rendimiento:** medición exploratoria en un solo equipo | Bajo | Definir un umbral formal y medir en un ambiente representativo |
| RR-06 | **Técnicas aplicadas a un conjunto acotado de datos:** 18 casos automatizados no agotan las combinaciones posibles | Bajo | Ampliar con más particiones si el módulo crece |
## 9. Conclusión y recomendación de liberación

**Cumplimiento de los criterios de salida.** Los criterios definidos en el plan de pruebas se cumplieron: se ejecutaron los 18 casos automatizados, incluidos todos los de prioridad Alta; los cuatro defectos detectados (tres de severidad Alta y uno Media) fueron corregidos y verificados, cada requisito funcional (RF-01 a RF-05) cuenta con al menos un caso aprobado, y la regresión final no registró fallos [18 pruebas aprobadas de 18, según `evidencias/pruebas-finales.txt`]. El RNF-01 se evaluó de forma exploratoria: [la mediana de 100 000 llamadas válidas fue de 3.86 ms, dentro del criterio de referencia de 1 000 ms], con las limitaciones descritas en la sección 6.

**Defectos y su relevancia.** El código inicial presentaba fallas en tres frentes: no validaba los rangos de las entradas (DEF-02 y DEF-03), no controlaba los tipos ni los valores no finitos (DEF-04) y no redondeaba el total a dos decimales (DEF-01). Los dos primeros eran los más graves para el negocio, porque permitían calcular totales negativos o alterados y cobrar un importe incorrecto al cliente. Las correcciones se aplicaron de forma incremental, sin modificar los requisitos ni las pruebas, y la ejecución de la batería completa tras cada cambio no mostró regresiones en los casos que ya funcionaban.

**Riesgos residuales aceptados.** La liberación no elimina todo el riesgo. Los más relevantes son tres. Primero, el cálculo monetario con números de punto flotante: el redondeo aplicado resuelve los casos probados, pero no garantiza exactitud en cualquier combinación de valores. Segundo, no se probaron valores extremos, por lo que un producto cercano a `Number.MAX_VALUE` podría desbordar a `Infinity` y devolver un total no finito sin lanzar error. Tercero, los supuestos sobre precio 0, cantidades decimales y orden de validación fueron decisiones propias que el responsable del producto no ha confirmado. A estos se suma que las pruebas se limitaron al nivel unidad y que el rendimiento se midió en un solo equipo.

**Decisión.** Se recomienda **liberar con condiciones**. El módulo cumple lo especificado en los casos evaluados y los defectos conocidos están cerrados, pero antes de usarlo en un flujo real de compras se recomienda: (1) Confirmar los tres supuestos con el responsable del producto, (2) Agregar casos con valores extremos y validar que el resultado sea finito, (3) Evaluar la migración del cálculo a centavos enteros o a una librería decimal, y (4) Probar el módulo dentro del flujo completo de compra mediante pruebas de integración y aceptación. Si alguna de estas condiciones no puede cumplirse, el riesgo debe ser aceptado de manera explícita por las partes interesadas.