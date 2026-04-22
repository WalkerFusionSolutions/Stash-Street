import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { z } from "zod"

const productSchema = z.object({
  sku: z.string().min(1),
  name: z.string().min(1),
  brand: z.string().min(1),
  description: z.string().min(1),
  price: z.number().positive(),
  imageUrl: z.string().url(),
  stock: z.number().int().min(0).default(1),
  size: z.string().optional(),
  tag: z.enum(["HEAT", "GRAIL", "NEW", "LAST"]).optional(),
  requiresDeposit: z.boolean().default(false),
  active: z.boolean().default(true),
})

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const tag = searchParams.get("tag")
  const limit = parseInt(searchParams.get("limit") ?? "50", 10)

  try {
    const products = await prisma.product.findMany({
      where: {
        active: true,
        ...(tag && tag !== "ALL" ? { tag } : {}),
      },
      orderBy: [{ stock: "desc" }, { createdAt: "desc" }],
      take: Math.min(limit, 100),
    })
    return NextResponse.json({ products })
  } catch (error) {
    console.error("[GET /api/products]", error)
    return NextResponse.json({ error: "Failed to load products" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  try {
    const body = await req.json()
    const data = productSchema.parse(body)
    const product = await prisma.product.create({ data })
    return NextResponse.json({ product }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Validation failed", issues: error.issues }, { status: 422 })
    }
    console.error("[POST /api/products]", error)
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 })
  }
}
