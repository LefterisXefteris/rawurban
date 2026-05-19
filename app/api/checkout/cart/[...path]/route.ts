import { NextRequest, NextResponse } from "next/server";
import { createCart } from "@/lib/cartMutation";

type RouteContext = {
  params: Promise<{
    path?: string[];
  }>;
};

function parseCartLines(path: string[]) {
  const cartPath = path.join("/");
  const [linePath] = cartPath.split("?");

  return linePath
    .split(",")
    .map((line) => {
      const [variantId, quantityValue = "1"] = line.split(":");
      const quantity = Number.parseInt(quantityValue, 10);

      if (!variantId || !Number.isFinite(quantity) || quantity < 1) {
        return null;
      }

      return {
        merchandiseId: `gid://shopify/ProductVariant/${variantId}`,
        quantity,
      };
    })
    .filter((line): line is { merchandiseId: string; quantity: number } =>
      Boolean(line)
    );
}

export async function GET(req: NextRequest, context: RouteContext) {
  const { path = [] } = await context.params;
  const lines = parseCartLines(path);

  if (!lines.length) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  try {
    const cart = await createCart(lines);
    return NextResponse.redirect(cart.checkoutUrl);
  } catch {
    return NextResponse.redirect(new URL("/", req.url));
  }
}
