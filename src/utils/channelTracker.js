const CHANNEL_KEY = 'festive_menu_channel';
const VALID_SOURCES = ['ig', 'fb', 'wa', 'instagram', 'facebook', 'whatsapp'];

const SOURCE_LABELS = {
  ig: 'Instagram',
  instagram: 'Instagram',
  fb: 'Facebook',
  facebook: 'Facebook',
  wa: 'WhatsApp',
  whatsapp: 'WhatsApp',
};

export function captureChannel() {
  if (typeof window === 'undefined' || !window.sessionStorage) return null;

  const params = new URLSearchParams(window.location.search);
  const src = params.get('src') || params.get('utm_source');
  const medium = params.get('utm_medium');
  const campaign = params.get('utm_campaign');

  let channel = 'Direct';
  let raw = null;

  if (src && VALID_SOURCES.includes(src.toLowerCase())) {
    raw = src.toLowerCase();
    channel = SOURCE_LABELS[raw] || raw;
  } else if (medium && VALID_SOURCES.includes(medium.toLowerCase())) {
    raw = medium.toLowerCase();
    channel = SOURCE_LABELS[raw] || raw;
  }

  const attribution = { channel, source: raw, medium, campaign };
  sessionStorage.setItem(CHANNEL_KEY, JSON.stringify(attribution));
  return attribution;
}

export function getChannel() {
  if (typeof window === 'undefined' || !window.sessionStorage) return null;
  const raw = sessionStorage.getItem(CHANNEL_KEY);
  return raw ? JSON.parse(raw) : { channel: 'Direct', source: null, medium: null, campaign: null };
}

export function clearChannel() {
  if (typeof window === 'undefined' || !window.sessionStorage) return;
  sessionStorage.removeItem(CHANNEL_KEY);
}
