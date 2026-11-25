import { create } from 'zustand';
import { DELIVERY_ZONES, DEFAULT_FULFILLMENT, DEFAULT_PAYMENT } from '../data/config';

const nowIso = () => new Date().toLocaleString('en-GH', {
  timeZone: 'Africa/Accra',
  dateStyle: 'short',
  timeStyle: 'short',
});

const orderCode = () => `FST-${Date.now().toString().slice(-5)}`;

// Derived selectors — kept pure so every component recomputes on state change.
export const selectItemCount = (state) =>
  state.items.reduce((sum, i) => sum + i.qty, 0);

export const selectItemsSubtotal = (state) =>
  state.items.reduce(
    (sum, i) =>
      sum +
      (i.price + i.addOns.reduce((a, addOn) => a + addOn.price, 0)) * i.qty,
    0,
  );

export const selectDeliveryFee = (state) => {
  if (state.fulfillmentType === 'pickup') return 0;
  const zone = DELIVERY_ZONES.find((z) => z.id === state.zoneId);
  return zone ? zone.fee : 0;
};

export const selectGrandTotal = (state) =>
  selectItemsSubtotal(state) + selectDeliveryFee(state);

export const useCartStore = create((set) => ({
  items: [],
  notes: {},
  customerName: '',
  customerPhone: '',
  customerAddress: '',
  fulfillmentType: DEFAULT_FULFILLMENT,
  zoneId: DELIVERY_ZONES[0].id,
  payment: DEFAULT_PAYMENT,
  orderCode: orderCode(),
  orderTime: nowIso(),

  addItem: (item, selectedAddOnIds = [], qty = 1) => {
    set((state) => {
      const addOnIds = [...selectedAddOnIds].sort();
      const cartItemId = `${item.id}|${addOnIds.join(',')}`;

      const existing = state.items.find((i) => i.cartItemId === cartItemId);

      const newItems = existing
        ? state.items.map((i) =>
            i.cartItemId === cartItemId ? { ...i, qty: i.qty + qty } : i,
          )
        : [
            ...state.items,
            {
              cartItemId,
              id: item.id,
              name: item.name,
              price: item.price,
              image: item.image,
              addOns: addOnIds.map((aid) => {
                const addOn = item.addOns.find((a) => a.id === aid);
                return addOn ? { id: addOn.id, name: addOn.name, price: addOn.price } : null;
              }).filter(Boolean),
              qty,
            },
          ];

      return { items: newItems };
    });
  },

  removeItem: (cartItemId) => {
    set((state) => ({
      items: state.items.filter((i) => i.cartItemId !== cartItemId),
      notes: Object.fromEntries(
        Object.entries(state.notes).filter(([key]) => key !== cartItemId),
      ),
    }));
  },

  updateQuantity: (cartItemId, qty) => {
    set((state) => {
      const nextQty = Math.max(0, qty);
      // Remove the line entirely when quantity hits zero.
      const items = state.items
        .map((i) => (i.cartItemId === cartItemId ? { ...i, qty: nextQty } : i))
        .filter((i) => i.qty > 0);
      const notes = Object.fromEntries(
        Object.entries(state.notes).filter(([key]) => key !== cartItemId || nextQty > 0),
      );
      return { items, notes };
    });
  },

  addNote: (cartItemId, note) => {
    set((state) => ({
      notes: { ...state.notes, [cartItemId]: note },
    }));
  },

  setCustomerInfo: (name, phone, address) =>
    set({ customerName: name, customerPhone: phone, customerAddress: address }),

  setFulfillment: (type) => set({ fulfillmentType: type }),
  setZone: (zoneId) => set({ zoneId }),
  setPayment: (payment) => set({ payment }),

  clearCart: () => set({
    items: [],
    notes: {},
    customerName: '',
    customerPhone: '',
    customerAddress: '',
    orderCode: orderCode(),
    orderTime: nowIso(),
  }),
}));