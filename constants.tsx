
import { Drink, DoctorAd } from './types';

export const MENU_ITEMS: Drink[] = [
  { 
    id: 'h1', 
    name: 'شاي أحمر', 
    price: 15, 
    category: 'hot', 
    image: 'https://images.unsplash.com/photo-1594631252845-29fc4586bd91?q=80&w=400&auto=format&fit=crop' 
  },
  { 
    id: 'h2', 
    name: 'قهوة سادة', 
    price: 25, 
    category: 'hot', 
    image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=400&auto=format&fit=crop' 
  },
  { 
    id: 'h3', 
    name: 'قهوة فرنساوي', 
    price: 35, 
    category: 'hot', 
    image: 'https://images.unsplash.com/photo-1541167760496-162955ed8a9f?q=80&w=400&auto=format&fit=crop' 
  },
  { 
    id: 'h4', 
    name: 'نسكافيه', 
    price: 30, 
    category: 'hot', 
    image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=400&auto=format&fit=crop' 
  },
  { 
    id: 'h5', 
    name: 'سحلب بالمكسرات', 
    price: 45, 
    category: 'hot', 
    image: 'https://images.unsplash.com/photo-1578314675249-a6910f80cc4e?q=80&w=400&auto=format&fit=crop' 
  },
  { 
    id: 'c1', 
    name: 'بيبسي / سفن', 
    price: 20, 
    category: 'cold', 
    image: 'https://images.unsplash.com/photo-1581006852262-e4307cf6283a?q=80&w=400&auto=format&fit=crop' 
  },
  { 
    id: 'c4', 
    name: 'مياه معدنية', 
    price: 10, 
    category: 'cold', 
    image: 'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?q=80&w=400&auto=format&fit=crop' 
  },
];

export const DOCTOR_ADS: DoctorAd[] = [
  { id: 'd1', name: 'د. أحمد علي', specialty: 'استشاري جراحة العظام', location: 'عيادة العظام - الدور الأول', image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=300&h=300&auto=format&fit=crop' },
  { id: 'd2', name: 'د. سارة محمود', specialty: 'أخصائي طب الأطفال', location: 'عيادة الأطفال - الدور الأرضي', image: 'https://images.unsplash.com/photo-1559839734-2b71f153678b?q=80&w=300&h=300&auto=format&fit=crop' },
  { id: 'd3', name: 'د. محمد حسن', specialty: 'استشاري أمراض الباطنة', location: 'عيادة الباطنة - الدور الثاني', image: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?q=80&w=300&h=300&auto=format&fit=crop' },
];

export const ADMIN_PASSWORD = "123";
export const ADMIN_WHATSAPP = "201000000000"; // قم بتغيير هذا الرقم لرقم المسؤول الحقيقي (بدون +)
