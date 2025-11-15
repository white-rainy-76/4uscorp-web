import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

interface CartItem {
  refillLiters: number
}

interface CartState {
  cart: { [stationId: string]: CartItem }
  fuelPlanId: string | null | undefined
}

interface CartActions {
  addToCart: (stationId: string, refillLiters: number) => void
  updateCartItem: (stationId: string, refillLiters: number) => void
  removeFromCart: (stationId: string) => void
  clearCart: () => void
  setCart: (cart: { [stationId: string]: CartItem }) => void
  setFuelPlanId: (fuelPlanId: string | null | undefined) => void
}

type CartStore = CartState & CartActions

const initialState: CartState = {
  cart: {},
  fuelPlanId: undefined,
}

export const useCartStore = create<CartStore>()(
  devtools(
    (set) => ({
      ...initialState,

      addToCart: (stationId, refillLiters) =>
        set(
          (state) => ({
            cart: {
              ...state.cart,
              [stationId]: { refillLiters },
            },
          }),
          undefined,
          'cart/addToCart',
        ),

      updateCartItem: (stationId, refillLiters) =>
        set(
          (state) => {
            if (state.cart[stationId]) {
              return {
                cart: {
                  ...state.cart,
                  [stationId]: { refillLiters },
                },
              }
            }
            return state
          },
          undefined,
          'cart/updateCartItem',
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
    }),
    {
      name: 'CartStore',
    },
  ),
)
