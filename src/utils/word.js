import mammoth from "mammoth";

const DOCX = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";

export function esWord(file) {
  const name = (file.name || "").toLowerCase();
  return name.endsWith(".docx") || file.type === DOCX;
}

export function esWordAntiguo(file) {
  return (file.name || "").toLowerCase().endsWith(".doc") && !esWord(file);
}

function extraerTablas(html) {
  const doc = new DOMParser().parseFromString(html, "text/html");
  return [...doc.querySelectorAll("table")].map((table) =>
    [...table.rows].map((row) => [...row.cells].map((cell) => cell.textContent.replace(/\s+/g, " ").trim()))
  );
}

function limpiarHtml(html) {
  return html.replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "");
}

export async function parsearWord(file) {
  if (esWordAntiguo(file)) {
    throw new Error(`"${file.name}" está en formato .doc antiguo. Guárdelo como .docx (Word 2007 o posterior) e inténtelo de nuevo.`);
  }
  if (!esWord(file)) {
    throw new Error(`"${file.name}" no es un documento Word. Solo se aceptan archivos .docx.`);
  }

  const arrayBuffer = await file.arrayBuffer();
  const htmlRes = await mammoth.convertToHtml(
    { arrayBuffer },
    {
      convertImage: mammoth.images.imgElement(async (image) => {
        const data = await image.read("base64");
        return { src: `data:${image.contentType};base64,${data}` };
      }),
    }
  );
  const html = limpiarHtml(htmlRes.value || "");
  const textRes = await mammoth.extractRawText({ arrayBuffer });
  const text = (textRes.value || "").trim();

  if (!html && !text) {
    throw new Error(`No se pudo leer el contenido de "${file.name}". Verifique que el archivo no esté dañado.`);
  }

  return {
    id: `${file.name}-${file.size}-${file.lastModified}-${crypto.randomUUID?.() || Math.random().toString(36).slice(2)}`,
    name: file.name,
    size: file.size,
    html,
    text,
    tables: extraerTablas(html),
  };
}
