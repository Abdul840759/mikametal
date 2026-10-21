import { company } from '../config/company'
export const waLink = (text?: string) => company.whatsapp ? `https://wa.me/${company.whatsapp.replace(/\D/g, '')}${text ? `?text=${encodeURIComponent(text)}` : ''}` : null
