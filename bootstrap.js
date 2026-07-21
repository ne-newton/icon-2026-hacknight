// Hack-night bootstrap: mounts the admin-mcp-prototype screen without the
// full instui-sandbox multi-prototype router/shell.
//
// Vendor deps (React, InstUI theming, ReactDOM) are loaded straight from the
// original hosted sandbox — they're compiled dependencies you're not meant
// to edit. The screen you'll actually hack on is ./admin-mcp-prototype.js,
// which lives locally right next to this file.

const REMOTE =
  "https://instructure.github.io/instui-sandbox-ai-platform/static/4c047732/admin-mcp-prototype-v2/assets/";

const { G: interop, U: reqReact } = await import(REMOTE + "v2-C9oVrVvN.js");
const { n: reqReactDom } = await import(REMOTE + "registry-_g2TKBa7.js");
const { t: InstUISettingsProvider } = await import(
  REMOTE + "InstUISettingsProvider-DNg7qA-3.js"
);
const { t: themeRegistry } = await import(REMOTE + "themes-DpnXVczK.js");
const { default: AdminMcpPrototype } = await import(
  "./admin-mcp-prototype.js"
);

const React = interop(reqReact(), 1);
const ReactDOM = reqReactDom();

let isDark = false;
const root = ReactDOM.createRoot(document.getElementById("root"));

function renderApp() {
  root.render(
    React.createElement(
      InstUISettingsProvider,
      { theme: (isDark ? themeRegistry.dark : themeRegistry.light).theme },
      React.createElement(AdminMcpPrototype, {
        isDark,
        onToggleTheme: () => {
          isDark = !isDark;
          renderApp();
        },
      })
    )
  );
}

renderApp();
