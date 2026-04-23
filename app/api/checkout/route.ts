import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { stripe, toCents, calcDepositAmount } from "@/lib/stripe"
import { auth } from "@/lib/auth"
import { z } from "zod"

const checkoutSchema = z.object({
  items: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      brand: z.string(),
      price: z.number().positive(),
      quantity: z.number().int().positive(),
      imageUrl: z.string(),
      requiresDeposit: z.boolean(),
    })
  ).min(1),
  isDeposit: z.boolean().default(false),
})

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await req.json()
    const { items, isDeposit } = checkoutSchema.parse(body)

    const subtotal = items.reduce((acc, i) => acc + i.price * i.quantity, 0)
    const chargeAmount = isDeposit ? calcDepositAmount(subtotal) : subtotal

    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"

    // Build Stripe line items
    const lineItems = isDeposit
      ? [{
          price_data: {
            currency: "usd",
            product_data: {
              name: `Stash Street Order — 50% Deposit (${items.length} item${items.length > 1 ? "s" : ""})`,
              description: items.map((i: any) => `${i.brand} ${i.name}`).join(", "),
            },
            unit_amount: toCents(chargeAmount),
          },
          quantity: 1,
        }]
      : items.map((item: any) => ({
          price_data: {
            currency: "usd",
            product_data: {
              name: `${item.brand} — ${item.name}`,
              images: item.imageUrl ? [item.imageUrl] : [],
            },
            unit_amount: toCents(item.price),
          },
          quantity: item.quantity,
        }))

    // Create pending order in DB first
    const order = await prisma.order.create({
      data: {
        userId: session.user.id,
        status: "PENDING",
        total: subtotal,
        isDeposit,
        amountPaid: 0,
        expiresAt: new Date(Date.now() + 30 * 60 * 1000), // 30 min grace window
        items: {
          create: items.map((item: any) => ({
            productId: item.id,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
    })

    // Create Stripe checkout session
    const stripeSession = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${appUrl}/orders?success=true`,
      cancel_url: `${appUrl}/cart`,
      metadata: {
        orderId: order.id,
        userId: session.user.id,
        isDeposit: String(isDeposit),
      },
      customer_email: session.user.email ?? undefined,
    })

    // Save Stripe session ID to order
    await prisma.order.update({
      where: { id: order.id },
      data: { stripeSessionId: stripeSession.id },
    })

    return NextResponse.json({ url: stripeSession.url })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid cart data" }, { status: 422 })
    }
    console.error("[POST /api/checkout]", error)
    return NextResponse.json({ error: "Checkout failed" }, { status: 500 })
  }
}
