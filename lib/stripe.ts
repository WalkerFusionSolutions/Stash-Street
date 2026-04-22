import Stripe from "stripe"

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-03-31.basil",
  typescript: true,
})

/** Deposit = 50% of total, rounded to 2 dp */
export function calcDepositAmount(total: number): number {
  return Math.round(total * 0.5 * 100) / 100
}

/** Convert XCD/USD dollars to Stripe cents */
export function toCents(dollars: number): number {
  return Math.round(dollars * 100)
}
