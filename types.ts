
export type DrinkCategory = 'hot' | 'cold';

export interface Drink {
  id: string;
  name: string;
  price: number;
  category: DrinkCategory;
  image: string;
}

export interface Order {
  id: string;
  drinkName: string;
  clinicName: string;
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
  "المختبر (المعمل)",
  "الصيدلية",
  "الاستقبال",
  "الإدارة"
];
