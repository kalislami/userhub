export interface User {
  uid: string;
  name?: string;
  email?: string;
  totalAverageWeightRatings?: number;
  numberOfRents?: number;
  recentlyActive?: number; // epoch time
  compositeScore?: number;
  status?: string; // online / offline
}