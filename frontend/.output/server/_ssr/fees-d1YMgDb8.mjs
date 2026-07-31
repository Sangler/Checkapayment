//#region node_modules/.nitro/vite/services/ssr/assets/fees-d1YMgDb8.js
function getFeeItems(accountType) {
	return accountType === "personal" ? [
		"Stablecoin (USDC/USDC/CADC/EURC): 80bsp (0.8%) per settlement",
		"ETH: 100bsp (1%) per settlement",
		"BTC: 100bsp (1%) per settlement"
	] : [
		"Stablecoin (USDC/USDC/CADC/EURC): 50bsp (0.5%) per settlement",
		"ETH: 75bsp (0.75%) per settlement",
		"BTC: 80bsp (0.8%) per settlement"
	];
}
//#endregion
export { getFeeItems as t };
