import { Ticket, Section } from '@/types/ticket';

export const mockTickets: Ticket[] = [
  {
    id: '1',
    sender: 'orders@coolblue.nl',
    title: 'Je bestelling is onderweg!',
    date: new Date('2024-01-15T10:30:00'),
    statusUpdate: 'Pakket wordt vandaag bezorgd',
    contentSummary: 'Uw bestelling #CB123456 is onderweg en wordt vandaag tussen 14:00-18:00 bezorgd.',
    section: Section.ORDERS,
    isRead: false,
    companyName: 'Coolblue',
    iconPath: '/logos/coolblue.png',
    senderAvatar: null,
    timeline: [
      { type: 'ordered', date: '2024-01-13', description: 'Bestelling geplaatst' },
      { type: 'shipped', date: '2024-01-14', description: 'Verzonden' },
      { type: 'delivery', date: '2024-01-15', description: 'Onderweg' }
    ],
    actions: [
      { type: 'track', label: 'Track pakket', url: 'https://track.coolblue.nl/123456' },
      { type: 'contact', label: 'Contact opnemen', url: 'mailto:support@coolblue.nl' }
    ]
  },
  {
    id: '2',
    sender: 'appointments@tandartspraktijk.nl',
    title: 'Herinnering: Afspraak morgen om 14:00',
    date: new Date('2024-01-14T16:45:00'),
    statusUpdate: 'Afspraak bevestigd voor morgen',
    contentSummary: 'Herinnering voor uw tandarts afspraak morgen om 14:00 bij Tandartspraktijk Centrum.',
    section: Section.APPOINTMENTS,
    isRead: true,
    companyName: 'Tandartspraktijk Centrum',
    iconPath: '/logos/tandarts.png',
    senderAvatar: null,
    timeline: [
      { type: 'scheduled', date: '2024-01-10', description: 'Afspraak ingepland' },
      { type: 'reminder', date: '2024-01-14', description: 'Herinnering verstuurd' }
    ],
    actions: [
      { type: 'confirm', label: 'Bevestigen', action: 'confirm_appointment' },
      { type: 'reschedule', label: 'Verzetten', action: 'reschedule_appointment' }
    ]
  },
  {
    id: '3',
    sender: 'billing@spotify.com',
    title: 'Spotify Premium - Factuur december',
    date: new Date('2024-01-01T09:00:00'),
    statusUpdate: 'Betaling succesvol verwerkt',
    contentSummary: 'Uw maandelijkse Spotify Premium factuur voor december 2023 is betaald.',
    section: Section.ACTION,
    isRead: false,
    companyName: 'Spotify',
    iconPath: '/logos/spotify.png',
    senderAvatar: null,
    timeline: [
      { type: 'generated', date: '2024-01-01', description: 'Factuur gegenereerd' },
      { type: 'paid', date: '2024-01-01', description: 'Betaling verwerkt' }
    ],
    actions: [
      { type: 'download', label: 'Download factuur', url: '/invoices/spotify-dec-2023.pdf' },
      { type: 'support', label: 'Vragen over factuur', url: 'https://support.spotify.com' }
    ]
  },
  {
    id: '4',
    sender: 'support@bol.com',
    title: 'Retour aanvraag goedgekeurd',
    date: new Date('2024-01-12T14:20:00'),
    statusUpdate: 'Retourlabel is verstuurd',
    contentSummary: 'Uw retour aanvraag voor artikel #BOL789 is goedgekeurd. Retourlabel is per email verstuurd.',
    section: Section.SUPPORT,
    isRead: true,
    companyName: 'Bol.com',
    iconPath: '/logos/bol.png',
    senderAvatar: null,
    timeline: [
      { type: 'requested', date: '2024-01-10', description: 'Retour aangevraagd' },
      { type: 'approved', date: '2024-01-12', description: 'Aanvraag goedgekeurd' }
    ],
    actions: [
      { type: 'download', label: 'Download retourlabel', url: '/return-labels/bol-789.pdf' },
      { type: 'track', label: 'Track retour', url: 'https://track.bol.com/return/789' }
    ]
  },
  {
    id: '5',
    sender: 'info@ns.nl',
    title: 'Treinvertraging op uw route',
    date: new Date('2024-01-16T08:15:00'),
    statusUpdate: 'Vertraging van 15 minuten',
    contentSummary: 'Uw trein van Amsterdam naar Utrecht heeft 15 minuten vertraging door een seinstoring.',
    section: Section.GENERAL,
    isRead: false,
    companyName: 'Nederlandse Spoorwegen',
    iconPath: '/logos/ns.png',
    senderAvatar: null,
    timeline: [
      { type: 'scheduled', date: '2024-01-16', description: 'Reis gepland' },
      { type: 'delayed', date: '2024-01-16', description: 'Vertraging gemeld' }
    ],
    actions: [
      { type: 'alternative', label: 'Alternatieve route', url: 'https://ns.nl/reisplanner' },
      { type: 'compensation', label: 'Vergoeding aanvragen', url: 'https://ns.nl/vergoeding' }
    ]
  }
];