<div align="center">

<a href="https://github.com/Arcani97/property-inspector"><img src="https://img.shields.io/badge/Home-242526?logo=googlehome" alt="home"></a>
<a href="https://github.com/Arcani97/property-inspector/blob/main/README-en.md"><img src="https://img.shields.io/badge/README-EN-00247d?style=flat&labelColor=7c7e7e" alt="en"></a>
<a href="https://github.com/Arcani97/property-inspector/blob/main/README-ptbr.md"><img src="https://img.shields.io/badge/README-PT--BR-004f1e?style=flat&labelColor=242526" alt="ptbr"></a>

<h1>Property Path Inspector</h1>

</div>

<br>

<h2>How to use</h2>

<ol>
  <li>Activate the inspector shortcut (default <kbd>Alt</kbd> + <kbd>P</kbd>, customizable in Foundry's <strong>Configure Controls</strong>).</li>
  <li>Hover over any field on an open Item or Actor sheet — form fields, rich text descriptions, anything rendered from <code>system</code> data.</li>
  <li>A tooltip appears next to the cursor showing the field's data path (e.g. <code>system.description.value</code>).</li>
  <li>Click the field to copy the currently shown path to your clipboard.</li>
  <li>Press the shortcut again to deactivate.</li>
</ol>

<br>

<h2>Game system compatibility</h2>

<p>The module is system-agnostic: it doesn't rely on any system-specific configuration to work, unlike modules that need a field mapped per system. It reads whatever <code>name</code> or <code>data-edit</code> attribute Foundry itself puts on a field, so any system built the standard way is supported out of the box.</p>

<p>It recognizes both <strong>ApplicationV2</strong> sheets (<code>.application</code>) and legacy <strong>Application (V1)</strong> sheets (<code>.window-app</code>), so it works regardless of whether a system has migrated its sheets to the new API.</p>

<p>For elements that don't expose a name (plain read-only text, for instance), the module falls back to matching the visible text against the item's raw <code>system</code> data. This fallback is best-effort: it can fail if two fields share the same value, or if the displayed text differs from the stored raw value.</p>

<br>

<h2>Default Shortcut</h2>

<p><kbd>Alt</kbd> + <kbd>P</kbd>. Fully rebindable in Foundry's <strong>Configure Controls</strong> menu, under <strong>Property Path Inspector</strong>.</p>

<br>

<h2>Adding a new language</h2>

<p>This was designed to be quite simple:</p>

<ol>
  <li>Copy <code>lang/en.json</code> (or <code>lang/pt-BR.json</code>) to a new file, e.g. <code>lang/es.json</code>.</li>
  <li>Translate the values (the part to the right of each <code>:</code>). <strong>Do not change the keys</strong> on the left (e.g. <code>"PROPERTYINSPECTOR.Notif.Activated"</code>) — only the translated text.</li>
  <li>Open <code>module.json</code> and add an entry under <code>"languages"</code>:</li>
</ol>

<pre><code>{ "lang": "es", "name": "Español", "path": "lang/es.json" }</code></pre>

<ol start="4">
  <li>Restart Foundry completely (not just a page refresh or world relaunch) — manifest changes are only read on startup. The new language will appear in Foundry's language options.</li>
</ol>

<p>No other file needs to be touched to translate the module — all interface text comes from the files in <code>lang/</code>.</p>

<br>

<h2>Module structure</h2>

<pre><code>property-inspector/
├── module.json                     Module manifest
├── scripts/
│   └── property-inspector.js       Keybinding, hover detection, path resolution, tooltip, clipboard
├── styles/
│   └── property-inspector.css      Tooltip and highlight styles
└── lang/
    ├── en.json                     English
    └── pt-BR.json                  Portuguese
</code></pre>

<br>

<h2>Technical notes</h2>

<ul>
  <li>The inspector never writes to any Document — it's a pure read-only overlay, no world setting or data storage is used.</li>
  <li>Exact paths come straight from the <code>name</code> attribute (form fields) or <code>data-edit</code> attribute (rich text/prose-mirror content in display mode).</li>
  <li>The approximate fallback path is found by a recursive search through <code>item.system</code> (or <code>actor.system</code>), comparing each leaf value to the hovered element's text content.</li>
  <li>The tooltip is a fixed-position element with a very high <code>z-index</code>; since the browser's native <code>title</code> tooltip and Foundry's own <code>data-tooltip</code> system both render above any page content regardless of <code>z-index</code>, the module temporarily removes whichever of those two attributes is present on the hovered element (restoring it afterward) so they don't overlap the module's own tooltip.</li>
  <li>A click while the inspector is active copies the last path shown by the tooltip — not a fresh lookup at the click coordinates — since the tooltip is offset from the cursor.</li>
</ul>
