"use client"

import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"

export type CartItem = {
  id: string
  sku: string
  name: string
  brand: string
  price: number
  imageUrl: string
  size: string | null
  quantity: number
  requiresDeposit: boolean
}

type CartStore = {
  items: CartItem[]
  addItem: (item: Omit<CartItem, "quantity">) => void
  removeItem: (id: string) => void
  updateQty: (id: string, quantity: number) => void
  clearCart: () => void
  totalItems: () => number
  subtotal: () => number
}

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem(incoming) {
        set((state) => {
          const existing = state.items.find((i) => i.id === incoming.id)
          if (existing) {
            // Streetwear = one-of-one stock; cap at 1
            return state
          }
          return { items: [...state.items, { ...incoming, quantity: 1 }] }
        })
      },

      removeItem(id) {
        set((state) => ({ items: state.items.filter((i) => i.id !== id) }))
      },

      updateQty(id, quantity) {
        if (quantity < 1) {
          get().removeItem(id)
          return
        }
        set((state) => ({
          items: state.items.map((i) => (i.id === id ? { ...i, quantity } : i)),
        }))
      },

      clearCart() {
        set({ items: [] })
      },

      totalItems() {
        return get().items.reduce((acc, i) => acc + i.quantity, 0)
      },

      subtotal() {
        return get().items.reduce((acc, i) => acc + i.price * i.quantity, 0)
      },
    }),
    {
      name: "stash-street-cart",
      storage: createJSONStorage(() => localStorage),
    }
  )
)
