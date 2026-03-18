"use server";

import { shopifyFetch } from './index';

/**
 * Shopify Cart API Reference:
 * https://shopify.dev/docs/api/storefront/2024-01/mutations/cartCreate
 * https://shopify.dev/docs/api/storefront/2024-01/mutations/cartLinesAdd
 * https://shopify.dev/docs/api/storefront/2024-01/mutations/cartLinesUpdate
 * https://shopify.dev/docs/api/storefront/2024-01/mutations/cartLinesRemove
 * https://shopify.dev/docs/api/storefront/2024-01/queries/cart
 */

// Type definitions for cart operations
export type CartLine = {
  id: string;
  quantity: number;
  merchandise: {
    id: string;
    title: string; // variant title (e.g. "M / Black")
    product: { title: string }; // actual product name
    image?: {
      url: string;
      altText: string | null;
    };
    price: {
      amount: string;
      currencyCode: string;
    };
  };
};

export type Cart = {
  id: string;
  checkoutUrl: string;
  lines: {
    edges: Array<{
      node: CartLine;
    }>;
  };
  cost: {
    totalAmount: {
      amount: string;
      currencyCode: string;
    };
    subtotalAmount: {
      amount: string;
      currencyCode: string;
    };
  };
};

/**
 * Creates a new cart with initial items
 *
 * Learn more: https://shopify.dev/docs/api/storefront/2024-01/mutations/cartCreate
 *
 * @param lines - Array of items to add to cart (merchandiseId = variant ID, quantity)
 * @returns Cart object with id and checkoutUrl
 */
export async function createCart(lines: Array<{ merchandiseId: string; quantity: number }>) {
  const mutation = `
    mutation cartCreate($lines: [CartLineInput!]!) {
      cartCreate(input: { lines: $lines }) {
        cart {
          id
          checkoutUrl
          lines(first: 10) {
            edges {
              node {
                id
                quantity
                merchandise {
                  ... on ProductVariant {
                    id
                    title
                    product { title }
                    image {
                      url
                      altText
                    }
                    price {
                      amount
                      currencyCode
                    }
                  }
                }
              }
            }
          }
          cost {
            totalAmount {
              amount
              currencyCode
            }
            subtotalAmount {
              amount
              currencyCode
            }
          }
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  const { data } = await shopifyFetch<{ cartCreate: { cart: Cart; userErrors: { field: string; message: string }[] } }>(mutation, { lines });
  if (data.cartCreate.userErrors?.length) {
    throw new Error(data.cartCreate.userErrors[0].message);
  }
  return data.cartCreate.cart;
}

export async function getCart(cartId: string): Promise<Cart | null> {
  const query = `
    query cart($cartId: ID!) {
      cart(id: $cartId) {
        id
        checkoutUrl
        lines(first: 50) {
          edges {
            node {
              id
              quantity
              merchandise {
                ... on ProductVariant {
                  id
                  title
                  product { title }
                  image {
                    url
                    altText
                  }
                  price {
                    amount
                    currencyCode
                  }
                }
              }
            }
          }
        }
        cost {
          totalAmount {
            amount
            currencyCode
          }
          subtotalAmount {
            amount
            currencyCode
          }
        }
      }
    }
  `;

  const { data } = await shopifyFetch<{ cart: Cart }>(query, { cartId });
  return data.cart;
}
export async function addToCart(cartId: string, lines: Array<{ merchandiseId: string; quantity: number }>) {
  const mutation = `
    mutation cartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
      cartLinesAdd(cartId: $cartId, lines: $lines) {
        cart {
          id
          checkoutUrl
          lines(first: 50) {
            edges {
              node {
                id
                quantity
                merchandise {
                  ... on ProductVariant {
                    id
                    title
                    product { title }
                    image {
                      url
                      altText
                    }
                    price {
                      amount
                      currencyCode
                    }
                  }
                }
              }
            }
          }
          cost {
            totalAmount {
              amount
              currencyCode
            }
            subtotalAmount {
              amount
              currencyCode
            }
          }
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  const { data, errors } = await shopifyFetch<{ cartLinesAdd: { cart: Cart; userErrors: { field: string; message: string }[] } }>(mutation, { cartId, lines });
  if (errors?.length) throw new Error(errors[0].message);
  if (data.cartLinesAdd.userErrors?.length) throw new Error(data.cartLinesAdd.userErrors[0].message);
  return data.cartLinesAdd.cart;
}

export async function updateCart(cartId: string, lines: Array<{ id: string; quantity: number }>) {
  const mutation = `
    mutation cartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
      cartLinesUpdate(cartId: $cartId, lines: $lines) {
        cart {
          id
          checkoutUrl
          lines(first: 50) {
            edges {
              node {
                id
                quantity
                merchandise {
                  ... on ProductVariant {
                    id
                    title
                    product { title }
                    image {
                      url
                      altText
                    }
                    price {
                      amount
                      currencyCode
                    }
                  }
                }
              }
            }
          }
          cost {
            totalAmount {
              amount
              currencyCode
            }
            subtotalAmount {
              amount
              currencyCode
            }
          }
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  const { data, errors } = await shopifyFetch<{ cartLinesUpdate: { cart: Cart; userErrors: { field: string; message: string }[] } }>(mutation, { cartId, lines });
  if (errors?.length) throw new Error(errors[0].message);
  if (data.cartLinesUpdate.userErrors?.length) throw new Error(data.cartLinesUpdate.userErrors[0].message);
  return data.cartLinesUpdate.cart;
}

export async function removeFromCart(cartId: string, lineIds: string[]) {
  const mutation = `
    mutation cartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
      cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
        cart {
          id
          checkoutUrl
          lines(first: 50) {
            edges {
              node {
                id
                quantity
                merchandise {
                  ... on ProductVariant {
                    id
                    title
                    product { title }
                    image {
                      url
                      altText
                    }
                    price {
                      amount
                      currencyCode
                    }
                  }
                }
              }
            }
          }
          cost {
            totalAmount {
              amount
              currencyCode
            }
            subtotalAmount {
              amount
              currencyCode
            }
          }
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  const { data, errors } = await shopifyFetch<{
    cartLinesRemove: { cart: Cart; userErrors: { field: string; message: string }[] }
  }>(mutation, { cartId, lineIds });
  if (errors?.length) throw new Error(errors[0].message);
  if (data.cartLinesRemove.userErrors?.length) throw new Error(data.cartLinesRemove.userErrors[0].message);
  return data.cartLinesRemove.cart;
}

