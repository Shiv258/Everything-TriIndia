import { z } from "zod";

export const bookingRequestSchema = z
  .object({
    fullName: z.string().min(2, "Name is required"),
    phone: z.string().min(8, "Phone number is required"),
    email: z.string().email().optional().or(z.literal("")),
    propertySlug: z.string().min(1),
    roomSlug: z.string().optional().or(z.literal("")),
    checkIn: z.string().min(1, "Check-in date is required"),
    checkOut: z.string().min(1, "Check-out date is required"),
    guests: z.coerce.number().int().min(1).max(8),
    specialRequests: z.string().max(1000).optional().or(z.literal("")),
  })
  .refine((value) => new Date(value.checkOut) > new Date(value.checkIn), {
    message: "Check-out must be after check-in",
    path: ["checkOut"],
  });

export type BookingRequestInput = z.infer<typeof bookingRequestSchema>;
