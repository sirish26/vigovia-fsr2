import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';

export function Activities({ activities, register, dayIndex }: {
  activities: any[];
  register: any;
  dayIndex: number;
}) {
  return (
    <>
    <Card>
    <CardContent>
      <h3 className="font-semibold mb-2">Activities</h3>
      {activities.map((a, j) => (
        <div key={a.id} className="grid grid-cols-3 gap-2 items-center mt-2">
          <select {...register(`days.${dayIndex}.activities.${j}.time`)} defaultValue={a.time}>
            <option value="Morning">Morning</option>
            <option value="Afternoon">Afternoon</option>
            <option value="Evening">Evening</option>
          </select>
          <Input placeholder="Title" {...register(`days.${dayIndex}.activities.${j}.title`)} defaultValue={a.title} />
          <Input placeholder="Description" {...register(`days.${dayIndex}.activities.${j}.description`)} defaultValue={a.description} />
        </div>
      ))}
    </CardContent>
    </Card>
    </>
  );
}