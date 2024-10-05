import { AuthProvider } from "@/enums/auth-provider";
import { Role } from "@/enums/role";
import { SQLModel } from "./default";

export interface User extends SQLModel {
  uid: string;
  first_name: string;
  last_name: string;
  business_name: string;
  name: string;
  email: string;
  role: Role;
  provider: AuthProvider;
  google_id?: string;
  facebook_id?: string;
  firebase_id?: string;
  apple_id?: string;
  avatar: string;
  phone_code: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  password: string;
  enable_2fa: boolean;
  send_email?: boolean;
  send_sms?: boolean;
  send_push?: boolean;
  last_login_at: string;
  status: string;
  geotag: boolean;
  referral_link: string;
  qr_code: string;
  connection_via: string;
  dispenser: any;
  dispenser_id: number;
}
