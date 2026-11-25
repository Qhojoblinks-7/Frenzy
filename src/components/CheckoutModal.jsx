import { useState } from 'react';
import { useCartStore, selectItemsSubtotal } from '../state/useCartStore';
import { DELIVERY_ZONES, PAYMENT_METHODS } from '../data/config';
import { getChannel } from '../utils/channelTracker';
import { formatCurrency } from '../utils/formatCurrency';

export function CheckoutModal({ isOpen, onClose, onSubmit }) {
  const [delivery, setDelivery] = useState(true);
  const [zoneId, setZoneId] = useState(DELIVERY_ZONES[0].id);
  const [payment, setPayment] = useState('momo');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [orderNotes, setOrderNotes] = useState('');

  const items = useCartStore((state) => state.items);
  const storeNotes = useCartStore((state) => state.notes);
  const itemsSubtotal = useCartStore(selectItemsSubtotal);
  const setCustomerInfo = useCartStore((state) => state.setCustomerInfo);
  const setFulfillment = useCartStore((state) => state.setFulfillment);
  const setZone = useCartStore((state) => state.setZone);
  const orderCode = useCartStore((state) => state.orderCode);
  const orderTime = useCartStore((state) => state.orderTime);

  const channel = getChannel();

  const zone = DELIVERY_ZONES.find((z) => z.id === zoneId);
  const deliveryFee = delivery ? (zone ? zone.fee : 0) : 0;
  const grandTotal = itemsSubtotal + deliveryFee;

  const isValid = customerName.trim() && customerPhone.trim() && (delivery ? customerAddress.trim() : true);

  const handleSubmit = (e) => {
    e.preventDefault();
    setCustomerInfo(customerName, customerPhone, customerAddress);
    setFulfillment(delivery ? 'delivery' : 'pickup');
    setZone(zoneId);
    onSubmit({
      items,
      itemsSubtotal,
      deliveryFee,
      grandTotal,
      fulfillmentType: delivery ? 'delivery' : 'pickup',
      zoneId,
      payment,
      customerName,
      customerPhone,
      customerAddress,
      notes: storeNotes,
      orderNotes: orderNotes.trim(),
      orderCode,
      orderTime,
      channel,
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="checkout-overlay fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="checkout-modal bg-surface-card w-full sm:max-w-md h-[95dvh] sm:h-auto sm:max-h-[90vh] flex flex-col rounded-t-2xl sm:rounded-xl shadow-2xl animate-slide-up sm:animate-slide-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Grab handle for mobile sheet */}
        <div className="sm:hidden flex justify-center pt-3 pb-1 shrink-0">
          <div className="w-10 h-1.5 rounded-full bg-border-subtle" />
        </div>

        <div className="p-4 sm:p-5 border-b border-border-subtle flex justify-between items-center shrink-0">
          <h2 className="text-xl font-bold text-festive-crimson">Checkout</h2>
          <button
            type="button"
            className="min-h-[44px] min-w-[44px] flex items-center justify-center text-ink-muted hover:text-ink-primary rounded-full hover:bg-surface-muted"
            onClick={onClose}
            aria-label="Close checkout"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <form
          id="checkout-form"
          onSubmit={handleSubmit}
          className="flex-1 overflow-y-auto p-4 sm:p-5 flex flex-col gap-5"
        >
          <fieldset className="border-none p-0 m-0 flex flex-col gap-3">
            <legend className="text-sm font-bold text-festive-crimson mb-1">Your Details</legend>
            <div className="flex flex-col gap-1">
              <label htmlFor="co-name" className="text-sm font-bold text-ink-secondary">Name</label>
              <input
                id="co-name"
                type="text"
                required
                autoComplete="name"
                enterKeyHint="next"
                className="border border-border-subtle rounded-lg px-3 py-3 text-base focus:outline-none focus:ring-2 focus:ring-festive-gold"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Your full name"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="co-phone" className="text-sm font-bold text-ink-secondary">Phone</label>
              <input
                id="co-phone"
                type="tel"
                required
                inputMode="tel"
                autoComplete="tel"
                enterKeyHint="next"
                className="border border-border-subtle rounded-lg px-3 py-3 text-base focus:outline-none focus:ring-2 focus:ring-festive-gold"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                placeholder="024xxxxxxx"
              />
            </div>
          </fieldset>

          <fieldset className="border-none p-0 m-0 flex flex-col gap-3">
            <legend className="text-sm font-bold text-festive-crimson mb-1">Order Type</legend>
            <div className="grid grid-cols-2 gap-3">
              <label className={`flex items-center justify-center gap-2 min-h-[48px] rounded-lg border cursor-pointer text-sm font-medium ${delivery ? 'border-festive-crimson bg-festive-gold-soft text-festive-crimson' : 'border-border-subtle text-ink-secondary'}`}>
                <input
                  type="radio"
                  name="orderType"
                  value="delivery"
                  checked={delivery}
                  onChange={() => setDelivery(true)}
                  className="rounded text-festive-crimson"
                />
                Delivery
              </label>
              <label className={`flex items-center justify-center gap-2 min-h-[48px] rounded-lg border cursor-pointer text-sm font-medium ${!delivery ? 'border-festive-crimson bg-festive-gold-soft text-festive-crimson' : 'border-border-subtle text-ink-secondary'}`}>
                <input
                  type="radio"
                  name="orderType"
                  value="pickup"
                  checked={!delivery}
                  onChange={() => setDelivery(false)}
                  className="rounded text-festive-crimson"
                />
                Pickup
              </label>
            </div>
          </fieldset>

          {delivery && (
            <>
              <fieldset className="border-none p-0 m-0 flex flex-col gap-3">
                <legend className="text-sm font-bold text-festive-crimson mb-1">Delivery Zone</legend>
                <select
                  value={zoneId}
                  onChange={(e) => setZoneId(e.target.value)}
                  className="border border-border-subtle rounded-lg px-3 py-3 text-base bg-surface-card focus:outline-none focus:ring-2 focus:ring-festive-gold"
                >
                  {DELIVERY_ZONES.map((z) => (
                    <option key={z.id} value={z.id}>
                      {z.label} — {formatCurrency(z.fee)}
                    </option>
                  ))}
                </select>
              </fieldset>
              <div className="flex flex-col gap-1">
                <label htmlFor="co-address" className="text-sm font-bold text-ink-secondary">Address / Landmark</label>
                <input
                  id="co-address"
                  type="text"
                  required
                  autoComplete="street-address"
                  enterKeyHint="next"
                  className="border border-border-subtle rounded-lg px-3 py-3 text-base focus:outline-none focus:ring-2 focus:ring-festive-gold"
                  value={customerAddress}
                  onChange={(e) => setCustomerAddress(e.target.value)}
                  placeholder="House no., street, nearby landmark"
                />
              </div>
            </>
          )}

          <fieldset className="border-none p-0 m-0 flex flex-col gap-3">
            <legend className="text-sm font-bold text-festive-crimson mb-1">Payment Method</legend>
            <div className="flex flex-col gap-2">
              {PAYMENT_METHODS.map((method) => {
                const active = payment === method.id;
                return (
                  <label
                    key={method.id}
                    className={`flex items-start gap-3 min-h-[52px] rounded-lg border p-3 cursor-pointer ${active ? 'border-festive-crimson bg-festive-gold-soft' : 'border-border-subtle'}`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value={method.id}
                      checked={active}
                      onChange={() => setPayment(method.id)}
                      className="mt-0.5 rounded text-festive-crimson"
                    />
                    <span className="flex flex-col">
                      <span className={`text-sm font-bold ${active ? 'text-festive-crimson' : 'text-ink-primary'}`}>{method.label}</span>
                      <span className="text-xs text-ink-muted">{method.note}</span>
                    </span>
                  </label>
                );
              })}
            </div>
          </fieldset>

          <div className="flex flex-col gap-1">
            <label htmlFor="co-notes" className="text-sm font-bold text-ink-secondary">Order Notes (optional)</label>
            <textarea
              id="co-notes"
              rows={2}
              className="border border-border-subtle rounded-lg px-3 py-3 text-base focus:outline-none focus:ring-2 focus:ring-festive-gold"
              value={orderNotes}
              onChange={(e) => setOrderNotes(e.target.value)}
              placeholder="e.g. Please call on arrival..."
            />
          </div>
        </form>

        <div className="p-4 sm:p-5 border-t border-border-subtle bg-surface-page pb-[calc(16px+env(safe-area-inset-bottom))] shrink-0">
          <div className="flex flex-col gap-1.5 mb-3">
            <div className="flex justify-between text-sm text-ink-secondary">
              <span>Subtotal</span>
              <span>{formatCurrency(itemsSubtotal)}</span>
            </div>
            <div className="flex justify-between text-sm text-ink-secondary">
              <span>{delivery ? 'Delivery' : 'Pickup'}</span>
              <span>{formatCurrency(delivery ? deliveryFee : 0)}</span>
            </div>
            <div className="flex justify-between text-lg font-bold text-ink-primary border-t border-border-subtle pt-2">
              <span>Total</span>
              <span>{formatCurrency(grandTotal)}</span>
            </div>
          </div>

          <button
            type="submit"
            form="checkout-form"
            className="w-full bg-whatsapp text-white min-h-[52px] rounded-lg text-lg font-bold hover:bg-whatsapp-hover active:bg-whatsapp-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            disabled={items.length === 0 || !isValid}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
            </svg>
            Order via WhatsApp
          </button>
          {!isValid && items.length > 0 && (
            <p className="text-sm font-bold text-festive-crimson mt-2 text-center">Please fill in all required fields before ordering.</p>
          )}
        </div>
      </div>
    </div>
  );
}
