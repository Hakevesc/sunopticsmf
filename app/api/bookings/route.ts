import { NextResponse } from 'next/server'
import { bookingSchema } from '@/lib/booking-schema'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const validated = bookingSchema.parse(body)

    // In production, insert to Supabase:
    // const supabase = await createSupabaseServerClient()
    // const { data, error } = await supabase
    //   .from('bookings')
    //   .insert([{ ...validated, booking_date: validated.booking_date.toISOString().split('T')[0] }])
    //   .select()
    //   .single()

    return NextResponse.json({
      success: true,
      booking: {
        id: crypto.randomUUID(),
        ...validated,
        booking_date: validated.booking_date,
        status: 'pending',
        created_at: new Date().toISOString(),
      },
    }, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid booking data' },
      { status: 400 }
    )
  }
}

export async function GET() {
  // In production, fetch from Supabase
  return NextResponse.json({ bookings: [] })
}