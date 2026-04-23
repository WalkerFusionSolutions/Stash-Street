import { NextRequest, NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"
import { prisma } from "@/lib/prisma"
import { headers } from "next/headers"
import Stripe from "stripe"

// Must disable body parser — Stripe needs raw body for signature verification
export const runtime = "nodejs"

export async function POST(req: NextRequest) {
  const body = await req.text()
  const signature = (await headers()).get("stripe-signature")

  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 })
  }

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (err) {
    console.error("[Webhook] Invalid signature:", err)
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
  }

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object
      const orderId = session.metadata?.orderId
      const isDeposit = session.metadata?.isDeposit === "true"
      const amountPaid = (session.amount_total ?? 0) / 100

      if (!orderId) {
        console.warn("[Webhook] No orderId in metadata")
        return NextResponse.json({ received: true })
      }

      await prisma.$transaction([
        prisma.order.update({
          where: { id: orderId },
          data: {
            status: (isDeposit ? "PARTIAL_PAID" : "PAID") as any,
            amountPaid,
          },
        }),
        prisma.payment.upsert({
          where: { stripeId: session.id },
          create: {
            orderId,
            amount: amountPaid,
            status: "PAID" as any,
            stripeId: session.id,
          },
          update: {
            status: "PAID" as any,
            amount: amountPaid,
          },
        }),
      ])

      // Decrement stock for each item
      const order = await prisma.order.findUnique({
        where: { id: orderId },
        include: { items: true },
      })
      if (order) {
        await Promise.all(
          order.items.map((item) =>
            prisma.product.update({
              where: { id: item.productId },
              data: { stock: { decrement: item.quantity } },
            })
          )
        )
      }
    }

    if (event.type === "checkout.session.expired") {
      const session = event.data.object
      const orderId = session.metadata?.orderId
      if (orderId) {
        await prisma.order.update({
          where: { id: orderId },
          data: { status: "CANCELLED" as any },
        })
      }
    }

    if (event.type === "charge.refunded") {
      const charge = event.data.object
      const paymentIntentId = typeof charge.payment_intent === "string" ? charge.payment_intent : null
      if (paymentIntentId) {
        await prisma.payment.updateMany({
          where: { stripeId: paymentIntentId },
          data: { status: "REFUNDED" as any },
        })
      }
    }
  } catch (error) {
    console.error("[Webhook] Handler error:", error)
    return NextResponse.json({ error: "Internal error" }, { status: 500 })
  }

  return NextResponse.json({ received: true })
}
