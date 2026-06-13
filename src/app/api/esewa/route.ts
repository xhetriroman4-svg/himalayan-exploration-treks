import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// eSewa payment verification endpoint
// In production, eSewa would redirect here after payment completion
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { bookingRef, transactionId, amount, status } = body;

    if (!bookingRef || !transactionId) {
      return NextResponse.json({ error: 'Missing booking reference or transaction ID' }, { status: 400 });
    }

    const booking = await db.booking.findUnique({ where: { bookingRef } });
    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    // Verify amount matches
    if (Math.abs(booking.amount - Number(amount)) > 0.01) {
      return NextResponse.json({ error: 'Amount mismatch' }, { status: 400 });
    }

    // Update booking with eSewa transaction details
    const updatedBooking = await db.booking.update({
      where: { bookingRef },
      data: {
        esewaTxnId: transactionId,
        paymentStatus: status === 'SUCCESS' ? 'paid' : 'failed',
      },
    });

    return NextResponse.json({
      success: true,
      booking: updatedBooking,
      message: status === 'SUCCESS'
        ? 'Payment verified and booking confirmed!'
        : 'Payment verification failed. Please try again.',
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// eSewa payment initiation - returns the form data needed for eSewa redirect
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const bookingRef = searchParams.get('ref');

    if (!bookingRef) {
      return NextResponse.json({ error: 'Missing booking reference' }, { status: 400 });
    }

    const booking = await db.booking.findUnique({ where: { bookingRef } });
    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    // eSewa configuration
    // In production, use actual eSewa merchant ID and secret
    const esewaConfig = {
      merchantId: 'EPAYTEST', // eSewa test merchant ID
      // In production: process.env.ESEWA_MERCHANT_ID
      amount: booking.amount,
      taxAmount: 0,
      totalAmount: booking.amount,
      transactionUuid: booking.bookingRef,
      productServiceCharge: 0,
      productDeliveryCharge: 0,
      successUrl: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/esewa/success`,
      failureUrl: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/esewa/failure`,
    };

    return NextResponse.json({ config: esewaConfig, booking });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
