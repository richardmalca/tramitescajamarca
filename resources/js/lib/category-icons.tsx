import { Building2, Car, FileText, IdCard } from 'lucide-react';

export const CATEGORY_ICONS: Record<string, typeof FileText> = {
    identidad: IdCard,
    vehiculos: Car,
    municipal: Building2,
};

export const CATEGORY_TINTS = [
    'bg-[#EBD9C8] text-[#A94E30]',
    'bg-[#DCE3CF] text-[#5A6B45]',
    'bg-[#E4DFD3] text-[#6B6552]',
    'bg-[#F0DCC9] text-[#B3552F]',
];

export function categoryIcon(slug: string) {
    return CATEGORY_ICONS[slug] ?? FileText;
}
