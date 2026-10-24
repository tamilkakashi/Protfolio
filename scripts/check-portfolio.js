const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const root = path.resolve(__dirname, "..");
const htmlPath = path.join(root, "index.html");
const html = fs.readFileSync(htmlPath, "utf8");
const jsPath = path.join(root, "asset", "js", "script.js");
const js = fs.readFileSync(jsPath, "utf8");
const checks = [];

function pass(message) {
  checks.push(message);
}

function getIds(source) {
  return [...source.matchAll(/\sid\s*=\s*["']([^"']+)["']/gi)].map((m) => m[1]);
}

function getAttributes(source) {
  return [...source.matchAll(/\b(href|src)\s*=\s*["']([^"']+)["']/gi)]
    .map((m) => ({ name: m[1].toLowerCase(), value: m[2].trim() }));
}

function assertLocalPathExists(pagePath, rawPath) {
  const cleanPath = decodeURIComponent(rawPath.split(/[?#]/, 1)[0]);
  const resolved = path.resolve(path.dirname(pagePath), cleanPath);
  const relative = path.relative(root, resolved);

  assert.ok(
    relative === "" || (!relative.startsWith("..") && !path.isAbsolute(relative)),
    "Local path escapes repository: " + rawPath
  );
  assert.ok(fs.existsSync(resolved), "Missing local asset/link: " + rawPath + " from " + path.relative(root, pagePath));
  return resolved;
}

function validateHtml(pagePath) {
  const source = fs.readFileSync(pagePath, "utf8");
  const ids = getIds(source);
  const idSet = new Set(ids);
  assert.equal(ids.length, idSet.size, "Duplicate id found in " + path.relative(root, pagePath));

  for (const attr of getAttributes(source)) {
    const value = attr.value;
    if (!value || /^(https?:|mailto:|tel:|data:|javascript:|\/\/)/i.test(value)) continue;
    if (value.startsWith("#")) {
      assert.ok(idSet.has(decodeURIComponent(value.slice(1))), "Broken anchor " + value + " in " + path.relative(root, pagePath));
      continue;
    }
    assertLocalPathExists(pagePath, value);
  }

  for (const match of source.matchAll(/<img\b([^>]*)>/gi)) {
    assert.match(match[1], /\balt\s*=\s*["'][^"']*["']/i, "Image missing alt text in " + path.relative(root, pagePath));
  }
  pass("Checked internal links, anchors, duplicate IDs and image alt text: " + path.relative(root, pagePath));
}

validateHtml(htmlPath);
validateHtml(path.join(root, "asset", "resume", "resume.html"));

const ids = new Set(getIds(html));
for (const match of js.matchAll(/getElementById\(["']([^"']+)["']\)/g)) {
  assert.ok(ids.has(match[1]), "JavaScript refers to missing HTML id: " + match[1]);
}
pass("Every JavaScript getElementById reference exists in the homepage.");

for (const id of ["about", "experience", "skills", "projects", "education", "contact"]) {
  assert.ok(ids.has(id), "Missing main navigation target: " + id);
}
pass("Main navigation targets exist.");

function makeClassList() {
  const values = new Set();
  return {
    add(name) { values.add(name); },
    remove(name) { values.delete(name); },
    contains(name) { return values.has(name); },
    toggle(name, force) {
      const shouldAdd = typeof force === "boolean" ? force : !values.has(name);
      if (shouldAdd) values.add(name);
      else values.delete(name);
      return shouldAdd;
    }
  };
}

function makeElement(attributes = {}, dataset = {}) {
  return {
    attributes: { ...attributes },
    dataset,
    listeners: {},
    classList: makeClassList(),
    textContent: "",
    focusCount: 0,
    getAttribute(name) { return Object.prototype.hasOwnProperty.call(this.attributes, name) ? this.attributes[name] : null; },
    setAttribute(name, value) { this.attributes[name] = String(value); },
    addEventListener(name, handler) { this.listeners[name] = handler; },
    focus() { this.focusCount += 1; },
    querySelectorAll() { return []; }
  };
}

async function testInteractions() {
  const navLinkA = makeElement();
  const navLinkB = makeElement();
  const menuToggle = makeElement({ "aria-expanded": "false", "aria-label": "Open navigation" });
  const navLinks = makeElement();
  navLinks.querySelectorAll = (selector) => selector === "a" ? [
    { addEventListener: (name, handler) => { navLinkA.listeners[name] = handler; } },
    { addEventListener: (name, handler) => { navLinkB.listeners[name] = handler; } }
  ] : [];
  const copyButton = makeElement({}, { email: "arasan7102003@gmail.com" });
  const copyStatus = makeElement();
  const year = makeElement();
  const body = { classList: makeClassList() };
  const documentListeners = {};
  const elements = { menuToggle, navLinks, copyEmail: copyButton, copyStatus, year };
  const document = {
    body,
    getElementById(id) { return elements[id] || null; },
    addEventListener(name, handler) { documentListeners[name] = handler; }
  };
  let copiedText = "";
  const navigator = {
    clipboard: {
      async writeText(value) { copiedText = value; }
    }
  };

  vm.runInNewContext(js, { document, navigator, Date, Promise });

  menuToggle.listeners.click();
  assert.equal(menuToggle.getAttribute("aria-expanded"), "true");
  assert.equal(navLinks.classList.contains("is-open"), true);
  assert.equal(body.classList.contains("nav-open"), true);
  navLinkA.listeners.click();
  assert.equal(menuToggle.getAttribute("aria-expanded"), "false");
  assert.equal(navLinks.classList.contains("is-open"), false);
  assert.equal(body.classList.contains("nav-open"), false);
  pass("Mobile menu opens and navigation links close it.");

  menuToggle.listeners.click();
  documentListeners.keydown({ key: "Escape" });
  assert.equal(menuToggle.getAttribute("aria-expanded"), "false");
  assert.equal(menuToggle.focusCount, 1);
  pass("Escape closes the mobile menu and restores focus.");

  await copyButton.listeners.click();
  assert.equal(copiedText, "arasan7102003@gmail.com");
  assert.equal(copyStatus.textContent, "Email address copied.");
  pass("Copy-email action writes the expected address and announces success.");

  assert.equal(year.textContent, String(new Date().getFullYear()));
  pass("Footer year updates dynamically.");
}

testInteractions()
  .then(() => {
    console.log("Portfolio checks passed:");
    for (const check of checks) console.log("- " + check);
  })
  .catch((error) => {
    console.error(error.stack || error.message);
    process.exitCode = 1;
  });
