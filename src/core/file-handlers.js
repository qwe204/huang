const textExts = ['txt', 'md', 'csv'];

let mammothModule;
let xlsxModule;
let pdfjsModule;

const loadMammoth = async () => {
  if (!mammothModule) {
    mammothModule = await import('https://esm.sh/mammoth@1.8.0');
  }
  return mammothModule;
};

const loadXlsx = async () => {
  if (!xlsxModule) {
    xlsxModule = await import('https://cdn.jsdelivr.net/npm/xlsx@0.18.5/+esm');
  }
  return xlsxModule;
};

const loadPdfJs = async () => {
  if (!pdfjsModule) {
    pdfjsModule = await import('https://cdn.jsdelivr.net/npm/pdfjs-dist@4.10.38/build/pdf.min.mjs');
    pdfjsModule.GlobalWorkerOptions.workerSrc =
      'https://cdn.jsdelivr.net/npm/pdfjs-dist@4.10.38/build/pdf.worker.min.mjs';
  }
  return pdfjsModule;
};

export const detectExt = (name = '') => name.split('.').pop()?.toLowerCase() || '';

export async function loadDoc(file) {
  const ext = detectExt(file.name);

  if (textExts.includes(ext)) {
    const text = await file.text();
    return { kind: 'text', ext, editable: true, content: text };
  }

  if (ext === 'docx') {
    const mammoth = await loadMammoth();
    const buffer = await file.arrayBuffer();
    const { value } = await mammoth.convertToHtml({ arrayBuffer: buffer });
    return { kind: 'html', ext, editable: true, content: value };
  }

  if (ext === 'xlsx') {
    const XLSX = await loadXlsx();
    const buffer = await file.arrayBuffer();
    const wb = XLSX.read(buffer);
    const ws = wb.Sheets[wb.SheetNames[0]];
    return { kind: 'sheet', ext, editable: true, content: XLSX.utils.sheet_to_html(ws) };
  }

  if (ext === 'pdf') {
    const pdfjs = await loadPdfJs();
    const data = await file.arrayBuffer();
    const pdf = await pdfjs.getDocument({ data }).promise;
    return { kind: 'pdf', ext, editable: false, content: pdf };
  }

  return { kind: 'unsupported', ext, editable: false, content: null };
}

export async function saveDoc({ ext, kind, editor }) {
  if (kind === 'text') return new Blob([editor.textContent || ''], { type: 'text/plain;charset=utf-8' });

  if (ext === 'xlsx') {
    const XLSX = await loadXlsx();
    const table = editor.querySelector('table');
    if (!table) return null;
    const wb = XLSX.utils.table_to_book(table, { sheet: 'Sheet1' });
    const out = XLSX.write(wb, { type: 'array', bookType: 'xlsx' });
    return new Blob([out], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  }

  if (kind === 'html') return new Blob([editor.innerHTML], { type: 'text/html;charset=utf-8' });

  return null;
}

export function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
