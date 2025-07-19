import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { format } from 'date-fns';

export function Stays({ stays, departure, returnDate, update, field, dayIndex, hotelOptions }: {
  stays: any[];
  departure: Date;
  returnDate: Date;
  update: Function;
  field: any;
  dayIndex: number;
  hotelOptions: string[];
}) {
  if (!stays?.length) return null;
  return (
    <>
      <div className="mb-4">
        {stays.map((s, idx) => {
          const allowedDates: Date[] = [];
          let d = new Date(departure);
          while (d <= returnDate) {
            allowedDates.push(new Date(d));
            d.setDate(d.getDate() + 1);
          }
          return (
            <Card key={s.id} className="mb-2">
              <CardContent>
              <h3 className="font-semibold mb-2">Stays</h3>
                <div className="flex items-center gap-4">
                  <span>Check-in:</span>
                  <Select
                    value={format(s.checkIn, 'yyyy-MM-dd')}
                    onValueChange={val => {
                      const newStays = [...(field.stays ?? [])];
                      newStays[idx].checkIn = new Date(val);
                      if (newStays[idx].checkOut < newStays[idx].checkIn) {
                        newStays[idx].checkOut = newStays[idx].checkIn;
                      }
                      update(dayIndex, { ...field, stays: newStays });
                    }}
                  >
                    <SelectTrigger className="w-[160px]">
                      <SelectValue placeholder="Select date" />
                    </SelectTrigger>
                    <SelectContent>
                      {allowedDates.map(date => (
                        <SelectItem key={date.toISOString()} value={format(date, 'yyyy-MM-dd')}>
                          {format(date, 'PPP')}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <span>Check-out:</span>
                  <Select
                    value={format(s.checkOut, 'yyyy-MM-dd')}
                    onValueChange={val => {
                      const newStays = [...(field.stays ?? [])];
                      newStays[idx].checkOut = new Date(val);
                      if (newStays[idx].checkIn > newStays[idx].checkOut) {
                        newStays[idx].checkIn = newStays[idx].checkOut;
                      }
                      update(dayIndex, { ...field, stays: newStays });
                    }}
                  >
                    <SelectTrigger className="w-[160px]">
                      <SelectValue placeholder="Select date" />
                    </SelectTrigger>
                    <SelectContent>
                      {allowedDates
                        .filter(date => date >= s.checkIn)
                        .map(date => (
                          <SelectItem key={date.toISOString()} value={format(date, 'yyyy-MM-dd')}>
                            {format(date, 'PPP')}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  <span>Hotel:</span>
                  <Select
                    value={s.hotel}
                    onValueChange={hotel => {
                      const newStays = [...(field.stays ?? [])];
                      newStays[idx].hotel = hotel;
                      update(dayIndex, { ...field, stays: newStays });
                    }}
                  >
                    <SelectTrigger className="w-[160px]">
                      <SelectValue placeholder="Select Hotel" />
                    </SelectTrigger>
                    <SelectContent>
                      {hotelOptions.map(hotel => (
                        <SelectItem key={hotel} value={hotel}>{hotel}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </>
  );
}