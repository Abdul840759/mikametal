import { Hammer, Warehouse, DoorClosed, Fuel, Truck, Construction } from 'lucide-react'
import type { IconName } from '../../types'
const map = { Hammer, Warehouse, DoorClosed, Fuel, Truck, Construction }
export default function ServiceIcon({ name, className }: { name: IconName; className?: string }) { const I = map[name]; return <I className={className} aria-hidden="true" /> }
