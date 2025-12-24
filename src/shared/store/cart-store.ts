import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

interface CartItem {
  refillLiters: number
  fuelBeforeRefill?: number
}

interface CartState {
  cart: { [stationId: string]: CartItem }
  fuelPlanId: string | null | undefined
  selectedProviders: string[]
}

interface CartActions {
  addToCart: (
    stationId: string,
    refillLiters: number,
    fuelBeforeRefill?: number,
  ) => void
  updateCartItem: (
    stationId: string,
    refillLiters: number,
    fuelBeforeRefill?: number,
  ) => void
  updateFuelBeforeRefill: (stationId: string, fuelBeforeRefill: number) => void
  removeFromCart: (stationId: string) => void
  clearCart: () => void
  setCart: (cart: { [stationId: string]: CartItem }) => void
  setFuelPlanId: (fuelPlanId: string | null | undefined) => void
  setSelectedProviders: (providers: string[]) => void
}

type CartStore = CartState & CartActions

const initialState: CartState = {
  cart: {},
  fuelPlanId: undefined,
  selectedProviders: [],
}

export const useCartStore = create<CartStore>()(
  devtools(
    (set) => ({
      ...initialState,

      addToCart: (stationId, refillLiters, fuelBeforeRefill) =>
        set(
          (state) => ({
            cart: {
              ...state.cart,
              [stationId]: {
                refillLiters,
                ...(fuelBeforeRefill !== undefined && { fuelBeforeRefill }),
              },
            },
          }),
          undefined,
          'cart/addToCart',
        ),

      updateCartItem: (stationId, refillLiters, fuelBeforeRefill) =>
        set(
          (state) => {
            if (state.cart[stationId]) {
              return {
                cart: {
                  ...state.cart,
                  [stationId]: {
                    refillLiters,
                    ...(fuelBeforeRefill !== undefined && { fuelBeforeRefill }),
                  },
                },
              }
            }
            return state
          },
          undefined,
          'cart/updateCartItem',
        ),

      updateFuelBeforeRefill: (stationId, fuelBeforeRefill) =>
        set(
          (state) => {
            if (state.cart[stationId]) {
              return {
                cart: {
                  ...state.cart,
                  [stationId]: {
                    ...state.cart[stationId],
                    fuelBeforeRefill,
                  },
                },
              }
            }
            return state
          },
          undefined,
          'cart/updateFuelBeforeRefill',
        ),

      removeFromCart: (stationId) =>
        set(
          (state) => {
            const { [stationId]: removed, ...rest } = state.cart
            return { cart: rest }
          },
          undefined,
          'cart/removeFromCart',
        ),

      clearCart: () => set(initialState, undefined, 'cart/clearCart'),

      setCart: (cart) => set({ cart }, undefined, 'cart/setCart'),

      setFuelPlanId: (fuelPlanId) =>
        set({ fuelPlanId }, undefined, 'cart/setFuelPlanId'),

      setSelectedProviders: (selectedProviders) =>
        set({ selectedProviders }, undefined, 'cart/setSelectedProviders'),
    }),
    {
      name: 'CartStore',
    },
  ),
)
