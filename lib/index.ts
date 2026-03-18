// lib/shopify.ts

const domain = process.env.SHOPIFY_STORE_DOMAIN;
const token = process.env.STOREFRONT_ACCESS_TOKEN;

// Types
type ShopifyResponse<T> = {
  data: T;
  errors?: { message: string }[];
};

type Product = {
  id: string;
  title: string;
  handle: string;
  description?: string;
  priceRange: {
    minVariantPrice: {
      amount: string;
      currencyCode: string;
    };
  };
  featuredImage: {
    url: string;
    altText: string | null;
  } | null;
  images: {
    edges: {
      node: {
        url: string;
        altText: string | null;
      };
    }[];
  };
  variants: {
    edges: {
      node: {
        id: string;
        title: string;
        quantityAvailable: number;
        image: {
          url: string;
          altText: string | null;
        } | null;
        price: {
          amount: string;
          currencyCode: string;
        };
      };
    }[];
  };
};

type ProductsQuery = {
  products: {
    edges: {
      node: Product;
    }[];
  };
};



// Generic fetch function
export async function shopifyFetch<T>(
  query: string,
  variables: Record<string, unknown> = {}
): Promise<ShopifyResponse<T>> {
  const response = await fetch(`https://${domain}/api/2024-01/graphql.json`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': token!,
    },
    body: JSON.stringify({ query, variables }),
  });

  return response.json();
}

// Get products
export async function getProducts(first = 10): Promise<Product[]> {
  const { data, errors } = await shopifyFetch<ProductsQuery>(
    `
      query ($first: Int!) {
        products(first: $first) {
          edges { 
            node {
              id
              title
              handle
              priceRange {
                minVariantPrice {
                  amount
                  currencyCode
                }
              }
              featuredImage {
                url
                altText
              } 
            }
          }
        }
      }
    `,
    { first }
  );

  if (errors) {
    console.error("Shopify errors:", JSON.stringify(errors, null, 2));
    throw new Error(errors[0].message || "Unknown Shopify error");
  }

  return data.products.edges.map((e) => e.node);
}

export type { Product };

type CollectionQuery = {
  collection: {
    title: string;
    description: string;
    products: {
      edges: { node: Product }[];
    };
  } | null;
};

export async function getCollection(
  handle: string,
  first = 48
): Promise<{ title: string; description: string; products: Product[] } | null> {
  const { data, errors } = await shopifyFetch<CollectionQuery>(
    `
      query getCollection($handle: String!, $first: Int!) {
        collection(handle: $handle) {
          title
          description
          products(first: $first) {
            edges {
              node {
                id
                title
                handle
                priceRange {
                  minVariantPrice {
                    amount
                    currencyCode
                  }
                }
                featuredImage {
                  url
                  altText
                }
              }
            }
          }
        }
      }
    `,
    { handle, first }
  );

  if (errors) throw new Error(errors[0].message);
  if (!data.collection) return null;

  return {
    title: data.collection.title,
    description: data.collection.description,
    products: data.collection.products.edges.map((e) => e.node),
  };
}

export async function getProductByHandle(handle: string): Promise<Product | null> {
  const { data, errors } = await shopifyFetch<{ product: Product | null }>(
    `
      query getProductByHandle($handle: String!) {
        product(handle: $handle) {
          id
          title
          description
          featuredImage {
            url
            altText
          }
          images(first: 10) {
            edges {
              node {
                url
                altText
              }
            }
          }
          variants(first: 3) {
            edges {
              node {
                id
                title
                quantityAvailable
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
    `,
    { handle }
  );

  if (errors) {
    throw new Error(errors[0].message);
  }

  return data.product;
}

