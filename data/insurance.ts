export type InsuranceInfo = {
  acceptedCategories: string[];
  serendibUrl: string;
};

export const insuranceInfo: InsuranceInfo = {
  acceptedCategories: ["HMO", "PPO", "Medi-Cal"],
  serendibUrl: "https://www.serendibhealthways.com",
};
