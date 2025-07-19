import { Document, Page, View, Text, Image } from '@react-pdf/renderer';
import { styles } from './styles';
import { Table, SectionTitle, InfoContainer, DayComponent, FlightSummary, HotelBookings, BorderedInfo, formatDate } from './components';
import type { ItineraryFormData } from './itinerarySchema';

export function ItineraryPDF({ data }: { data: ItineraryFormData }) {
  const depDate = new Date(data.departureDate);
  const arrDate = new Date(data.returnDate);
  const diffDays = Math.max(1, Math.round((arrDate.getTime() - depDate.getTime()) / (1000 * 60 * 60 * 24)));
  const nights = diffDays - 1;

  const importantNotesData = [
    ['Airlines Standard Policy', 'In Case Of Visa Rejection, Visa Fees Or Any Other Non Cancellable Component Cannot Be Reimbursed At Any Cost.', ],
    ['Flight/Hotel Cancellation', 'In Case Of Flight Or Hotel Cancellation, The Cancellation Charges Will Be Applicable As Per The Airlines/Hotel Policy.'],
    ['Travel Insurance', 'Travel Insurance Is Mandatory For All International Trips.'],
    ['Hotel Check-In/Check-Out', 'Hotel Check-In Is At 2 PM And Check-Out Is At 12 PM.'],
    ['visa rejection', 'In Case Of Visa Rejection, The Visa Fees Or Any Other Non-Cancellable Component Cannot Be Reimbursed At Any Cost.'],
  ];
  
  const scopeOfServiceData = [
    ['Flight tickets & Hotel Vochers', 'Delivered 3 days Post Full Payment'],
    ['web Check-In', 'Boarding pass delivery via email/whatsapp'],
    ['support', 'chat support - response within 4 hours'],
    ['cancellation support', 'provided'],
    ['trip support', 'Response time: 5 minutes']];
  
  const inclusionSummaryData = [
    ['Flight', '2', 'All Flights Mentioned', 'Awaiting Confirmation'],
    ['Tourist Tax', '2', 'Hotel Taj, Hotel Oberoi, Hotel Leela', 'Confirmed'],
    ['Hotel', '2', 'Airport to Hotel - Hotel to Attractions', 'Included']];

  const activityTableData = data.days.flatMap(day => 
    day.activities.map(activity => [
      data.arrivalCity,
      activity.description,
      'Sightseeing',
      '2-3 hours'
    ])
  );

  const paymentPlanData = [
    ['Installment 1', '3,50,000', 'initial Payment'],
    ['Installment 2', '3,50,000', 'post Visa Approval'],
    ['Installment 3', 'Remaining', '20 Days Before Departure']];
  
  const visaDetailsHeaders = ['Visa Type', 'Validity', 'Processing Date'];
  const visaDetailsValues = ['Tourist Visa', '30 Days', formatDate(data.departureDate)];

  return (
    <Document>
      <Page size="A4" style={styles.page} wrap>

        <View style={styles.header} fixed>
          <Image src="/vigovia.png" style={styles.logo} />
        </View>

        <View style={styles.titleBox}>
          <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Hi, {data.name}!</Text>
          <Text style={{ fontSize: 16 }}>{data.arrivalCity} Itinerary</Text>
          <Text style={{ fontSize: 12, marginTop: 4 }}>{diffDays} Days {nights} Nights</Text>
        </View>

        <InfoContainer data={data} />

        {data.days.map((day, i) => (
          <DayComponent 
            key={i}
            day={day} 
            dayIndex={i} 
            departureDate={data.departureDate.toISOString()} 
            arrivalCity={data.arrivalCity} 
          />
        ))}

        <FlightSummary data={data} />

        <HotelBookings data={data} />

        <View style={{ marginTop: 24 }} wrap>
          <SectionTitle>
            Important <Text style={styles.sectionTitleAccent}>Notes</Text>
          </SectionTitle>
          <Table headers={['Point', 'Details']} rows={importantNotesData} />
        </View>

        <View style={{ marginTop: 24 }} wrap>
          <SectionTitle>
            Scope Of <Text style={styles.sectionTitleAccent}>Service</Text>
          </SectionTitle>
          <Table headers={['Service', 'Details']} rows={scopeOfServiceData} />
        </View>

        <View style={{ marginTop: 24 }} wrap>
          <SectionTitle>
            Inclusion <Text style={styles.sectionTitleAccent}>Summary</Text>
          </SectionTitle>
          <Table 
            headers={['Category', 'Count', 'Details', 'Status/Comments']} 
            rows={inclusionSummaryData} 
          />
          <Text style={styles.noteText}>
            Transfer Policy(Refundable Upon Claim)
            If Any Transfer Is Delayed Beyond 15 Minutes. Customers May Book An App-Based Or Radio Taxi And Claim A Refund For That Specific Leg.
          </Text>
        </View>

        <View style={{ marginTop: 24 }} wrap>
          <SectionTitle>
            Activity <Text style={styles.sectionTitleAccent}>Details</Text>
          </SectionTitle>
          <Table 
            headers={['City', 'Activity', 'Type', 'Time Required']} 
            rows={activityTableData} 
          />
        </View>

        <View style={{ marginTop: 24 }} wrap>
          <SectionTitle>
            Terms and <Text style={styles.sectionTitleAccent}>Conditions</Text>
          </SectionTitle>
          <Text style={styles.noteText}>view all terms and conditions</Text>
        </View>

        <View style={{ marginTop: 24 }} wrap>
          <SectionTitle>
            Payment<Text style={styles.sectionTitleAccent}> Plan</Text>
          </SectionTitle>
          <BorderedInfo label="Total Amount" value="9,00,000 for 3 Pax(inclusive of GST)" />
          <BorderedInfo label="TCS" value="Not Collected" />
          <Table 
            headers={['Installment', 'Amount', 'Due Date']} 
            rows={paymentPlanData} 
          />
        </View>

        <View>
          <SectionTitle>
            Visa <Text style={styles.sectionTitleAccent}>Details</Text>
          </SectionTitle>
          <View style={styles.infoContainer}>
            <View style={styles.infoRow}>
              {visaDetailsHeaders.map(header => (
                <Text key={header} style={[styles.infoCell, { fontWeight: 'bold' }]}>{header}</Text>
              ))}
            </View>
            <View style={styles.infoRow}>
              {visaDetailsValues.map((value, idx) => (
                <Text key={idx} style={styles.infoCell}>{value}</Text>
              ))}
            </View>
          </View>
        </View>

        <View style={{ marginTop: 32, alignItems: 'center' }}>
          <Text style={styles.planPackGoText}>PLAN.PACK.GO!</Text>
          <View style={styles.bookNowButton}>
            <Text style={styles.bookNowText}>Book Now</Text>
          </View>
        </View>

        <View style={styles.footer} fixed>
          <View style={[styles.footerSection, { paddingRight: 8 }]}>
            <Text style={styles.footerTitle}>Vigovia Tech Pvt. Ltd</Text>
            <Text style={styles.footerText}>
              Registered Office: Hd-109 Cinnabar Hills, Links Business Park, Karnataka, India.
            </Text>
          </View>
          <View style={[styles.footerSection, { paddingHorizontal: 8 }]}>
            <Text style={styles.footerTitle}>Contact</Text>
            <Text style={styles.footerText}>Phone: +91-9999999999</Text>
            <Text style={styles.footerText}>Email ID: Contact@Vigovia.Com</Text>
          </View>
          <View style={[styles.footerSection, { alignItems: 'center', textAlign: 'right', paddingLeft: 8 }]}>
            <Image src="/vigovia.png" style={styles.footerLogo} />
          </View>
        </View>
      </Page>
    </Document>
  );
}