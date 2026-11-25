# Festive Season Starter Web Menu & WhatsApp Order System

## Technical Build Specification & AI Implementation Guide

**Target Launch Date:** November 30, 2026 (Festive Season Rollout — Nov 30, 2026 to Early January 2027)

**Location Context:** Accra, Ghana (Currency: `GHS`, Mobile Money / Cash on Delivery, WhatsApp Business dispatch)

**Hosting & Infra Cost:** `$0/year` (`GHS 0/month`) using free static edge hosting (**Vercel** or **Cloudflare Pages**) and direct WhatsApp deep links (`https://wa.me/...`).

**Scope Note:** This is a client-side **Starter** build. Do **not** build a backend server, database, WebSockets/Pusher, Telegram bot, or payment gateway webhook unless explicitly asked for a post-festive upgrade.

## 1. System Architecture & Data Flow

1. **Social & Ad Entry (`?src=` / UTM Params):**

   * Customers click links from WhatsApp (`?src=wa`), Instagram (`?src=ig`), Facebook (`?src=fb`), or standard `utm_*` query parameters.

   * `channelTracker.js` parses query parameters on initial load, persists them in `sessionStorage`, and defaults to `Direct` if none are present.

2. **Mobile-First Menu & Cart (`menuData.js`, `config.js`, `useCartStore.js`):**

   * Menu items are grouped by festive categories with `GHS` prices, descriptions, images, availability flags, optional `addOns` (extra protein, sides, spice level, etc.), and per-item or order-level notes.

   * Cart state supports adding items, customizing add-ons, incrementing/decrementing quantities, removing items, selecting **Delivery** or **Pickup**, choosing a delivery zone (with zone-based `GHS` fees), and choosing **Mobile Money** or **Cash on Delivery**.

3. **WhatsApp Order Dispatch (`whatsappFormatter.js`):**

   * Formats a clean, plain-text, scannable receipt with order ID/timestamp, source channel tag, customer contact/name, fulfillment type (`Delivery` with zone/address or `Pickup`), payment method, itemized lines + add-ons + notes, subtotal, delivery fee, and grand total in `GHS`.

   * Encodes the message via `encodeURIComponent()` and opens `https://wa.me/<CLEAN_WHATSAPP_NUMBER>?text=<ENCODED_TEXT>`.

## 2. Recommended Project Structure (React + Vite, JavaScript/JSX)

```
src/
├── data/
│   ├── config.js               # Restaurant info, WhatsApp number, MoMo/COD notes, delivery zones
│   └── menuData.js             # Festive categories, menu items, prices, add-ons, images
├── state/
│   └── useCartStore.js         # Cart items, add-ons, quantities, fulfillment, zone, payment, totals
├── utils/
│   ├── channelTracker.js       # Reads, normalizes, and persists social/UTM attribution
│   └── whatsappFormatter.js    # Formats structured WhatsApp order receipt & builds wa.me URL
├── components/
│   ├── HeaderBar.jsx           # Brand header, search input, active cart item count & total badge
│   ├── CategoryTabs.jsx        # Sticky horizontal category filter pills for mobile thumbs
│   ├── MenuItemCard.jsx        # Food photo, name, price (GHS), description, add/customize trigger
│   ├── ItemCustomizeModal.jsx  # Add-on checkboxes/selectors + item-specific special note
│   ├── CartDrawer.jsx          # Slide-over / bottom-sheet cart with qty controls & checkout CTA
│   └── CheckoutModal.jsx       # Name, phone, Delivery vs. Pickup, zone/address, MoMo/COD, WhatsApp button
├── App.jsx                     # Main layout connecting store, filters, cards, cart, and checkout
└── main.jsx                    # Entry point

```

## 3. Core Data Schemas & Configuration (`config.js` & `menuData.js`)

### `src/data/config.js`

Define all restaurant-specific values in one place so non-technical updates are fast and safe:

* `restaurantName` (string)

* `tagline` (string, festive positioning)

* `whatsappNumber` (string, digits only with country code, e.g., `"233240000000"` — strip `+`, spaces, or leading `0` when building `wa.me` links)

* `currency` (`"GHS"`)

* `paymentMethods`: array of options such as:

  * `{ id: "momo", label: "Mobile Money (MoMo)", note: "Pay via MoMo after order confirmation" }`

  * `{ id: "cod", label: "Cash on Delivery / Pickup", note: "Pay cash upon arrival" }`

* `deliveryZones`: array of `{ id, label, fee }` (in `GHS`, e.g., `0` for Pickup, `15`–`40` for delivery zones)

* `customerPaysDeliveryNote` (string clarifying delivery fee responsibility)

### `src/data/menuData.js`

* `CATEGORIES`: `[{ id: "all", label: "All Festive" }, { id: "mains", label: "Festive Mains" }, ...]`

* `MENU_ITEMS`:

  ```
  {
    id: "festive-jollof-combo",
    category: "mains",
    name: "Festive Party Jollof & Grilled Chicken",
    description: "Smoky party jollof served with spiced grilled chicken, plantain, and coleslaw.",
    price: 95,
    image: "/images/festive-jollof.webp",
    available: true,
    badge: "Festive Special",
    addOns: [
      { id: "extra-chicken", name: "Extra Grilled Chicken", price: 35 },
      { id: "extra-shito", name: "Extra Black Shito", price: 10 },
      { id: "chilled-drink", name: "Chilled Drink", price: 15 }
    ]
  }
  
  ```

## 4. State, Attribution & Formatting Rules

### `channelTracker.js`

* Check URL search params for `src`, `utm_source`, `utm_medium`, `utm_campaign`.

* Map common values cleanly (e.g., `ig` / `instagram` -> `Instagram`, `fb` / `facebook` -> `Facebook`, `wa` / `whatsapp` -> `WhatsApp`, fallback -> `Direct`).

* Store the resolved attribution object in `sessionStorage` so navigating or opening modals does not lose the source.

### `useCartStore.js`

* Generate a unique `cartItemId` per item + sorted selected add-on combination so identical configurations stack cleanly while different add-on choices stay distinct.

* Calculate:

  * `itemsSubtotal`: sum of `(item.price + sum(selectedAddOns.price)) * quantity`

  * `deliveryFee`: `0` when `fulfillmentType === "pickup"`, otherwise the selected zone's `fee`

  * `grandTotal`: `itemsSubtotal + deliveryFee`

### `whatsappFormatter.js`

* Generate a short human-readable order code (e.g., `FST-` + last 5 digits of timestamp) and local date/time string.

* Format with clear section headers and line breaks (avoiding complex markdown tables that break in WhatsApp):

  * Header with restaurant name, order code, and source channel

  * Customer details (name, phone)

  * Fulfillment (`Pickup` or `Delivery` + zone + street/landmark address)

  * Payment method (`Mobile Money` or `Cash on Delivery / Pickup`)

  * Itemized list: quantity, item name, line total in `GHS`, selected add-ons, and item notes

  * Order-level special instructions (if provided)

  * Totals block: Subtotal, Delivery Fee, and Total (`GHS`)

* Return `{ message, url }` where `url = \`https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}\`\`.

## 5. UX, Performance & Deployment Checklist

* **Mobile-First Ergonomics:** Design primarily for `360px–430px` viewports with large tap targets (`>= 44px`), sticky category tabs, and a persistent bottom cart bar when items are in the cart.

* **Image Optimization:** Compress and resize food photos (WebP/JPEG, lightweight file sizes) and use `loading="lazy"` on cards below the fold so mobile menu loading stays snappy.

* **Form Validation Before WhatsApp Redirect:** Require customer name, reachable phone number, and delivery address/zone (when `delivery` is selected) before enabling or triggering the WhatsApp dispatch action.

* **Post-Dispatch Clarity:** Show a helpful confirmation state after opening `wa.me` reminding the customer to hit **Send** inside WhatsApp if it didn't auto-send, plus a button to start a new order or edit details.

* **Static Deployment (`$0/year`):** Push to Git and deploy on **Vercel** or **Cloudflare Pages** with SPA fallback (`index.html`) configured so refreshes never return `404`.