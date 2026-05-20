// lib/shopify.ts

const domain = process.env.SHOPIFY_STORE_DOMAIN;
const token =
  process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN ??
  process.env.STOREFRONT_ACCESS_TOKEN;

if (!domain) {
  throw new Error(
    "[Shopify] SHOPIFY_STORE_DOMAIN is not set. Add it to .env.local."
  );
}
if (!token) {
  throw new Error(
    "[Shopify] SHOPIFY_STOREFRONT_ACCESS_TOKEN is not set. Add it to .env.local."
  );
}

const SHOPIFY_API_VERSION = "2024-01";
const SHOPIFY_ENDPOINT = `https://${domain}/api/${SHOPIFY_API_VERSION}/graphql.json`;

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
  options?: {
    name: string;
    values: string[];
  }[];
  variants: {
    edges: {
      node: {
        id: string;
        title: string;
        availableForSale: boolean;
        selectedOptions: { name: string; value: string }[];
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
  let response: Response;

  try {
    response = await fetch(SHOPIFY_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': token as string,
      },
      body: JSON.stringify({ query, variables }),
    });
  } catch (error) {
    const cause =
      error instanceof Error && "cause" in error && error.cause instanceof Error
        ? ` (${error.cause.message})`
        : "";

    throw new Error(
      `[Shopify] Could not reach ${domain}${cause}. Check SHOPIFY_STORE_DOMAIN in .env.local and make sure it is the permanent .myshopify.com domain for your store.`
    );
  }

  if (!response.ok) {
    throw new Error(
      `[Shopify] Storefront API request failed with ${response.status} ${response.statusText}. Check your store domain, Storefront API token, and API version.`
    );
  }

  return response.json();
}

// Get products
export async function getProducts(first = 10): Promise<Product[]> {
  const { data, errors } = await shopifyFetch<ProductsQuery>(
    `
      query ($first: Int!) {
        products(first: $first, sortKey: CREATED_AT, reverse: true) {
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
              variants(first: 10) {
                edges {
                  node {
                    id
                    title
                    availableForSale
                    selectedOptions {
                      name
                      value
                    }
                  }
                }
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
  if (handle === "all") {
    return {
      title: "All Products",
      description: "",
      products: await getProducts(first),
    };
  }

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
                images(first: 100) {
                  edges {
                    node {
                      url
                      altText
                    }
                  }
                }
                variants(first: 10) {
                  edges {
                    node {
                      id
                      title
                      availableForSale
                      selectedOptions {
                        name
                        value
                      }
                    }
                  }
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
  if (!data.collection) {
    if (handle === "new-arrivals") {
      return {
        title: "New Arrivals",
        description: "",
        products: await getProducts(first),
      };
    }

    return null;
  }

  const products = data.collection.products.edges.map((e) => e.node);

  if (handle === "new-arrivals" && products.length === 0) {
    return {
      title: data.collection.title || "New Arrivals",
      description: data.collection.description,
      products: await getProducts(first),
    };
  }

  return {
    title: data.collection.title,
    description: data.collection.description,
    products,
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
          images(first: 100) {
            edges {
              node {
                url
                altText
              }
            }
          }
          options {
            name
            values
          }
          variants(first: 100) {
            edges {
              node {
                id
                title
                availableForSale
                selectedOptions {
                  name
                  value
                }
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
