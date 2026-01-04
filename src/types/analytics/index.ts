export interface MixpanelProfile {
  
  distinctId: string;
  $name: string;
  $email: string;
  $avatar?: string;
  $created: string;      
  $city?: string;
  $region?: string;
  $country_code?: string;
  $os?: string;          
  
  
  customAttributes: {
    age: number;
    credit_score: number;
    net_worth_usd: number;
    connected_accounts: number;
    products: string[]; 
    geo_source?: string;
    updated_at?: string;
  };
}