import { View, Text, Svg, Path } from '@react-pdf/renderer';
import { styles } from './styles';
import type { ItineraryFormData } from './itinerarySchema';

interface Activity {
  time: string;
  title: string;
  description?: string;
}

interface Day {
  activities: Activity[];
  transfers?: any[];
  stays?: any[];
}

export const formatDate = (d: string | Date) => {
  const date = typeof d === 'string' ? new Date(d) : d;
  return `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;
};

export const Table = ({ 
  headers, 
  rows, 
  cellFlex = [1, 1, 1, 1] 
}: { 
  headers: string[]; 
  rows: string[][]; 
  cellFlex?: number[]; 
}) => (
  <View style={styles.tableContainer} wrap>
    <View style={styles.tableHeader}>
      {headers.map((header, idx) => (
        <Text 
          key={header} 
          style={[
            styles.tableHeaderCell, 
            { flex: cellFlex[idx] || 1 },
            ...(idx === headers.length - 1 ? [{ borderRight: 'none' }] : [])
        ]}
        >
          {header}
        </Text>
      ))}
    </View>
    {rows.map((row, idx) => (
      <View key={idx} style={styles.tableRow} wrap>
        {row.map((cell, cellIdx) => (
          <Text 
            key={cellIdx} 
            style={[
              styles.tableCell, 
              { flex: cellFlex[cellIdx] || 1 },
              ...(cellIdx === row.length - 1 ? [{ borderRight: 'none' }] : [])
            ]}
          >
            {cell}
          </Text>
        ))}
      </View>
    ))}
  </View>
);

export const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <Text style={styles.sectionTitle}>{children}</Text>
);


export const InfoContainer = ({ data }: { data: ItineraryFormData }) => {
  const headers = ['Departure', 'Arrival', 'Departure Date', 'Arrival Date', 'No. of Travelers'];
  const values = [
    data.departureCity,
    data.arrivalCity,
    formatDate(data.departureDate),
    formatDate(data.returnDate),
    data.travelers.toString()
  ];

  return (
    <View style={styles.infoContainer}>
      <View style={styles.infoRow}>
        {headers.map(header => (
          <Text key={header} style={[styles.infoCell, { fontWeight: 'bold' }]}>{header}</Text>
        ))}
      </View>
      <View style={styles.infoRow}>
        {values.map((value, idx) => (
          <Text key={idx} style={styles.infoCell}>{value}</Text>
        ))}
      </View>
    </View>
  );
};

export const DayComponent = ({ 
  day, 
  dayIndex, 
  departureDate, 
  arrivalCity 
}: { 
  day: Day; 
  dayIndex: number; 
  departureDate: string; 
  arrivalCity: string; 
}) => (
  <View style={styles.dayContainer} key={dayIndex} wrap={false}>
    <View style={styles.dayLabel}>
      <Text style={styles.dayLabelText}>Day {dayIndex + 1}</Text>
    </View>
    <View style={styles.dayContent}>
      <View style={styles.imageContainer}>
        <View style={styles.imagePlaceholder}>
          <Text style={{ color: '#bbb', fontSize: 10 }}>Image</Text>
        </View>
        <Text style={{ fontWeight: 'bold', fontSize: 13, marginBottom: 2, marginTop: 2 }}>
          {formatDate(departureDate)}
        </Text>
        <Text style={{ fontSize: 10, textAlign: 'center' }}>
          Arrival In {arrivalCity}
        </Text>
      </View>
      <View style={{ flex: 1, flexDirection: 'row' }}>
        <View style={styles.timelineContainer}>
          {day.activities.map((activity: Activity, idx: number) => (
            <View key={idx} style={styles.timelineItem}>
              <View style={styles.timelineDot}>
                <Svg width={10} height={10} viewBox="0 0 10 10">
                  <Path d="M5 1a4 4 0 1 1 0 8a4 4 0 0 1 0-8z" fill="#7b6cf6" />
                </Svg>
              </View>
              {idx < day.activities.length - 1 && <View style={styles.timelineLine} />}
            </View>
          ))}
        </View>
        <View style={{ flex: 1 }}>
          {day.activities.map((activity: Activity, idx: number) => (
            <View key={activity.time} style={styles.activityRow}>
              <Text style={styles.activityTime}>{activity.time}</Text>
              <View style={{ flex: 1 }}>
                <Text>• {activity.title} {activity.description ? `- ${activity.description}` : ''}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>
    </View>
  </View>
);

export const FlightSummary = ({ data }: { data: ItineraryFormData }) => (
  <View style={{ marginTop: 24 }}>
    <SectionTitle>
      Flight <Text style={styles.sectionTitleAccent}>Summary</Text>
    </SectionTitle>
    {data.days.flatMap((day, i) => 
      (day.transfers ?? []).map((transfer, j) => (
        <View key={`flight-${i}-${j}`} style={styles.borderedContainer}>
          <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
            <Text style={{ fontWeight: 'bold', fontSize: 12, minWidth: 80 }}>
              {formatDate(transfer.date)}
            </Text>
            <Text style={{ fontWeight: 'bold', fontSize: 12, marginLeft: 8, color: 'black' }}>
              {transfer.flightName}
            </Text>
            <Text style={{ fontSize: 12, marginLeft: 8 }}>
              From {transfer.from} To {transfer.to}.
            </Text>
          </View>
        </View>
      ))
    )}
    <Text style={styles.noteText}>
      Note: All Flights Include Meals, Seat Choice (Excluding XL), And 20kg/25kg Checked Baggage.
    </Text>
  </View>
);

export const HotelBookings = ({ data }: { data: ItineraryFormData }) => {
  const stays = data.days.flatMap(day => day.stays ?? []);
  
  if (stays.length === 0) {
    return (
      <View style={{ marginTop: 24 }} wrap>
        <SectionTitle>
          Hotel <Text style={styles.sectionTitleAccent}>Bookings</Text>
        </SectionTitle>
        <Text>No hotel bookings available.</Text>
      </View>
    );
  }

  const headers = ['City', 'Check In', 'Check Out', 'Nights', 'Hotel Name'];
  const rows = stays.map(stay => {
    const checkIn = formatDate(stay.checkIn);
    const checkOut = formatDate(stay.checkOut);
    const nights = Math.max(1, Math.round((new Date(stay.checkOut).getTime() - new Date(stay.checkIn).getTime()) / (1000 * 60 * 60 * 24)));
    return [data.arrivalCity, checkIn, checkOut, nights.toString(), stay.hotel];
  });

  return (
    <View style={{ marginTop: 24 }} wrap>
      <SectionTitle>
        Hotel <Text style={styles.sectionTitleAccent}>Bookings</Text>
      </SectionTitle>
      <Table headers={headers} rows={rows} cellFlex={[1, 1, 1, 1, 2]} />
      <Text style={styles.noteText}>
        1. All Hotels Are Tentative And Can Be Replaced With Similar.{"\n"}
        2. Breakfast Included For All Hotel Stays{"\n"}
        3. All Hotels Will Be 4* And Above Category{"\n"}
        4. A maximum occupancy of 2 people/room is allowed in most hotels.
      </Text>
    </View>
  );
};

export const BorderedInfo = ({ label, value }: { label: string; value: string }) => (
  <View style={styles.borderedContainer}>
    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
      <Text style={{ fontWeight: 'bold', fontSize: 12, minWidth: 80 }}>{label}</Text>
      <Text style={{ fontWeight: 'bold', fontSize: 12, marginLeft: 8, color: 'black' }}>{value}</Text>
    </View>
  </View>
);