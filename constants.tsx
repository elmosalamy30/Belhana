
import { Drink, DoctorAd } from './types';

export const MENU_ITEMS: Drink[] = [
  { id: 'h1', name: 'شاي أحمر', price: 10, category: 'hot', image: 'https://images.unsplash.com/photo-1544787210-282dc9ef0b6e?q=80&w=400&h=300&auto=format&fit=crop' },
  { id: 'h2', name: 'قهوة سادة', price: 15, category: 'hot', image: 'https://images.unsplash.com/photo-1541167760496-162955ed8a9f?q=80&w=400&h=300&auto=format&fit=crop' },
  { id: 'h3', name: 'قهوة فرنساوي', price: 20, category: 'hot', image: 'https://images.unsplash.com/photo-1512568433529-59987c89e118?q=80&w=400&h=300&auto=format&fit=crop' },
  { id: 'h4', name: 'نسكافيه', price: 25, category: 'hot', image: 'https://images.unsplash.com/photo-1552683325-09514e86a98f?q=80&w=400&h=300&auto=format&fit=crop' },
  { id: 'h5', name: 'سحلب بالمكسرات', price: 30, category: 'hot', image: 'https://images.unsplash.com/photo-1603566030512-701382900742?q=80&w=400&h=300&auto=format&fit=crop' },
  { id: 'h6', name: 'يانسون', price: 12, category: 'hot', image: 'https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=400&h=300&auto=format&fit=crop' },
  { id: 'c1', name: 'بيبسي', price: 15, category: 'cold', image: 'https://images.unsplash.com/photo-1553456523-22d5138f3223?q=80&w=400&h=300&auto=format&fit=crop' },
  { id: 'c2', name: 'سفن أب', price: 15, category: 'cold', image: 'https://images.unsplash.com/photo-1622483767028-3f66f34aef97?q=80&w=400&h=300&auto=format&fit=crop' },
  { id: 'c3', name: 'ميريندا برتقال', price: 15, category: 'cold', image: 'https://images.unsplash.com/photo-1624517452488-04869289c4ca?q=80&w=400&h=300&auto=format&fit=crop' },
  { id: 'c4', name: 'مياه معدنية', price: 7, category: 'cold', image: 'https://images.unsplash.com/photo-1559839914-17aae19cea9e?q=80&w=400&h=300&auto=format&fit=crop' },
];

export const DOCTOR_ADS: DoctorAd[] = [
  { id: 'd1', name: 'د. أحمد علي', specialty: 'استشاري جراحة العظام', location: 'عيادة العظام - الدور الأول', image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=300&h=300&auto=format&fit=crop' },
  { id: 'd2', name: 'د. سارة محمود', specialty: 'أخصائي طب الأطفال', location: 'عيادة الأطفال - الدور الأرضي', image: 'https://images.unsplash.com/photo-1559839734-2b71f153678b?q=80&w=300&h=300&auto=format&fit=crop' },
  { id: 'd3', name: 'د. محمد حسن', specialty: 'استشاري أمراض الباطنة', location: 'عيادة الباطنة - الدور الثاني', image: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?q=80&w=300&h=300&auto=format&fit=crop' },
];

export const ADMIN_PASSWORD = "123456789";
