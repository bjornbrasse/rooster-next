import { Booking, User } from '@prisma/client';
import { db } from '~/utils/db.server';

export const createBooking = async ({
  id,
  date,
  taskId,
  userId,
}: {
  id: string;
  date: Date;
  taskId: string;
  userId: string;
}): Promise<Booking | null> => {
  const booking = await db.booking.create({
    data: { id, date, taskId, userId },
  });

  return booking;
};

export const getBookings = async (): Promise<(Booking & { user: User })[]> => {
  const bookings = await db.booking.findMany({ include: { user: true } });

  return bookings;
};
