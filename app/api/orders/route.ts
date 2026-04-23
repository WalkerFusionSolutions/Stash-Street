import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"

export async function GET(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const isAdmin = session.user.role === "ADMIN"
  const { searchParams } = req.nextUrl

  try {
    if (isAdmin) {
      const status = searchParams.get("status")
      const orders = await prisma.order.findMany({
        where: status ? { status: status as any } : {},
        include: {
          user: { select: { name: true, email: true } },
          items: { include: { product: { select: { name: true, brand: true } } } },
        },
        orderBy: { createdAt: "desc" },
      })
      return NextResponse.json({ orders })
    }

    // Regular user — own orders only
    const orders = await prisma.order.findMany({
      where: { userId: session.user.id },
      include: {
        items: { include: { product: { select: { name: true, brand: true, imageUrl: true } } } },
      },
      orderBy: { createdAt: "desc" },
    })
    return NextResponse.json({ orders })
  } catch (error) {
    console.error("[GET /api/orders]", error)
    return NextResponse.json({ error: "Failed to load orders" }, { status: 500 })
  }
}
