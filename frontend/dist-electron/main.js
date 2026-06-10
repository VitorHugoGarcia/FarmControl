import { BrowserWindow as e, app as t } from "electron";
import { fileURLToPath as n } from "url";
import r from "path";
//#region electron/main.ts
var i = n(import.meta.url), a = r.dirname(i);
function o() {
	let t = new e({
		width: 1280,
		height: 720,
		webPreferences: {
			nodeIntegration: !0,
			contextIsolation: !1
		}
	});
	process.env.VITE_DEV_SERVER_URL ? t.loadURL(process.env.VITE_DEV_SERVER_URL) : t.loadFile(r.join(a, "../dist/index.html"));
}
t.whenReady().then(o), t.on("window-all-closed", () => {
	process.platform !== "darwin" && t.quit();
}), t.on("activate", () => {
	e.getAllWindows().length === 0 && o();
});
//#endregion
export {};
