import { NextRequest, NextResponse } from "next/server";
import {
  createCart,
  addToCart,
  updateCart,
  removeFromCart,
  getCart,
} from "@/lib/cartMutation";

/**
 * POST /api/cart
 *
 * Body: { action: "create" | "add" | "update" | "remove" | "get", ...params }
 *
 * This route handler keeps Shopify credentials server-side.
 * cartContext.tsx calls this endpoint instead of importing cartMutation directly,
 * preventing lib/index.ts (which has a top-level env check) from entering the
 * client bundle where process.env.SHOPIFY_STORE_DOMAIN would be undefined.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action } = body;

    switch (action) {
      case "create": {
        const cart = await createCart(body.lines);
        return NextResponse.json(cart);
      }
      case "add": {
        const cart = await addToCart(body.cartId, body.lines);
        return NextResponse.json(cart);
      }
      case "update": {
        const cart = await updateCart(body.cartId, body.lines);
        return NextResponse.json(cart);
      }
      case "remove": {
        const cart = await removeFromCart(body.cartId, body.lineIds);
        return NextResponse.json(cart);
      }
      case "get": {
        const cart = await getCart(body.cartId);
        return NextResponse.json(cart);
      }
      default:
        return NextResponse.json(
          { error: `Unknown action: ${action}` },
          { status: 400 }
        );
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
