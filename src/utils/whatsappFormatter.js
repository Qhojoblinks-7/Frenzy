import { WHATSAPP_NUMBER, RESTAURANT_NAME, DELIVERY_ZONES, PAYMENT_METHODS } from '../data/config';
import { formatCurrency } from './formatCurrency';

function isMobile() {
  if (typeof window === 'undefined') return false;
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

function buildDeepLink(message) {
  return `whatsapp://send?phone=${WHATSAPP_NUMBER}&text=${encodeURIComponent(message)}`;
}

function buildWebLink(message) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export function buildOrderMessage({
  items,
  itemsSubtotal,
  deliveryFee,
  grandTotal,
  fulfillmentType,
  zoneId,
  payment,
  customerName,
  customerPhone,
  customerAddress,
  notes,
  orderNotes,
  orderCode,
  orderTime,
  channel,
}) {
  const zone = DELIVERY_ZONES.find((z) => z.id === zoneId);
  const zoneLabel = zone ? zone.label : '—';
  const paymentMethod = PAYMENT_METHODS.find((m) => m.id === payment);
  const paymentLabel = paymentMethod ? paymentMethod.label : payment;

  const lines = [];
  lines.push(`*${RESTAURANT_NAME} — New Order*`);
  lines.push(`Order: ${orderCode}`);
  lines.push(`Time: ${orderTime}`);
  lines.push(`Source: ${channel ? channel.channel : 'Direct'}`);
  lines.push('');

  lines.push(`*Customer Details*`);
  lines.push(`Name: ${customerName || '—'}`);
  lines.push(`Phone: ${customerPhone || '—'}`);
  lines.push('');

  lines.push(`*Fulfillment*`);
  lines.push(`${fulfillmentType === 'pickup' ? 'Pickup' : 'Delivery'}${fulfillmentType === 'delivery' ? ` — ${zoneLabel}` : ''}`);
  if (customerAddress) lines.push(`Address: ${customerAddress}`);
  lines.push('');

  lines.push(`*Payment Method*`);
  lines.push(paymentLabel);
  lines.push('');

  lines.push(`*Items*`);
  items.forEach((item, index) => {
    const addOnTotal = item.addOns.reduce((a, addOn) => a + addOn.price, 0);
    const unitPrice = item.price + addOnTotal;
    const lineTotal = unitPrice * item.qty;
    lines.push(`${index + 1}. ${item.name} x${item.qty} — ${formatCurrency(lineTotal)}`);
    item.addOns.forEach((addOn) => {
      lines.push(`    + ${addOn.name} (+${formatCurrency(addOn.price)})`);
    });
    const note = notes[item.cartItemId];
    if (note) lines.push(`    Note: ${note}`);
  });

  if (Object.values(notes).some((n) => n && n.trim())) {
    lines.push('');
    lines.push(`*Item Notes*`);
    Object.entries(notes).forEach(([key, value]) => {
      if (value && value.trim()) {
        const item = items.find((i) => i.cartItemId === key);
        const itemLabel = item ? item.name : 'Item';
        lines.push(`  • ${itemLabel}: ${value}`);
      }
    });
  }

  if (orderNotes && orderNotes.trim()) {
    lines.push('');
    lines.push(`*Special Instructions*`);
    lines.push(orderNotes);
  }

  lines.push('');
  lines.push(`*Totals*`);
  lines.push(`Subtotal: ${formatCurrency(itemsSubtotal)}`);
  lines.push(`Delivery: ${formatCurrency(deliveryFee)}`);
  lines.push(`Total: ${formatCurrency(grandTotal)}`);

  const message = lines.join('\n');
  const url = isMobile() ? buildDeepLink(message) : buildWebLink(message);
  return { message, url };
}
