// Demo checkout settings. No real gateway: nothing is charged and no card data is stored.

export const demoPayment = {
  banner: "Demo store: no real payment is taken.",
  testCard: "4242 4242 4242 4242",
  declineCard: "4000 0000 0000 0002",
  afterpayInstalments: 4,
};

/** A card ending in these digits is declined, to show the failed-payment path. */
export const DECLINE_LAST4 = "0002";
