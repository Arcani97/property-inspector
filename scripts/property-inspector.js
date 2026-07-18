const MODULE_ID = "property-inspector";

let inspectorActive = false;
let tooltipElement = null;
let highlightedElement = null;

let currentPath = null;
let currentExact = false;

let suppressedTitleEl = null;
let suppressedTitleAttr = null;
let suppressedTitleValue = null;

function suppressNativeTooltip(el) {
  const titledEl = el?.closest("[title], [data-tooltip]") ?? null;
  if (titledEl === suppressedTitleEl) return;
  restoreNativeTooltip();
  if (titledEl) {
    suppressedTitleEl = titledEl;
    suppressedTitleAttr = titledEl.hasAttribute("title") ? "title" : "data-tooltip";
    suppressedTitleValue = titledEl.getAttribute(suppressedTitleAttr);
    titledEl.removeAttribute(suppressedTitleAttr);
  }
  game.tooltip?.deactivate();
}

function restoreNativeTooltip() {
  if (suppressedTitleEl && suppressedTitleValue !== null) {
    suppressedTitleEl.setAttribute(suppressedTitleAttr, suppressedTitleValue);
  }
  suppressedTitleEl = null;
  suppressedTitleAttr = null;
  suppressedTitleValue = null;
}

Hooks.once("init", () => {
  game.keybindings.register(MODULE_ID, "toggleInspector", {
    name: "PROPERTYINSPECTOR.Keybinding.Name",
    hint: "PROPERTYINSPECTOR.Keybinding.Hint",
    editable: [{ key: "KeyP", modifiers: ["Alt"] }],
    onDown: () => {
      toggleInspector();
      return true;
    },
    restricted: false
  });
});

function toggleInspector() {
  inspectorActive = !inspectorActive;

  if (inspectorActive) {
    createTooltip();
    document.addEventListener("mousemove", onMouseMove, true);
    document.addEventListener("click", onClick, true);
    ui.notifications.info(game.i18n.localize("PROPERTYINSPECTOR.Notif.Activated"));
  } else {
    document.removeEventListener("mousemove", onMouseMove, true);
    document.removeEventListener("click", onClick, true);
    clearHighlight();
    destroyTooltip();
    restoreNativeTooltip();
    currentPath = null;
    currentExact = false;
    ui.notifications.info(game.i18n.localize("PROPERTYINSPECTOR.Notif.Deactivated"));
  }
}

function createTooltip() {
  tooltipElement = document.createElement("div");
  tooltipElement.id = "property-inspector-tooltip";
  tooltipElement.style.display = "none";
  document.body.appendChild(tooltipElement);
}

function destroyTooltip() {
  tooltipElement?.remove();
  tooltipElement = null;
}

function clearHighlight() {
  highlightedElement?.classList.remove("property-inspector-highlight");
  highlightedElement = null;
}

function findAppElement(el) {
  return el.closest(".application, .window-app");
}

function getAppInstance(appEl) {
  if (!appEl) return null;
  const v2App = foundry.applications?.instances?.get(appEl.id);
  if (v2App) return v2App;
  const appId = appEl.dataset?.appid;
  if (appId) return ui.windows[appId] ?? null;
  return null;
}

function getDocumentFromApp(app) {
  return app?.document ?? app?.object ?? null;
}

function getFormFieldPath(el) {
  const field = el.closest("[name], [data-edit]");
  if (!field) return null;
  return field.getAttribute("name") || field.getAttribute("data-edit");
}

function reverseSearchPath(obj, text, prefix = "") {
  if (!obj || typeof obj !== "object") return null;
  const target = text.trim();
  if (target === "") return null;

  for (const key in obj) {
    if (!obj.hasOwnProperty(key)) continue;
    const value = obj[key];
    const fullPath = prefix ? `${prefix}.${key}` : key;

    if (value !== null && typeof value === "object" && !Array.isArray(value)) {
      const found = reverseSearchPath(value, target, fullPath);
      if (found) return found;
    } else if (String(value).trim() === target) {
      return fullPath;
    }
  }
  return null;
}

function resolvePath(event) {
  const appEl = findAppElement(event.target);
  if (!appEl) return { appEl: null, path: null, exact: false };

  const directPath = getFormFieldPath(event.target);
  if (directPath) return { appEl, path: directPath, exact: true };

  const app = getAppInstance(appEl);
  const doc = getDocumentFromApp(app);
  const text = event.target.textContent;

  if (doc?.system && text) {
    const approxPath = reverseSearchPath(doc.system, text, "system");
    if (approxPath) return { appEl, path: approxPath, exact: false };
  }

  return { appEl, path: null, exact: false };
}

function onMouseMove(event) {
  let result;
  try {
    result = resolvePath(event);
  } catch (err) {
    console.error("Property Path Inspector | erro ao resolver caminho:", err);
    return;
  }

  const { appEl, path, exact } = result;

  if (!appEl || !path) {
    clearHighlight();
    tooltipElement.style.display = "none";
    restoreNativeTooltip();
    currentPath = null;
    currentExact = false;
    return;
  }

  currentPath = path;
  currentExact = exact;
  suppressNativeTooltip(event.target);

  if (highlightedElement !== event.target) {
    clearHighlight();
    highlightedElement = event.target;
    highlightedElement.classList.add("property-inspector-highlight");
  }

  const hint = exact
    ? game.i18n.localize("PROPERTYINSPECTOR.Tooltip.ClickToCopy")
    : game.i18n.localize("PROPERTYINSPECTOR.Tooltip.ApproxMatch");

  tooltipElement.style.display = "block";
  tooltipElement.style.left = `${event.clientX + 16}px`;
  tooltipElement.style.top = `${event.clientY + 16}px`;
  tooltipElement.innerHTML = `
    <div class="pi-path">${path}</div>
    <div class="pi-hint">${hint}</div>
  `;
}

function onClick(event) {
  if (!currentPath) return;

  event.preventDefault();
  event.stopPropagation();

  const path = currentPath;
  navigator.clipboard.writeText(path).catch((err) => {
    console.error("Property Path Inspector | falha ao copiar para a área de transferência:", err);
  });
  ui.notifications.info(game.i18n.format("PROPERTYINSPECTOR.Notif.Copied", { path }));
}
