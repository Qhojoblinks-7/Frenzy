export const RESTAURANT_NAME = 'Festive Eats';
export const TAGLINE = 'Festive season specials — fresh, hot, and ready for celebrations.';
export const WHATSAPP_NUMBER = '233555840147';
export const CURRENCY = 'GHS';

export const PAYMENT_METHODS = [
  { id: 'momo', label: 'Mobile Money (MoMo)', note: 'Pay via MoMo after order confirmation' },
  { id: 'cod', label: 'Cash on Delivery / Pickup', note: 'Pay cash upon arrival' },
];

export const DELIVERY_ZONES = [
  { id: 'accra-central', label: 'Accra Central', fee: 10 },
  { id: 'east-legon', label: 'East Legon', fee: 15 },
  { id: 'airport-residential', label: 'Airport Residential', fee: 15 },
  { id: 'tema', label: 'Tema', fee: 20 },
  { id: 'kasoa', label: 'Kasoa', fee: 20 },
  { id: 'nungua', label: 'Nungua', fee: 15 },
];

export const CUSTOMER_PAYS_DELIVERY_NOTE = 'Delivery fees are charged based on your zone and added to your order total.';
export const PICKUP_FEE = 0;
export const FREE_DELIVERY_THRESHOLD = 200;
export const DEFAULT_FULFILLMENT = 'delivery';
export const DEFAULT_PAYMENT = 'momo';

export const getZoneById = (id) => DELIVERY_ZONES.find((z) => z.id === id);
export const getZoneByLabel = (label) => DELIVERY_ZONES.find((z) => z.label === label);
