//#region node_modules/.nitro/vite/services/ssr/assets/fees-D0BkK9q3.js
function getFeeItems(accountType) {
	return accountType === "personal" ? ["Stablecoin (USDC/USDC/CADC/EURC): 50bsp (0.5%) per settlement", "ETH: 75bsp (0.75%) per settlement"] : ["Stablecoin (USDC/USDC/CADC/EURC): 30bsp (0.3%) per settlement", "ETH: 50bsp (0.5%) per settlement"];
}
//#endregion
export { getFeeItems as t };
