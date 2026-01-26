
export type DrinkCategory = 'hot' | 'cold';

export interface Drink {
  id: string;
  name: string;
  price: number;
  category: DrinkCategory;
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
