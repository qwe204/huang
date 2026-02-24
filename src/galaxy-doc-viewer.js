import { messages } from './i18n.js';
import { getTemplate } from './ui/template.js';
import { loadDoc, saveDoc, downloadBlob, detectExt } from './core/file-handlers.js';

class GalaxyDocViewer extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.lang = 'zh';
    this.state = { file: null, kind: null, ext: null, pdf: null, page: 1, pages: 0 };
    this.render();
  }

  render() {
    this.shadowRoot.innerHTML = getTemplate(messages[this.lang]);
    this.cacheElements();
    this.bindEvents();
    this.langSel.value = this.lang;
  }

  cacheElements() {
    const $ = (id) => this.shadowRoot.getElementById(id);
    this.openBtn = $('openBtn');
    this.saveBtn = $('saveBtn');
    this.clearBtn = $('clearBtn');
    this.langSel = $('langSel');
    this.fileInput = $('fileInput');
    this.drop = $('drop');
    this.editor = $('editor');
    this.status = $('status');
    this.pagination = $('pagination');
    this.pageInfo = $('pageInfo');
    this.prevBtn = $('prevBtn');
    this.nextBtn = $('nextBtn');
  }

  bindEvents() {
    this.openBtn.onclick = () => this.fileInput.click();
    this.fileInput.onchange = (e) => this.handleFile(e.target.files?.[0]);
    this.clearBtn.onclick = () => this.clearView();
    this.saveBtn.onclick = () => this.downloadEdited();
    this.langSel.onchange = (e) => {
      this.lang = e.target.value;
      this.render();
      if (this.state.file) this.handleFile(this.state.file, true);
    };

    this.drop.ondragover = (e) => {
      e.preventDefault();
      this.drop.style.borderColor = '#3b82f6';
    };
    this.drop.ondragleave = () => (this.drop.style.borderColor = '#cbd5e1');
    this.drop.ondrop = (e) => {
      e.preventDefault();
      this.drop.style.borderColor = '#cbd5e1';
      this.handleFile(e.dataTransfer.files?.[0]);
    };

    this.prevBtn.onclick = () => this.renderPdfPage(this.state.page - 1);
    this.nextBtn.onclick = () => this.renderPdfPage(this.state.page + 1);
  }

  async handleFile(file, restore = false) {
    if (!file) return;
    if (!restore) this.state.file = file;
    const doc = await loadDoc(file);
    this.state.kind = doc.kind;
    this.state.ext = doc.ext || detectExt(file.name);
    this.editor.className = 'editor';
    this.drop.className = 'drop hidden';
    this.pagination.classList.add('hidden');

    if (doc.kind === 'unsupported') {
      this.editor.classList.add('hidden');
      this.drop.classList.remove('hidden');
      this.status.textContent = messages[this.lang].unsupported;
      return;
    }

    if (doc.kind === 'text') {
      this.editor.contentEditable = 'true';
      this.editor.textContent = doc.content;
      this.status.textContent = `${file.name} · ${messages[this.lang].editMode}`;
      return;
    }

    if (doc.kind === 'html') {
      this.editor.contentEditable = 'true';
      this.editor.innerHTML = doc.content;
      this.status.textContent = `${file.name} · ${messages[this.lang].editMode}`;
      return;
    }

    if (doc.kind === 'sheet') {
      this.editor.contentEditable = 'false';
      this.editor.innerHTML = `<div class="sheet">${doc.content}</div>`;
      this.editor.querySelectorAll('td').forEach((td) => (td.contentEditable = 'true'));
      this.status.textContent = `${file.name} · ${messages[this.lang].editMode}`;
      return;
    }

    if (doc.kind === 'pdf') {
      this.editor.contentEditable = 'false';
      this.editor.innerHTML = '<canvas id="pdfCanvas"></canvas>';
      this.state.pdf = doc.content;
      this.state.pages = doc.content.numPages;
      this.renderPdfPage(1);
      this.pagination.classList.remove('hidden');
      this.status.textContent = `${file.name} · ${messages[this.lang].readOnly}`;
    }
  }

  async renderPdfPage(page) {
    if (!this.state.pdf || page < 1 || page > this.state.pages) return;
    this.state.page = page;
    const canvas = this.editor.querySelector('#pdfCanvas');
    const pdfPage = await this.state.pdf.getPage(page);
    const viewport = pdfPage.getViewport({ scale: 1.3 });
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    await pdfPage.render({ canvasContext: canvas.getContext('2d'), viewport }).promise;
    this.pageInfo.textContent = `${messages[this.lang].page} ${page} / ${this.state.pages}`;
  }

  clearView() {
    this.state = { file: null, kind: null, ext: null, pdf: null, page: 1, pages: 0 };
    this.editor.className = 'editor hidden';
    this.editor.innerHTML = '';
    this.drop.className = 'drop';
    this.status.textContent = messages[this.lang].ready;
    this.pagination.classList.add('hidden');
  }

  async downloadEdited() {
    if (!this.state.file) {
      this.status.textContent = messages[this.lang].empty;
      return;
    }
    const blob = await saveDoc({
      ext: this.state.ext,
      kind: this.state.kind,
      editor: this.editor,
      filename: this.state.file.name
    });
    if (!blob) {
      this.status.textContent = messages[this.lang].readOnly;
      return;
    }
    const outName = this.state.ext === 'docx' ? `edited-${this.state.file.name}.html` : `edited-${this.state.file.name}`;
    downloadBlob(blob, outName);
  }
}

customElements.define('galaxy-doc-viewer', GalaxyDocViewer);
