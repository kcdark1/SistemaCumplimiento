# Sistema de Aseguramiento FTTG

Aplicación web del ciclo de seis pasos para la Fundación Terminal Terrestre de Guayaquil: diagnóstico de fuentes, priorización ASG, matriz de riesgos, informe NIIF S1/S2, trazabilidad y declaración de confiabilidad.

Los datos de matriz, informe y aseguramiento están embebidos en la aplicación (`src/data`). El diagnóstico se alimenta con documentos Word. No requiere backend.

## Flujo

1. **Diagnóstico** — carga de fuentes en Word (`.docx`): el sistema extrae tablas y narrativa, y las contrasta con NIIF S1/S2.
2. **Priorización** — selección de factores ASG relevantes.
3. **Matriz de riesgos** — semáforo probabilidad/impacto, mapa de calor y PDF.
4. **Diseño de reporte** — informe bajo los cuatro pilares + PDF.
5. **Trazabilidad** — evidencia, fuente y responsables.
6. **Aseguramiento** — declaración de confiabilidad en PDF.

## Desarrollo

```bash
npm install
npm run dev
```

## GitHub Pages

Enlace:

**https://kcdark1.github.io/SistemaCumplimiento/**

o, si Pages está sirviendo la rama `main`:

**https://kcdark1.github.io/SistemaCumplimiento/docs/**

En [Settings → Pages](https://github.com/kcdark1/SistemaCumplimiento/settings/pages) use una de estas dos opciones:

- **Deploy from a branch** → `gh-pages` → `/ (root)`
- **Deploy from a branch** → `main` → `/docs`

