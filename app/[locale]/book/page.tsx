'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Check, ArrowRight, ArrowLeft, ScanEye, Glasses, Calendar, AlertCircle } from 'lucide-react'
import { bookingSchema, TIME_SLOTS, type BookingFormData } from '@/lib/booking-schema'
import { supabase } from '@/lib/supabase'

const steps = ['Select Service', 'Date & Time', 'Your Details']

interface Service {
  id: string
  name_en: string
  description_en: string | null
  icon_name: string | null
}

interface GlassOption {
  id: string
  name_en: string
}

function DynamicIcon({ name, size = 22 }: { name: string | null; size?: number }) {
  return name === 'glasses' ? <Glasses size={size} /> : <ScanEye size={size} />
}

function StepIndicator({ currentStep }: { currentStep: number }) {
  return (
    <div className="flex items-center justify-center gap-0 mb-12">
      {steps.map((label, i) => (
        <div key={i} className="flex items-center">
          <div className="flex flex-col items-center gap-2">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center
                            text-sm font-bold transition-all duration-500
              ${i < currentStep
                ? 'bg-primary text-white shadow-primary'
                : i === currentStep
                  ? 'bg-primary text-white shadow-primary-lg scale-110'
                  : 'bg-gray-100 text-gray-400'}`}>
              {i < currentStep ? <Check size={18} /> : i + 1}
            </div>
            <span className={`text-xs font-medium transition-colors duration-300
              ${i <= currentStep ? 'text-primary' : 'text-gray-400'}`}>
              {label}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div className={`w-16 lg:w-24 h-0.5 mx-2 rounded-full transition-all duration-500
              ${i < currentStep ? 'bg-primary' : 'bg-gray-200'}`} />
          )}
        </div>
      ))}
    </div>
  )
}

export default function BookingPage() {
  const [step, setStep] = useState(0)
  const [services, setServices] = useState<Service[]>([])
  const [glassesOptions, setGlassesOptions] = useState<GlassOption[]>([])
  const [selectedService, setSelectedService] = useState<string | null>(null)
  const [selectedDate, setSelectedDate] = useState<string>('')
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [bookingRef, setBookingRef] = useState('')
  const [submitError, setSubmitError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
  })

  // Fetch services + glasses from DB
  useEffect(() => {
    async function fetchOptions() {
      const { data: svc } = await supabase
        .from('services')
        .select('id, name_en, description_en, icon_name')
        .eq('is_active', true)
        .order('display_order', { ascending: true })

      if (svc && svc.length > 0) setServices(svc as Service[])

      const { data: g } = await supabase
        .from('glasses')
        .select('id, name_en')
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(20)

      if (g) setGlassesOptions(g as GlassOption[])
    }
    fetchOptions()
  }, [])

  const handleServiceSelect = (serviceId: string) => {
    setSelectedService(serviceId)
    setValue('service_id', serviceId, { shouldValidate: true })
  }

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSelectedDate(value)
    setValue('booking_date', value, { shouldValidate: true })
  }

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time)
    setValue('booking_time', time, { shouldValidate: true })
  }

  const onSubmit = async (data: BookingFormData) => {
    setSubmitting(true)
    setSubmitError('')

    try {
      const payload = {
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        phone: data.phone,
        address: data.address || null,
        service_id: data.service_id,
        booking_date: data.booking_date,
        booking_time: data.booking_time,
        reason: data.reason || null,
        special_requests: data.special_requests || null,
        glasses_interest: data.glasses_interest && data.glasses_interest.length > 0
          ? data.glasses_interest
          : null,
        status: 'pending',
      }

      const { data: inserted, error } = await supabase
        .from('bookings')
        .insert(payload)
        .select('id')
        .single()

      if (error || !inserted) {
        throw new Error(error?.message || 'Failed to submit booking')
      }

      setBookingRef(inserted.id.slice(0, 8).toUpperCase())
      setIsSubmitted(true)
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Could not submit booking. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  // Minimum bookable date = today
  const today = new Date().toISOString().split('T')[0]

  const selectedServiceObj = services.find(s => s.id === selectedService)
  const isOpticalDispensary = selectedServiceObj?.name_en?.toLowerCase().includes('optical')

  return (
    <section className="py-section mt-20">
      <div className="max-w-3xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-8">
          <p className="pretitle">Book Online</p>
          <h1 className="text-[clamp(2rem,4vw,3rem)] font-bold text-black">Book an Appointment</h1>
        </div>

        {!isSubmitted ? (
          <>
            <StepIndicator currentStep={step} />

            <AnimatePresence mode="wait">
              {step === 0 && (
                <motion.div
                  key="step-1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <div className="grid gap-4">
                    <p className="text-sm font-medium text-charcoal mb-2">Select a Service</p>
                    {services.length === 0 && (
                      <p className="text-sm text-gray-400">Loading services...</p>
                    )}
                    {services.map((service) => (
                      <button
                        key={service.id}
                        type="button"
                        onClick={() => handleServiceSelect(service.id)}
                        className={`relative p-6 rounded-2xl border-2 text-left
                                    transition-all duration-300
                          ${selectedService === service.id
                            ? 'border-primary bg-primary-50 shadow-primary'
                            : 'border-gray-200 hover:border-primary/30 hover:bg-gray-50'}`}
                      >
                        <div className="flex items-start gap-4">
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center
                            ${selectedService === service.id
                              ? 'bg-primary text-white'
                              : 'bg-gray-100 text-gray-400'}`}>
                            <DynamicIcon name={service.icon_name} size={22} />
                          </div>
                          <div className="text-left">
                            <h3 className="font-semibold text-charcoal">{service.name_en}</h3>
                            {service.description_en && (
                              <p className="text-sm text-gray-500 mt-1">{service.description_en}</p>
                            )}
                          </div>
                        </div>
                        {selectedService === service.id && (
                          <div className="absolute top-4 right-4 w-6 h-6 rounded-full bg-primary
                                          flex items-center justify-center">
                            <Check size={14} className="text-white" />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>

                  {isOpticalDispensary && glassesOptions.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="mt-6 p-6 bg-primary-50 rounded-2xl border border-primary/10"
                    >
                      <p className="font-medium text-charcoal mb-4">
                        Interested in any specific frame styles?
                      </p>
                      <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
                        {glassesOptions.map((g) => (
                          <label key={g.id}
                            className="flex items-center gap-2.5 text-sm cursor-pointer
                                       p-2 rounded-lg hover:bg-primary-100/50 transition-colors">
                            <input type="checkbox" value={g.id} {...register('glasses_interest')}
                              className="rounded border-gray-300 text-primary
                                         focus:ring-primary/30" />
                            {g.name_en}
                          </label>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  <div className="flex justify-end mt-8">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      disabled={!selectedService}
                      className="inline-flex items-center gap-2 bg-primary text-white
                                 rounded-full px-8 py-3 text-sm font-medium
                                 hover:bg-primary-dark transition-all duration-300
                                 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Continue <ArrowRight size={16} />
                    </button>
                  </div>
                </motion.div>
              )}

              {step === 1 && (
                <motion.div
                  key="step-2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <div className="mb-6">
                    <label htmlFor="booking-date" className="block text-sm font-medium text-charcoal mb-2">
                      Select a Date
                    </label>
                    <div className="relative">
                      <Calendar size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                      <input
                        id="booking-date"
                        type="date"
                        min={today}
                        value={selectedDate}
                        onChange={handleDateChange}
                        className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200
                                   text-sm focus:border-primary focus:ring-1 focus:ring-primary/30
                                   transition-all duration-300 outline-none"
                      />
                    </div>
                    {errors.booking_date && (
                      <p className="text-xs text-red-500 mt-1">{errors.booking_date.message}</p>
                    )}
                  </div>

                  <p className="text-sm font-medium text-charcoal mb-4">Select a Time Slot</p>
                  <div className="grid grid-cols-4 gap-2">
                    {TIME_SLOTS.map((time) => (
                      <button
                        key={time}
                        type="button"
                        onClick={() => handleTimeSelect(time)}
                        className={`py-2.5 rounded-xl text-sm font-medium transition-all duration-300
                          ${selectedTime === time
                            ? 'bg-primary text-white shadow-primary'
                            : 'bg-gray-50 text-charcoal hover:bg-primary-50 hover:text-primary'}`}
                      >
                        {time}
                      </button>
                    ))}
                  </div>

                  <div className="flex justify-between mt-8">
                    <button
                      type="button"
                      onClick={() => setStep(0)}
                      className="inline-flex items-center gap-2 text-gray-500
                                 hover:text-charcoal transition-all duration-300"
                    >
                      <ArrowLeft size={16} /> Back
                    </button>
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      disabled={!selectedTime || !selectedDate}
                      className="inline-flex items-center gap-2 bg-primary text-white
                                 rounded-full px-8 py-3 text-sm font-medium
                                 hover:bg-primary-dark transition-all duration-300
                                 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Continue <ArrowRight size={16} />
                    </button>
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="step-3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <form onSubmit={handleSubmit(onSubmit)}>
                    {submitError && (
                      <div className="mb-6 flex items-start gap-2 p-3 rounded-xl bg-red-50 border border-red-100 text-sm text-red-600">
                        <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
                        <span>{submitError}</span>
                      </div>
                    )}

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-charcoal mb-1">First Name</label>
                        <input {...register('first_name')}
                          className="w-full px-4 py-2.5 rounded-xl border border-gray-200
                                   text-sm focus:border-primary focus:ring-1 focus:ring-primary/30
                                   transition-all duration-300 outline-none"
                          placeholder="Your first name" />
                        {errors.first_name && <p className="text-xs text-red-500 mt-1">{errors.first_name.message}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-charcoal mb-1">Last Name</label>
                        <input {...register('last_name')}
                          className="w-full px-4 py-2.5 rounded-xl border border-gray-200
                                   text-sm focus:border-primary focus:ring-1 focus:ring-primary/30
                                   transition-all duration-300 outline-none"
                          placeholder="Your last name" />
                        {errors.last_name && <p className="text-xs text-red-500 mt-1">{errors.last_name.message}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-charcoal mb-1">Email</label>
                        <input type="email" {...register('email')}
                          className="w-full px-4 py-2.5 rounded-xl border border-gray-200
                                   text-sm focus:border-primary focus:ring-1 focus:ring-primary/30
                                   transition-all duration-300 outline-none"
                          placeholder="your@email.com" />
                        {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-charcoal mb-1">Phone</label>
                        <input type="tel" {...register('phone')}
                          className="w-full px-4 py-2.5 rounded-xl border border-gray-200
                                   text-sm focus:border-primary focus:ring-1 focus:ring-primary/30
                                   transition-all duration-300 outline-none"
                          placeholder="09XX XXX XXX" />
                        {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone.message}</p>}
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-charcoal mb-1">Address (Optional)</label>
                        <input {...register('address')}
                          className="w-full px-4 py-2.5 rounded-xl border border-gray-200
                                   text-sm focus:border-primary focus:ring-1 focus:ring-primary/30
                                   transition-all duration-300 outline-none"
                          placeholder="Your address" />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-charcoal mb-1">Special Requests (Optional)</label>
                        <textarea {...register('special_requests')}
                          rows={3}
                          className="w-full px-4 py-2.5 rounded-xl border border-gray-200
                                   text-sm focus:border-primary focus:ring-1 focus:ring-primary/30
                                   transition-all duration-300 outline-none resize-none"
                          placeholder="Any special requests..." />
                      </div>
                    </div>

                    <div className="flex justify-between mt-8">
                      <button
                        type="button"
                        onClick={() => setStep(1)}
                        className="inline-flex items-center gap-2 text-gray-500
                                   hover:text-charcoal transition-all duration-300"
                      >
                        <ArrowLeft size={16} /> Back
                      </button>
                      <button
                        type="submit"
                        disabled={submitting}
                        className="inline-flex items-center gap-2 bg-primary text-white
                                   rounded-full px-10 py-3 text-sm font-medium
                                   hover:bg-primary-dark transition-all duration-300
                                   disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {submitting ? 'Submitting...' : 'Book Now'} <ArrowRight size={16} />
                      </button>
                    </div>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-20 max-w-md mx-auto"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
              className="w-20 h-20 bg-green-50 rounded-full flex items-center
                         justify-center mx-auto mb-6"
            >
              <Check className="text-green-600 w-10 h-10" />
            </motion.div>
            <h2 className="text-2xl font-bold text-charcoal mb-3">Booking Confirmed!</h2>
            <p className="text-gray-500 mb-2">
              We&apos;ll contact you to confirm your appointment.
            </p>
            <div className="inline-flex items-center gap-2 bg-primary-50 rounded-full
                            px-5 py-2 mt-4">
              <span className="text-xs text-primary font-medium">Reference:</span>
              <span className="text-sm text-primary font-bold font-mono">
                #{bookingRef}
              </span>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  )
}
