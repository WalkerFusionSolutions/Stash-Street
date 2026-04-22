import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { z } from "zod"

const customOrderSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  itemLink: z.string().url(),
  brand: z.string().optional(),
  size: z.string().min(1),
  colorway: z.string().optional(),
  budget: z.string().optional(),
  notes: z.string().optional(),
})

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    const body = await req.json()
    const data = customOrderSchema.parse(body)

    const customOrder = await prisma.customOrderRequest.create({
      data: {
        ...data,
        userId: session?.user.id ?? null,
        status: "PENDING",
      },
    })

    return NextResponse.json({ customOrder }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Validation failed", issues: error.issues }, { status: 422 })
    }
    console.error("[POST /api/custom-orders]", error)
    return NextResponse.json({ error: "Submission failed" }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  const session = await auth()
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const { searchParams } = req.nextUrl
  const status = searchParams.get("status")

  try {
    const orders = await prisma.customOrderRequest.findMany({
      where: status ? { status } : {},
      orderBy: { createdAt: "desc" },
      include: { user: { select: { name: true, email: true } } },
    })
    return NextResponse.json({ orders })
  } catch (error) {
    console.error("[GET /api/custom-orders]", error)
    return NextResponse.json({ error: "Failed to load requests" }, { status: 500 })
  }
}
