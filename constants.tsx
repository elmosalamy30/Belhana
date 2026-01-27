
import { Drink, DoctorAd } from './types';

export const MENU_ITEMS: Drink[] = [
  // --- المشروبات الساخنة (hot) ---
  { id: 'h1', name: 'شاي أحمر', price: 10, category: 'hot', image: 'https://images.unsplash.com/photo-1594631252845-29fc4586bd91?q=80&w=400' },
  { id: 'h2', name: 'شاي فتلة', price: 15, category: 'hot', image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?q=80&w=400' },
  { id: 'h3', name: 'شاي كرك', price: 15, category: 'hot', image: 'https://images.unsplash.com/photo-1561336313-0bd5e0b27ec8?q=80&w=400' },
  { id: 'h4', name: 'يانسون', price: 15, category: 'hot', image: 'https://images.unsplash.com/photo-1515696423063-0b0930867809?q=80&w=400' },
  { id: 'h5', name: 'نسكافيه (عادي)', price: 15, category: 'hot', image: 'https://images.unsplash.com/photo-1541167760496-162955ed8a9f?q=80&w=400' },
  { id: 'h6', name: 'شاي بحليب', price: 15, category: 'hot', image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?q=80&w=400' },
  { id: 'h7', name: 'نعناع', price: 15, category: 'hot', image: 'https://images.unsplash.com/photo-1499028344343-cd173ffc68a9?q=80&w=400' },
  { id: 'h8', name: 'قرفة بحليب', price: 15, category: 'hot', image: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=400' },
  { id: 'h9', name: 'كركديه', price: 15, category: 'hot', image: 'https://images.unsplash.com/photo-1623861803926-38292f767115?q=80&w=400' },

  // --- القهوة (coffee) ---
  { id: 'q1', name: 'قهوة سادة', price: 20, category: 'coffee', image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=400' },
  { id: 'q2', name: 'قهوة زيادة', price: 20, category: 'coffee', image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=400' },
  { id: 'q3', name: 'قهوة على الريحة', price: 20, category: 'coffee', image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=400' },
  { id: 'q4', name: 'قهوة فرنساوي', price: 20, category: 'coffee', image: 'https://images.unsplash.com/photo-1534773728080-33d31da27ae5?q=80&w=400' },
  { id: 'q5', name: 'قهوة تركي', price: 20, category: 'coffee', image: 'https://images.unsplash.com/photo-1579992357154-faf4bfe95b3d?q=80&w=400' },
  { id: 'q6', name: 'قهوة تركي محوج', price: 20, category: 'coffee', image: 'https://images.unsplash.com/photo-1580915411954-282cb1b0d780?q=80&w=400' },
  { id: 'q7', name: 'نسكافيه بلاك', price: 20, category: 'coffee', image: 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?q=80&w=400' },
  { id: 'q8', name: 'نسكافيه حليب', price: 20, category: 'coffee', image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?q=80&w=400' },

  // --- المشروبات الغازية والمياه (cold) ---
  { id: 'c1', name: 'بيبسي', price: 20, category: 'cold', image: 'https://images.unsplash.com/photo-1581639050676-1e9ca90efd50?q=80&w=400' },
  { id: 'c2', name: 'بيبسي دايت', price: 20, category: 'cold', image: 'https://images.unsplash.com/photo-1629203851022-36c64237d946?q=80&w=400' },
  { id: 'c3', name: 'فيروز', price: 20, category: 'cold', image: 'https://images.unsplash.com/photo-1625772290748-39123d81861e?q=80&w=400' },
  { id: 'c4', name: '7 أب', price: 20, category: 'cold', image: 'https://images.unsplash.com/photo-1622708782596-13d9e605dcad?q=80&w=400' },
  { id: 'c5', name: 'مياه معدنية صغيرة', price: 7, category: 'cold', image: 'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?q=80&w=400' },
  { id: 'c6', name: 'مياه معدنية كبيرة', price: 12, category: 'cold', image: 'https://images.unsplash.com/photo-1560023907-5f339617ea30?q=80&w=400' },

  // --- العصائر (juice) ---
  { id: 'j1', name: 'عصير تفاح جهينة', price: 15, category: 'juice', image: 'https://images.unsplash.com/photo-1568909344668-6f14a07b56a0?q=80&w=400' },
  { id: 'j2', name: 'عصير برتقال جهينة', price: 15, category: 'juice', image: 'https://images.unsplash.com/photo-1600271886301-37103719888d?q=80&w=400' },
  { id: 'j3', name: 'عصير كوكتيل جهينة', price: 15, category: 'juice', image: 'https://images.unsplash.com/photo-1603569283847-aa295f0d016a?q=80&w=400' },
  { id: 'j4', name: 'عصير مانجا جهينة', price: 15, category: 'juice', image: 'https://images.unsplash.com/photo-1591073113125-e46713c829ed?q=80&w=400' },

  // --- مأكولات جاهزة (food) ---
  { id: 'f1', name: 'إندومي خضار', price: 15, category: 'food', image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?q=80&w=400' },
  { id: 'f2', name: 'إندومي بالفراخ', price: 15, category: 'food', image: 'https://images.unsplash.com/photo-1552611052-33e04de081de?q=80&w=400' },
  { id: 'f3', name: 'إندومي باللحمة', price: 15, category: 'food', image: 'https://images.unsplash.com/photo-1612927601601-6638404737ce?q=80&w=400' },
];

export const DOCTOR_ADS: DoctorAd[] = [
  { 
    id: 'd4', 
    name: 'د. محمد أشرف', 
    specialty: 'طبيب أسنان', 
    location: 'عيادة 310 - الدور الثالث', 
    image: 'https://archive.org/download/screenshot-2026-01-26-21-25-23-60-99c-04817c-0de-5652397fc-8b-56c-3b-3817/__ia_thumb.jpg' 
  },
  { id: 'd1', name: 'د. أحمد علي', specialty: 'استشاري جراحة العظام', location: 'عيادة العظام - الدور الأول', image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=300&h=300&auto=format&fit=crop' },
  { id: 'd2', name: 'د. سارة محمود', specialty: 'أخصائي طب الأطفال', location: 'عيادة الأطفال - الدور الأرضي', image: 'https://images.unsplash.com/photo-1559839734-2b71f153678b?q=80&w=300&h=300&auto=format&fit=crop' },
  { id: 'd3', name: 'د. محمد حسن', specialty: 'استشاري أمراض الباطنة', location: 'عيادة الباطنة - الدور الثاني', image: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?q=80&w=300&h=300&auto=format&fit=crop' },
];

export const ADMIN_PASSWORD = "123456789";
export const ORDER_WHATSAPP = "201107223042"; // الرقم الجديد لتأكيد الأوردر
export const ADS_WHATSAPP = "201107223041";   // رقم التواصل الإعلاني (SCS)
export const ADMIN_EMAIL = "scs.info.official@gmail.com";
