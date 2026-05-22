import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { bookingRequestSchema } from "@/lib/booking-validation";
import { prisma } from "@/lib/prisma";

function makeReference() {
  const date = new Date();
  const stamp = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, "0")}${String(date.getDate()).padStart(2, "0")}`;
  return `TRI-${stamp}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;
}

export async function POST(request: Request) {
  const payload = await request.json().catch(() => null);
  const parsed = bookingRequestSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json({ ok: false, errors: parsed.error.flatten().fieldErrors }, { status: 400 });
  }

  const data = parsed.data;
  const property = await prisma.property.findUnique({ where: { slug: data.propertySlug } });

  if (!property) {
    return NextResponse.json({ ok: false, error: "Property not found" }, { status: 404 });
  }

  const room = data.roomSlug
    ? await prisma.room.findUnique({ where: { propertyId_slug: { propertyId: property.id, slug: data.roomSlug } } })
    : null;

  try {
    const guest = await prisma.guest.upsert({
      where: { phone: data.phone },
      update: {
        fullName: data.fullName,
        email: data.email || null,
      },
      create: {
        fullName: data.fullName,
        phone: data.phone,
        email: data.email || null,
      },
    });

    const booking = await prisma.booking.create({
      data: {
        reference: makeReference(),
        propertyId: property.id,
        roomId: room?.id ?? null,
        guestId: guest.id,
        checkIn: new Date(data.checkIn),
        checkOut: new Date(data.checkOut),
        guests: data.guests,
        estimatedAmount: room?.baseRate ?? null,
        specialRequests: data.specialRequests || null,
      },
      include: { guest: true, property: true, room: true },
    });

    return NextResponse.json({ ok: true, booking });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return NextResponse.json({ ok: false, error: error.message }, { status: 400 });
    }

    return NextResponse.json({ ok: false, error: "Booking request failed" }, { status: 500 });
  }
}
