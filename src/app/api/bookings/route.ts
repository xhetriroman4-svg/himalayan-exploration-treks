import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      tourName, tourDays, tourRegion, startDate, travelers,
      fullName, email, phone, nationality,
      emergencyContact, emergencyPhone,
      dietaryNeeds, medicalConditions,
      paymentMethod, amount, currency, specialRequests,
    } = body;

    // Validate required fields
    if (!tourName || !fullName || !email || !phone || !nationality || !startDate || !travelers || !paymentMethod || !amount) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Generate booking reference: HE-YYYYMMDD-XXXXX
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const randStr = Math.random().toString(36).substring(2, 7).toUpperCase();
    const bookingRef = `HE-${dateStr}-${randStr}`;

    const booking = await db.booking.create({
      data: {
        bookingRef,
        tourName,
        tourDays: Number(tourDays),
        tourRegion: tourRegion || '',
        startDate,
        travelers: Number(travelers),
        fullName,
        email,
        phone,
        nationality,
        emergencyContact: emergencyContact || null,
        emergencyPhone: emergencyPhone || null,
        dietaryNeeds: dietaryNeeds || null,
        medicalConditions: medicalConditions || null,
        paymentMethod,
        paymentStatus: paymentMethod === 'arrival' ? 'confirmed' : 'pending',
        amount: Number(amount),
        currency: currency || 'USD',
        specialRequests: specialRequests || null,
      },
    });

    return NextResponse.json({ success: true, booking }, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const bookingRef = searchParams.get('ref');

    if (bookingRef) {
      const booking = await db.booking.findUnique({ where: { bookingRef } });
      if (!booking) {
        return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
      }
      return NextResponse.json({ booking });
    }

    const bookings = await db.booking.findMany({
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
    return NextResponse.json({ bookings });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
