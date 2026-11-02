// Policy pages. Facts come from the brand data; anything not supplied is a marked placeholder.

type Section = { heading: string; body: string };

export const shippingPolicy: Section[] = [
  { heading: "Where we ship", body: "We ship to addresses across Australia, including PO Boxes." },
  { heading: "Shipping costs", body: "Standard shipping is a flat $9.95 Australia-wide. Orders of $100 or more (after any discount) ship free. All prices include GST." },
  { heading: "Dispatch and delivery times", body: "[PLACEHOLDER: Dispatch time (e.g. within 1–2 business days) and courier / Australia Post delivery estimates by state.]" },
  { heading: "Tracking", body: "Once your order ships we add the tracking number to your order. You can check it any time on the Track order page with your order number and email." },
];

export const returnsPolicy: Section[] = [
  { heading: "Your rights", body: "Our products come with guarantees that cannot be excluded under the Australian Consumer Law." },
  { heading: "Returns and refunds", body: "[PLACEHOLDER: Returns window, condition rules (e.g. opened lashes and cosmetics for hygiene reasons), how to start a return, and refund timing. To be supplied by the developer.]" },
  { heading: "Faulty or incorrect items", body: "If an item arrives damaged, faulty or not what you ordered, contact us with your order number and a photo and we will make it right." },
  { heading: "Contact", body: "Email orders@wattleandlash.example with your order number." },
];

export const privacy: Section[] = [
  { heading: "Information we collect", body: "When you order, create an account, join our mailing list or contact us, we collect your name, email, phone number and delivery address. The checkout runs in test mode: card details stay in your browser and are never sent to or stored by us." },
  { heading: "How we use it", body: "To process and deliver orders, provide customer support, and, if you opt in, send our newsletter. We do not sell your information." },
  { heading: "Who we share it with", body: "Only with the services needed to run the store: our database host, image host and delivery partners." },
  { heading: "Cookies", body: "We use a login cookie when you sign in and store your cart in your browser. [PLACEHOLDER: list analytics tools if enabled.]" },
  { heading: "Access and contact", body: "To access, correct or delete your information, email hello@wattleandlash.example. We handle personal information in line with the Australian Privacy Principles." },
];

export const terms: Section[] = [
  { heading: "About this site", body: "This website is operated by Wattle & Lash (ABN 00 000 000 000). By placing an order you agree to these terms." },
  { heading: "Prices and payment", body: "All prices are in Australian dollars and include GST. The store is in test mode, so no payment is taken at checkout. We may cancel and refund an order if a product is listed with an obvious pricing error or is out of stock." },
  { heading: "Product use", body: "Our products are cosmetic. Read the label and directions before use. Patch test adhesives, lash lift and tint products 24 hours before use, and stop using any product that causes irritation. Professional kits are intended for trained users." },
  { heading: "Shipping and returns", body: "See our Shipping and Returns & Refunds pages." },
  { heading: "Contact", body: "Questions about these terms: hello@wattleandlash.example." },
];
