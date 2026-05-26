import { type Variants, type Transition } from 'framer-motion'

export const easeOutExpo: Transition['ease'] = [0.16, 1, 0.3, 1]
export const easeOutQuart: Transition['ease'] = [0.25, 1, 0.5, 1]

export const fadeUp: Variants = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.8, ease: easeOutExpo } },
}

export const fadeIn: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.6 } },
}

export const staggerContainer: Variants = {
  animate: { transition: { staggerChildren: 0.12 } },
}

export const scaleIn: Variants = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: easeOutExpo } },
}

export const slideInLeft: Variants = {
  initial: { opacity: 0, x: -40 },
  animate: { opacity: 1, x: 0, transition: { duration: 0.6, ease: easeOutExpo } },
}

export const slideInRight: Variants = {
  initial: { opacity: 0, x: 40 },
  animate: { opacity: 1, x: 0, transition: { duration: 0.6, ease: easeOutExpo } },
}

export const heroTextReveal: Variants = {
  initial: { opacity: 0, y: 40 },
  animate: { 
    opacity: 1, y: 0, 
    transition: { duration: 0.8, delay: 0.3, ease: easeOutExpo } 
  },
}

export const cardHover = {
  rest: { 
    y: 0, 
    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.06), 0 2px 4px -2px rgba(0,0,0,0.04)' 
  },
  hover: { 
    y: -4, 
    boxShadow: '0 20px 25px -5px rgba(0,0,0,0.08), 0 8px 10px -6px rgba(0,0,0,0.04)',
    transition: { duration: 0.5, ease: easeOutExpo }
  },
}