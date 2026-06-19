import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

/**
 * POST /api/custom-package
 * Saves a custom package inquiry to the database.
 * Customers select destinations they want to visit + write a custom message.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      destinations, startDate, duration, travelers, budget,
      name, email, phone, nationality, message,
    } = body;

    // Validate required fields
    if (!destinations || !Array.isArray(destinations) || destinations.length === 0) {
      return NextResponse.json({ error: 'Please select at least one destination' }, { status: 400 });
    }
    if (!name || !email) {
      return NextResponse.json({ error: 'Name and email are required' }, { status: 400 });
    }

    // Generate reference: CP-YYYYMMDD-XXXXX
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const randStr = Math.random().toString(36).substring(2, 7).toUpperCase();
    const ref = `CP-${dateStr}-${randStr}`;

    // Try to save to database
    try {
      const fullMessage = `
DESTINATIONS: ${destinations.join(', ')}
START DATE: ${startDate}
DURATION: ${duration} days
TRAVELERS: ${travelers}
BUDGET: ${budget}
NATIONALITY: ${nationality || 'Not specified'}
PHONE: ${phone || 'Not provided'}

CUSTOMER MESSAGE:
${message || 'No additional message'}
      `.trim();

      await db.booking.create({
        data: {
          bookingRef: ref,
          tourName: `Custom Package: ${destinations.slice(0, 2).join(', ')}${destinations.length > 2 ? ` +${destinations.length - 2} more` : ''}`,
          tourDays: Number(duration) || 14,
          tourRegion: destinations.join(' | '),
          startDate: startDate || '',
          travelers: Number(travelers) || 1,
          fullName: name,
          email,
          phone: phone || '',
          nationality: nationality || '',
          paymentMethod: 'custom-inquiry',
          paymentStatus: 'inquiry',
          amount: 0,
          currency: 'USD',
          specialRequests: fullMessage,
        },
      });
    } catch (dbError) {
      console.error('[custom-package] DB save failed (non-fatal):', dbError);
    }

    return NextResponse.json({
      success: true,
      ref,
      message: 'Custom package request received. Our team will contact you within 24 hours.',
      destinations,
    }, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal server error';
    console.error('[custom-package] Error:', error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const ref = searchParams.get('ref');

    if (ref) {
      const inquiry = await db.booking.findUnique({ where: { bookingRef: ref } });
      if (!inquiry) {
        return NextResponse.json({ error: 'Inquiry not found' }, { status: 404 });
      }
      return NextResponse.json({ inquiry });
    }

    const inquiries = await db.booking.findMany({
      where: { paymentMethod: 'custom-inquiry' },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
    return NextResponse.json({ inquiries });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
