
export type DrinkCategory = 'hot' | 'coffee' | 'cold' | 'juice' | 'food';

export interface Drink {
  id: string;
  name: string;
  price: number;
  category: DrinkCategory;
  image: string;
}

export interface DoctorAd {
  id: string;
  name: string;
  specialty: string;
  location: string;
  image: string;
}

export interface OrderItem {
  drinkId: string;
  drinkName: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  items: OrderItem[];
  totalPrice: number;
  clinicName: string;
  clinicNumber?: string;
  floorNumber?: string;
  contactInfo: string;
  status: 'pending' | 'completed' | 'cancelled';
  timestamp: number;
  notes?: string;
}

export const CLINICS = [
  "عيادة الرمد",
  "عيادة الأطفال",
  "عيادة الباطنة",
  "عيادة النساء والتوليد",
  "عيادة العظام",
  "عيادة الأسنان",
  "المختبر (الممعمل)",
  "الصيدلية",
  "الاستقبال",
  "الإدارة"
];
