export interface AdminDashboardStatsDto {
  totalProducts: number;
  totalUsers: number;
  totalOrders: number;
  todayRevenue: number;
  
  revenueChartData: { 
    month: string; 
    monthly_revenue: number; 
  }[];
  
  topSellingProducts: { 
    productId: string | number; 
    name: string; 
    totalSold: number; 
  }[];
}

export interface AdminAnalyticsDto {
   revenueChartData: { 
     month: string; 
     monthly_revenue: number; 
   }[];

   topSellingProducts: { 
     id: string | number; 
     name: string; 
     value1: number; 
     value2: number;
   }[];
   
   topActiveUsers: { 
     id: string | number; 
     name: string; 
     value1: number; 
     value2: number;
   }[];
}


export interface UserDto {
  id: string | number;
  fullName: string;
  username: string;
  avatarURL: string;
  status: "Active" | "Banned";
  role: "BUYER" | "SELLER";
}