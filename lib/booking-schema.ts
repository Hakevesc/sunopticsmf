import { z } from 'zod'

export const bookingSchema = z.object({
  service_id:        z.string().min(1, 'Please select a service'),
  staff_id:          z.string().optional(),
  booking_date:      z.string().min(1, 'Please select a date'),
  booking_time:      z.string().min(1, 'Please select a time slot'),
  first_name:        z.string().min(1, 'First name required'),
  last_name:         z.string().min(1, 'Last name required'),
  email:             z.string().email('Valid email required'),
  phone:             z.string().min(9, 'Valid phone required'),
  address:           z.string().optional(),
  reason:            z.string().optional(),
  special_requests:  z.string().optional(),
  guest_emails:      z.array(z.string().email()).max(10).optional(),
  glasses_interest:  z.array(z.string()).optional(),
})

export type BookingFormData = z.infer<typeof bookingSchema>

export const TIME_SLOTS = [
  '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
  '11:00', '11:30', '12:00', '14:00', '14:30', '15:00',
  '15:30', '16:00', '16:30', '17:00',
]