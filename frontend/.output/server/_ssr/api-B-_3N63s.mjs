import { t as axios } from "../_libs/axios+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/api-B-_3N63s.js
var api = axios.create({
	baseURL: "http://localhost:3000",
	withCredentials: true,
	headers: { "Content-Type": "application/json" }
});
//#endregion
export { api as t };
