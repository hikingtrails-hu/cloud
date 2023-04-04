import { v4 as uuidv4 } from 'uuid'
import format from 'date-fns/format'

export const uniqueId = () =>
    [format(new Date(), 'yyyy_MM_dd_HH_mm_ss'), uuidv4().replaceAll('-', '')].join('__')

export function generateId(): string {
    return uuidv4().replace(/-/g, '')
}
