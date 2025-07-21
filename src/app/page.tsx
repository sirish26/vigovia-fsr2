'use client';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState, useEffect } from 'react';
import { format, differenceInCalendarDays } from 'date-fns';
import {Card,CardContent,CardHeader,CardTitle,} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { v4 as uuidv4 } from 'uuid';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { itinerarySchema, Activity, ItineraryFormData } from '@/components/itinerarySchema';
import { Activities } from '@/components/Activities';
import { Flights } from '@/components/Flights';
import { Stays } from '@/components/Stays';
import { toast } from 'sonner';


const hotelOptions = ["Hotel Taj", "Hotel Oberoi", "Hotel Leela"];

export default function HomePage() {
  const [maxDays, setMaxDays] = useState(1);
  const [loading, setLoading] = useState(false);
  const form = useForm({
    resolver: zodResolver(itinerarySchema),
    defaultValues: {
      name: '', departureCity: '', arrivalCity: '',
      departureDate: new Date(), returnDate: new Date(),
      travelers: 1, days: []
    },
  });

  const { register, handleSubmit, control, watch, setValue, formState: { errors } } = form;
  const { fields, append, remove, update } = useFieldArray({ control, name: 'days' });
  const departure = watch('departureDate');
  const returnDate = watch('returnDate');

  useEffect(() => {
    setMaxDays(differenceInCalendarDays(returnDate, departure) + 1);
  }, [departure, returnDate]);

  const addDay = () => fields.length < maxDays && append({ activities: [] });

  const addActivity = (dayIndex: number) => {
    const day = fields[dayIndex];
    const newActivities = [
      ...day.activities,
      {
        time: 'Morning' as Activity["time"],
        title: '',
        description: '',
        price: '',
        id: uuidv4() as string,
      },
    ];
    update(dayIndex, { ...day, activities: newActivities });
  };

  const addTransfer = (dayIndex: number) => {
    const day = fields[dayIndex];
    const departureDate = watch('departureDate');
    const departureCity = watch('departureCity');
    const arrivalCity = watch('arrivalCity');
    const transferDate = new Date(departureDate);
    transferDate.setDate(transferDate.getDate() + dayIndex);

    const transfers = (day.transfers ?? []);
    const newTransfers = [
      ...transfers,
      {
        id: uuidv4() as string,
        date: transferDate,
        flightName: 'Indigo',
        from: departureCity,
        to: arrivalCity,
      },
    ];
    update(dayIndex, { ...day, transfers: newTransfers });
  };

  const addStay = (dayIndex: number) => {
    const day = fields[dayIndex];
    const departureDate = watch('departureDate');
    const returnDate = watch('returnDate');
    const checkIn = new Date(departureDate);
    checkIn.setDate(checkIn.getDate() + dayIndex);
    const checkOut = new Date(checkIn);
    checkOut.setDate(checkOut.getDate() + 1);
    if (checkOut > returnDate) checkOut.setTime(returnDate.getTime());

    const stays = (day.stays ?? []);
    const newStays = [
      ...stays,
      {
        id: uuidv4() as string,
        checkIn,
        checkOut,
        hotel: hotelOptions[0],
      },
    ];
    update(dayIndex, { ...day, stays: newStays });
  };

  const onSubmit = async (itineraryData: ItineraryFormData) => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8080/itinerary', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(itineraryData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const pdfUrl = data.pdf_url;

      if (pdfUrl) {
        console.log('Opening PDF URL:', pdfUrl);
        const newWindow = window.open(pdfUrl, '_blank');
        if (!newWindow || newWindow.closed || typeof newWindow.closed == 'undefined') {
          toast.success('PDF generated!', {
            description: (
              <a href={pdfUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
                Click here to open PDF
              </a>
            ),
            duration: 10000,
          });
        } else {
          toast.success('PDF generated!', {
            description: (
              <a href={pdfUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
                Click here to open PDF
              </a>
            ),
            duration: 10000,
          });
        }
      } else {
        console.error('PDF URL not received from backend.');
        toast.error('Failed to generate PDF: No URL received.');
      }
      console.log('Itinerary generated successfully', itineraryData);
    } catch (error) {
      console.error('Error generating itinerary:', error);
      toast.error('Error generating itinerary.', {
        description: error instanceof Error ? error.message : 'An unknown error occurred.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="w-auto mx-auto py-10 px-50">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-gradient text-3xl font-bold text-cta">Form</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              <InputField label="Name" {...register('name')} />
              <InputField label="Number of Travelers" type="number" {...register('travelers', { valueAsNumber: true })} />
              <InputField label="Departure City" {...register('departureCity')} />
              <InputField label="Arrival City" {...register('arrivalCity')} />
              <DateSelector label="Departure Date" date={watch('departureDate')} onSelect={(d) => setValue('departureDate', d!)} />
              <DateSelector label="Return Date" date={watch('returnDate')} onSelect={(d) => setValue('returnDate', d!)} />
            </div>

            <div className="mt-8">
              <h2 className="text-2xl font-bold mb-2 text-cta">Day-wise Itinerary</h2>
              <Button type="button" onClick={addDay} disabled={fields.length >= maxDays}>Add Day Details</Button>
              <div className="space-y-4 mt-4">
                {fields.map((field, i) => (
                  <Card key={field.id} className="bg-lightbg">
                    <CardHeader>
                      <CardTitle> Day {i + 1}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Activities activities={field.activities} register={register} dayIndex={i} />
                      <Flights transfers={field.transfers ?? []} travelers={watch('travelers')} update={update} dayIndex={i} field={field} />
                      <Stays
                        stays={field.stays ?? []}
                        departure={departure}
                        returnDate={returnDate}
                        update={update}
                        field={field}
                        dayIndex={i}
                        hotelOptions={hotelOptions}
                      />
                    </CardContent>
                    <div className="flex gap-2 px-4 pb-4">
                      <Button type="button" onClick={() => addActivity(i)}>Add Activity</Button>
                      <Button type="button" onClick={() => addTransfer(i)} disabled={(field.transfers?.length ?? 0) >= 1}>Add Transfer</Button>
                      <Button type="button" onClick={() => addStay(i)} disabled={(field.stays?.length ?? 0) >= 1}>Add Stay</Button>
                      <Button type="button" className="text-red-500" onClick={() => remove(i)}>Remove Day</Button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            <Button type="submit" disabled={loading}>
              {loading ? 'Generating...' : 'Generate Itinerary'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}

const InputField = ({ label, ...props }: { label: string; type?: string; [key: string]: any }) => (
  <div><Label>{label}</Label><Input {...props} /></div>
);

const DateSelector = ({ label, date, onSelect }: { label: string; date: Date; onSelect: (d: Date | undefined) => void }) => (
  <div>
    <Label>{label}</Label>
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className={cn('w-full justify-start text-left font-normal', !date && 'text-muted-foreground')}>
          {format(date, 'PPP')}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar mode="single" required={true} selected={date} onSelect={onSelect} initialFocus />
      </PopoverContent>
    </Popover>
  </div>
);
