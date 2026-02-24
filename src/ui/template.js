export const getTemplate = (t) => `
<style>
:host { display:block; height:100%; font-family:Inter,system-ui,-apple-system,sans-serif; color:#1f2937; }
.wrap { display:flex; flex-direction:column; height:100%; border:1px solid #d1d5db; border-radius:12px; overflow:hidden; }
.toolbar { display:flex; gap:8px; align-items:center; padding:10px 12px; background:#f8fafc; border-bottom:1px solid #e5e7eb; flex-wrap:wrap; }
.btn { border:1px solid #cbd5e1; background:white; border-radius:8px; padding:6px 10px; cursor:pointer; font-size:13px; }
.btn:hover { background:#eff6ff; }
.status { margin-left:auto; font-size:12px; color:#475569; }
.main { flex:1; display:flex; min-height:0; }
.drop { flex:1; display:flex; align-items:center; justify-content:center; border:2px dashed #cbd5e1; margin:16px; border-radius:12px; color:#64748b; font-size:14px; text-align:center; padding:12px; }
.editor { flex:1; overflow:auto; padding:16px; }
.editor[contenteditable='true'] { outline:none; }
.sheet table { border-collapse:collapse; width:100%; }
.sheet td,.sheet th { border:1px solid #cbd5e1; padding:6px; min-width:80px; }
.pagination { display:flex; gap:8px; align-items:center; margin-left:8px; }
canvas { max-width:100%; margin:0 auto; display:block; border:1px solid #e5e7eb; }
.hidden { display:none !important; }
</style>
<div class="wrap">
  <div class="toolbar">
    <button class="btn" id="openBtn">${t.open}</button>
    <button class="btn" id="saveBtn">${t.save}</button>
    <button class="btn" id="clearBtn">${t.clear}</button>
    <label>
      ${t.language}
      <select id="langSel" class="btn">
        <option value="zh">中文</option>
        <option value="en">English</option>
      </select>
    </label>
    <div class="pagination hidden" id="pagination">
      <button class="btn" id="prevBtn">${t.prev}</button>
      <span id="pageInfo"></span>
      <button class="btn" id="nextBtn">${t.next}</button>
    </div>
    <span class="status" id="status">${t.ready}</span>
  </div>
  <div class="main" id="main">
    <div class="drop" id="drop">${t.dragTip}</div>
    <div class="editor hidden" id="editor"></div>
  </div>
  <input id="fileInput" class="hidden" type="file" />
</div>
`;
