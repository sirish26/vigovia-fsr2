import { Card, CardContent } from '@/components/ui/card';
import { format } from 'date-fns';
import { Input } from '@/components/ui/input';

export function Flights({ transfers, travelers, update, dayIndex, field }: {
  transfers: any[];
  travelers: number;
  update: Function;
  dayIndex: number;
  field: any;
}) {
  if (!transfers?.length) return null;
  return (
    <>
      <div className="mb-4">
        {transfers.map((t, idx) => (
          <Card key={t.id} className="grid grid-cols-1 gap-2 items-center mt-2">
            <CardContent>
            <h3 className="font-semibold mb-2">Flights</h3>
              <div className="flex items-center gap-4">
                <span className="font-bold">{format(t.date, 'PPP')}</span>
                <span>{t.flightName} from {t.from} to {t.to}</span>
                <span>No. of Travelers:</span>
                <Input
                  type="number"
                  min={1}
                  value={t.numTravelers ?? travelers}
                  onChange={e => {
                    const newTransfers = [...(field.transfers ?? [])];
                    newTransfers[idx].numTravelers = Number(e.target.value);
                    update(dayIndex, { ...field, transfers: newTransfers });
                  }}
                  className="w-24"
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
}