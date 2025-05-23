export interface User {
  uid: string;
  name: string;
  totalAverageWeightRatings: number;
  numberOfRents: number;
  recentlyActive: number; // epoch time
}