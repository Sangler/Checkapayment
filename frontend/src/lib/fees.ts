export type AccountType = "business" | "personal";

export function getFeeItems(accountType?: AccountType) {
  return accountType === "personal"
    ? [
        "Stablecoin (USDC/USDC/CADC/EURC): 50bsp (0.5%) per settlement",
        "ETH: 75bsp (0.75%) per settlement",
      ]
    : [
        "Stablecoin (USDC/USDC/CADC/EURC): 30bsp (0.3%) per settlement",
        "ETH: 50bsp (0.5%) per settlement",
      ];
}
