export type IconName = 'Hammer' | 'Warehouse' | 'DoorClosed' | 'Fuel' | 'Truck' | 'Construction'
export interface Service { slug: string; title: string; icon: IconName; summary: string; detail: string; image: string; confirmed: boolean }
export interface Project { id: string; title: string; category: string; description: string; image: string; location: string | null; date: string | null; isPlaceholder: boolean }
