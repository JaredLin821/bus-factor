import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { auth } from "@/auth";

export async function POST() {
    const session = await auth();
    if (!session?.user?.email) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const checkoutSession = await stripe.checkout.sessions.create({
        mode: "subscription",
        payment_method_types: ["card"],
        line_items: [
            {
                price: process.env.STRIPE_PRO_PRICE_ID!,
                quantity: 1,
            },
        ],
        success_url: `${process.env.NEXTAUTH_URL}/dashboard?upgraded=true`,
        cancel_url: `${process.env.NEXTAUTH_URL}/dashboard`,
        metadata: {
            userId: session.user.id,
        },
    });
    return NextResponse.json({ url: checkoutSession.url });
}