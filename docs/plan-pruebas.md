# Plan de pruebas – Módulo de cálculo de compras

**Autor:** Kleber Tipantiza · **Versión del documento:** 1.0 ·

## 1. Objetivo

Evaluar dinámicamente la función `calcularTotal(precio, cantidad, descuento)` de `src/compras.js`, entregada con defectos intencionales, para comprobar su cumplimiento de los requisitos RF-01 a RF-05 y explorar el RNF-01. Las pruebas producirán evidencia trazable que permita decidir si el módulo puede liberarse.

## 2. Alcance

**Incluido**
- Cálculo del subtotal, descuento y total (RF-01, RF-02, RF-03).
- Validación de rangos con `RangeError` (RF-04).
- Validación de tipos con `TypeError` (RF-05).
- Exploración limitada de rendimiento en el entorno local (RNF-01).

## 3. Requisitos y supuestos

| ID | Requisito |
|---|---|
| RF-01 | `subtotal = precio × cantidad` para números positivos |
| RF-02 | Descuento válido de 0 a 100 % |
| RF-03 | Total con dos decimales; descuento 100 % produce 0 |
| RF-04 | `RangeError` si precio < 0, cantidad ≤ 0 o descuento fuera de 0–100 |
| RF-05 | `TypeError` si alguna entrada no es numérica o no es finita |
| RNF-01 | Exploración limitada de rendimiento |

Para no modificar los requisitos, se adoptaron estos **supuestos**, que se justificarán en el reporte:

1. **Precio = 0** es válido: RF-04 solo rechaza precios *negativos*. Resultado esperado: `0`.
2. **Cantidades no enteras** positivas (por ejemplo 0.5) son válidas: RF-04 solo rechaza cantidad ≤ 0.
3. **Orden de validación:** primero tipos (`TypeError`), luego rangos (`RangeError`). Así, una entrada como `precio = -5, cantidad = "2"` lanza `TypeError`.
4. **Redondeo:** a dos decimales sobre el total final.
5. "No numérico" incluye `string`, `null`, `undefined`, `boolean`, objetos y arreglos; "no finito" incluye `NaN`, `Infinity` y `-Infinity`.

## 4. Riesgos

| ID | Riesgo | Prob. | Impacto | Prioridad | Mitigación |
|---|---|---|---|---|---|
| R-01 | Montos incorrectos por falta de redondeo o errores de punto flotante | Alta | Alto | Alta | Casos de redondeo y valores límite (RF-03) |
| R-02 | Entradas inválidas aceptadas (precios, cantidades o descuentos fuera de rango) | Alta | Alto | Alta | Particiones inválidas y valores límite (RF-04) |
| R-03 | Coerción implícita de tipos (`"10"` tratado como número) y valores no finitos | Alta | Medio | Alta | Casos de tipos inválidos (RF-05) |
| R-04 | Ambigüedad de la especificación (precio 0, cantidades decimales) | Media | Medio | Media | Supuestos documentados |
| R-05 | Correcciones que rompan casos que ya pasaban | Media | Alto | Alta | Regresión completa tras cada corrección |
| R-06 | Medición de rendimiento poco representativa del entorno real | Media | Bajo | Baja | Describir entorno y limitaciones |

## 5. Tipos y niveles de prueba

| Dimensión | Aplicación en este laboratorio |
|---|---|
| **Nivel** | **Unidad / componente:** `calcularTotal` se prueba aislada, sin dependencias. Los niveles de integración, sistema y aceptación quedan fuera de alcance por no existir otros componentes. |
| **Tipo funcional** | Casos positivos, negativos y de borde sobre RF-01 a RF-05. |
| **Tipo no funcional** | Rendimiento exploratorio (RNF-01). |
| **Regresión** | Reejecución de toda la batería tras cada corrección. |
| **Enfoque** | Caja negra: los casos se derivan de la especificación, no del código. |

## 6. Técnicas de diseño

| Técnica | Justificación | Aplicación |
|---|---|---|
| **Partición de equivalencia** | Reduce el universo de entradas a clases representativas | Precios, cantidades y descuentos válidos e inválidos; tipos no numéricos |
| **Análisis de valores límite** | Los errores se concentran en los bordes | Descuento 0, 100, -1 y 101; cantidad 0 y 1; precio 0 |
| **Tabla de decisión** | Cubre combinaciones de entradas inválidas | Prioridad entre `TypeError` y `RangeError` |
| **Estimación de errores** | Aprovecha fallos típicos de JavaScript | Coerción de strings, `NaN`, `Infinity`, errores de punto flotante |

## 7. Ambiente de pruebas

| Elemento | Valor |
|---|---|
| Sistema operativo | [Windows / Linux / macOS y versión] |
| Node.js | [versión, con `node -v`] |
| npm | [versión, con `npm -v`] |
| Framework de pruebas | Jest, ejecutado con `jest --runInBand` |
| Control de versiones | Git y GitHub |
| Hardware | [CPU, RAM] (relevante para RNF-01) |

## 8. Criterios de entrada y salida

**Criterios de entrada**
- Repositorio creado con la estructura `src/`, `tests/`, `docs/`, `evidencias/`.
- Código inicial `src/compras.js` sin modificaciones.
- Node.js y Jest instalados y funcionando.
- Matriz de casos aprobada (12 casos).

**Criterios de salida**
- 100 % de los casos de prioridad Alta ejecutados.
- Todos los defectos de severidad Crítica o Alta corregidos y verificados.
- Cada requisito (RF-01 a RF-05) cubierto por al menos un caso con resultado aprobado.
- Regresión final sin fallos y evidencia guardada en `evidencias/pruebas-finales.txt`.
- Riesgos residuales y limitaciones documentados en `docs/reporte-pruebas.md`.

## 9. Evidencias y trazabilidad

Cadena de trazabilidad: **Requisito → Caso (`docs/matriz-casos.md`) → Prueba automatizada (`tests/compras.test.js`) → Ejecución (`evidencias/`) → Defecto (cuando corresponda)**.

| Evidencia | Ubicación |
|---|---|
| Matriz de casos | `docs/matriz-casos.md` |
| Ejecución sobre el código inicial | `evidencias/pruebas-iniciales.txt` |
| Ejecución tras correcciones y regresión | `evidencias/pruebas-finales.txt` |
| Registro de defectos | `docs/reporte-pruebas.md` |
| Informe final | `docs/reporte-pruebas.md` y PDF de la entrega |

## 10. Estrategia de commits

1. Estructura del repositorio y plan de pruebas.
2. Matriz de casos.
3. Configuración de Jest, pruebas automatizadas y evidencia inicial.
4. Corrección de defectos (un commit por defecto o grupo coherente) y evidencia final.
5. Medición de rendimiento y reporte de pruebas.
