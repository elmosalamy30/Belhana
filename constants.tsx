
import { Drink, DoctorAd } from './types';

export const MENU_ITEMS: Drink[] = [
  // --- المشروبات الساخنة (hot) ---
  { id: 'h1', name: 'شاي أحمر', price: 10, category: 'hot', image: 'https://archive.org/download/2019-2-13-14-10-46-764/__ia_thumb.jpg' },
  { id: 'h2', name: 'شاي فتلة', price: 15, category: 'hot', image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?q=80&w=400' },
  { id: 'h3', name: 'شاي كرك', price: 15, category: 'hot', image: 'https://images.unsplash.com/photo-1561336313-0bd5e0b27ec8?q=80&w=400' },
  { id: 'h4', name: 'يانسون', price: 15, category: 'hot', image: 'https://archive.org/download/images-9_20260129/__ia_thumb.jpg' },
  { id: 'h5', name: 'نسكافيه (عادي)', price: 15, category: 'hot', image: 'https://archive.org/download/images-10_20260129/__ia_thumb.jpg' },
  { id: 'h6', name: 'شاي بحليب', price: 15, category: 'hot', image: 'https://archive.org/download/29b-7b-8afa-4e-2cf-39e-7a-99937cd-83e-132/__ia_thumb.jpg' },
  { id: 'h7', name: 'نعناع', price: 15, category: 'hot', image: 'https://archive.org/download/image_5186dfd9-893e-4dee-8b51-d42a62e782f9_202601/__ia_thumb.jpg' },
  { id: 'h8', name: 'قرفة بحليب', price: 15, category: 'hot', image: 'https://archive.org/download/513_20260129/__ia_thumb.jpg' },
  { id: 'h9', name: 'كركديه', price: 15, category: 'hot', image: 'https://archive.org/download/tbl_articles_article_33392_345ab6847a8-320d-4ac7-b40b-6afff456d02f/__ia_thumb.jpg' },

  // --- القهوة (coffee) ---
  { id: 'q1', name: 'قهوة سادة', price: 20, category: 'coffee', image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=400' },
  { id: 'q2', name: 'قهوة زيادة', price: 20, category: 'coffee', image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=400' },
  { id: 'q3', name: 'قهوة على الريحة', price: 20, category: 'coffee', image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=400' },
  { id: 'q4', name: 'قهوة فرنساوي', price: 20, category: 'coffee', image: 'https://archive.org/download/113_20260129/__ia_thumb.jpg' },
  { id: 'q5', name: 'قهوة تركي', price: 20, category: 'coffee', image: 'https://archive.org/download/french-coffee-3/__ia_thumb.jpg' },
  { id: 'q6', name: 'قهوة تركي محوج', price: 20, category: 'coffee', image: 'https://archive.org/download/images-11_20260129/__ia_thumb.jpg' },
  { id: 'q7', name: 'نسكافيه بلاك', price: 20, category: 'coffee', image: 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?q=80&w=400' },
  { id: 'q8', name: 'نسكافيه حليب', price: 20, category: 'coffee', image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?q=80&w=400' },

  // --- المشروبات الغازية والمياه (cold) ---
  { id: 'c1', name: 'بيبسي', price: 20, category: 'cold', image: 'https://archive.org/download/f132784205396458038087-1/78e406f6-0e8e-4fdf-a670-043536bf0412-600x600_result_thumb.jpg' },
  { id: 'c2', name: 'بيبسي دايت', price: 20, category: 'cold', image: 'https://archive.org/download/f132784205396458038087-1/f132784205396458038087-1_thumb.jpg' },
  { id: 'c5', name: 'مياه معدنية صغيرة', price: 7, category: 'cold', image: 'https://archive.org/download/5269-ex-0/__ia_thumb.jpg' },
  { id: 'c6', name: 'مياه معدنية كبيرة', price: 12, category: 'cold', image: 'https://archive.org/download/baraka_202601/__ia_thumb.jpg' },

  // --- العصائر (juice) ---
  { id: 'j1', name: 'عصير جهينة تفاح', price: 15, category: 'juice', image: 'https://archive.org/download/images-12_20260129/images%20%2813%29_thumb.jpg' },
  { id: 'j2', name: 'عصير جهينة برتقال', price: 15, category: 'juice', image: 'https://archive.org/download/0004021-1-450/__ia_thumb.jpg' },
  { id: 'j3', name: 'عصير جهينة كوكتيل', price: 15, category: 'juice', image: 'https://archive.org/download/images-12_20260129/images%20%2814%29_thumb.jpg' },
  { id: 'j4', name: 'عصير جهينة مانجو', price: 15, category: 'juice', image: 'https://archive.org/download/images-12_20260129/images%20%2815%29_thumb.jpg' },

  // --- مأكولات جاهزة (food) ---
  { id: 'f1', name: 'إندومي خضار', price: 15, category: 'food', image: 'https://archive.org/download/71-mtb-9-tw-9i-l.-ac-uf-350-350-ql-80/__ia_thumb.jpg' },
  { id: 'f2', name: 'إندومي بالفراخ', price: 15, category: 'food', image: 'https://archive.org/download/images-12_20260129/images%20%2812%29_thumb.jpg' },
  { id: 'f3', name: 'إندومي لحمة', price: 15, category: 'food', image: 'https://archive.org/download/images-12_20260129/616-4DL9msL._AC_UF350%2C350_QL80__thumb.jpg' },
];

export const DOCTOR_ADS: DoctorAd[] = [
  { 
    id: 'd1', 
    name: 'د. أحمد سمير', 
    specialty: 'استشاري أمراض القلب', 
    location: 'عيادة 101 — الدور الأول', 
    image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=400&h=400&auto=format&fit=crop' 
  },
  { 
    id: 'd2', 
    name: 'د. ليلى حسن', 
    specialty: 'أخصائي الأمراض الجلدية', 
    location: 'عيادة 205 — الدور الثاني', 
    image: 'https://images.unsplash.com/photo-1559839734-2b71f153678b?q=80&w=400&h=400&auto=format&fit=crop' 
  },
  { 
    id: 'd3', 
    name: 'د. عمر فاروق', 
    specialty: 'أخصائي طب الأطفال', 
    location: 'عيادة G04 — الدور الأرضي', 
    image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=400&h=400&auto=format&fit=crop' 
  },
];

export const ADMIN_PASSWORD = "123456789";
export const ORDER_WHATSAPP = "201107223042"; 
export const ADS_WHATSAPP = "201107223041";   
export const ADMIN_EMAIL = "scs.info.official@gmail.com";
