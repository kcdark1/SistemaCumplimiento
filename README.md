# Sistema de Aseguramiento FTTG

Aplicación web del ciclo de seis pasos para la Fundación Terminal Terrestre de Guayaquil: diagnóstico de fuentes, priorización ASG, matriz de riesgos, informe NIIF S1/S2, trazabilidad y declaración de confiabilidad.

Los datos están embebidos en JSON (`src/data`). No requiere backend.

## Flujo

1. **Diagnóstico** — carga las cinco fuentes internas y el semáforo frente a NIIF S1/S2.
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

1. Suba el repositorio a GitHub.
2. En **Settings → Pages**, elija **GitHub Actions** como fuente.
3. El workflow `.github/workflows/deploy.yml` construye y publica en cada push a `main` o `master`.
4. La URL queda en `https://<usuario>.github.io/<repositorio>/`.

Si el repositorio se llama `<usuario>.github.io`, el base path se resuelve como `/`.
