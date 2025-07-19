import { z } from 'zod';

export const itinerarySchema = z.object({
  name: z.string().min(2),
  departureCity: z.string(),
  arrivalCity: z.string(),
  departureDate: z.date(),
  returnDate: z.date(),
  travelers: z.number().min(1),
  days: z.array(z.object({
    date: z.date().optional(),
    activities: z.array(z.object({
      time: z.enum(['Morning', 'Afternoon', 'Evening']),
      title: z.string(),
      description: z.string(),
      id: z.string(),
      price: z.string(),
    })),
    transfers: z.array(z.object({
      id: z.string(),
      date: z.date(),
      flightName: z.string(),
      from: z.string(),
      to: z.string(),
    })).optional(),
    stays: z.array(z.object({
      id: z.string(),
      checkIn: z.date(),
      checkOut: z.date(),
      hotel: z.string(),
    })).optional(),
  })).min(1)
});

export type Activity = {
  time: 'Morning' | 'Afternoon' | 'Evening';
  title: string;
  description: string;
  id: string;
  price: string;
};

export type Transfer = {
  id: string;
  date: Date;
  flightName: string;
  from: string;
  to: string;
};

export type Stay = {
  id: string;
  checkIn: Date;
  checkOut: Date;
  hotel: string;
};

export type Day = {
  date?: Date;
  activities: Activity[];
  transfers?: Transfer[];
  stays?: Stay[];
};

export type ItineraryFormData = {
  name: string;
  departureCity: string;
  arrivalCity: string;
  departureDate: Date;
  returnDate: Date;
  travelers: number;
  days: Day[];
};