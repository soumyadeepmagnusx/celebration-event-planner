import { EventData } from '../types/event';

export const DEFAULT_EVENTS: EventData[] = [
  {
    id: 'wedding',
    type: 'wedding',
    themeName: 'Opulent Rose & Champagne',
    title: 'Julian & Elena’s Conservatory Soirée',
    subtitle: 'Black-Tie Botanical Glasshouse Celebration',
    date: '2026-09-19',
    location: 'The Vanderbilt Glasshouse & Gardens, NY',
    guestCount: 165,
    totalBudget: 68000,
    currency: 'USD',
    heroImage: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1800&q=85',
    fontClass: 'font-serif',
    accentPrimary: '#E11D48',
    accentSecondary: '#D97706',
    gradientText: 'from-rose-400 via-amber-200 to-rose-300',
    gradientBg: 'from-rose-600 via-pink-600 to-amber-600',
    badgeBg: 'bg-rose-500/15 text-rose-400 border-rose-500/30',
    palette: [
      { name: 'Champagne Gold', hex: '#F3E5AB' },
      { name: 'Velvet Rose', hex: '#D46A7E' },
      { name: 'Sage Botanical', hex: '#9CAF88' },
      { name: 'Obsidian Silk', hex: '#1C1917' },
    ],
    themeNotes: 'Lush French glasshouse conservatory, suspended orchid ceilings, sabered champagne, and acoustic strings.',
    createdAt: '2026-10-01T10:00:00Z',
    updatedAt: '2026-10-29T12:00:00Z',
    budgetItems: [
      { id: 'b1', category: 'venue', name: 'Venue & Glasshouse Rental', estimatedCost: 22000, actualCost: 21500, paid: true, color: '#F43F5E', dueDate: '2026-03-01' },
      { id: 'b2', category: 'catering', name: 'Haute Couture Catering & Bar', estimatedCost: 18500, actualCost: 19200, paid: true, color: '#F59E0B', dueDate: '2026-08-15' },
      { id: 'b3', category: 'decor', name: 'Hanging Floral Installations', estimatedCost: 9500, actualCost: 9800, paid: false, color: '#EC4899', dueDate: '2026-09-01' },
      { id: 'b4', category: 'photography', name: 'Editorial Film & Photography', estimatedCost: 7500, actualCost: 7500, paid: true, color: '#8B5CF6', dueDate: '2026-04-10' },
      { id: 'b5', category: 'entertainment', name: 'String Quartet & Vinyl DJ', estimatedCost: 5500, actualCost: 5200, paid: false, color: '#10B981', dueDate: '2026-09-10' },
      { id: 'b6', category: 'marketing', name: 'Custom Letterpress Stationery', estimatedCost: 3000, actualCost: 2750, paid: true, color: '#3B82F6', dueDate: '2026-05-20' },
      { id: 'b7', category: 'contingency', name: 'Emergency Glasshouse Weather Buffer', estimatedCost: 2000, actualCost: 0, paid: false, color: '#EF4444', dueDate: '2026-09-19' },
    ],
    milestones: [
      { id: 't1', phase: '6_months', dueDate: '2026-03-15', title: 'Lock in Glasshouse Venue & Michelin Caterer', description: 'Confirm signed contracts and deposit wire transfer.', category: 'venue', completed: true, priority: 'high' },
      { id: 't2', phase: '3_months', dueDate: '2026-06-15', title: 'Finalize Suspended Orchid Ceiling Blueprint', description: 'Review 40ft hanging white phalaenopsis floral design.', category: 'decor', completed: true, priority: 'high' },
      { id: 't3', phase: '1_month', dueDate: '2026-08-15', title: 'Bespoke Tasting Menu & Champagne Tower Test', description: 'Taste 5-course seasonal pairings and test 7-tier crystal coup tower.', category: 'catering', completed: false, priority: 'medium' },
      { id: 't4', phase: '1_week', dueDate: '2026-09-12', title: 'Distribute Day-Of Run-of-Show to All Leads', description: 'Coordinate with string quartet, floral installation crew, and venue lead.', category: 'general', completed: false, priority: 'high' },
      { id: 't5', phase: 'day_of', dueDate: '2026-09-19', title: 'Golden Hour Vows Under Glass Dome', description: 'Exchange bespoke vows surrounded by living botanical arches.', category: 'general', completed: false, priority: 'high' },
    ],
    runOfShow: [
      { id: 'ros-01', time: '02:00 PM', title: 'Bridal Suite & Groom Lounge Staging', durationMinutes: 90, leadPerson: 'Elena & Julian', location: 'Conservatory Private Suites', notes: 'Editorial film portraiture, silk steaming, and champagne toast.', completed: false },
      { id: 'ros-02', time: '04:30 PM', title: 'Electric String Quartet Prelude in Courtyard', durationMinutes: 45, leadPerson: 'Lumière Strings', location: 'Marble Courtyard Fountain', notes: 'Guests arrive; passed vintage French champagne & white truffled gougères.', completed: false },
      { id: 'ros-03', time: '05:15 PM', title: 'Golden Hour Vows Under the Glass Dome', durationMinutes: 35, leadPerson: 'Officiant & Couple', location: 'The Grand Rotunda Dome', notes: 'Ceremony vows, live cello accompaniment, white rose petal recessional.', completed: false },
      { id: 'ros-04', time: '06:00 PM', title: 'Cocktail Hour & Caviar Station', durationMinutes: 75, leadPerson: 'Maison Savour Culinary', location: 'Orangerie Terrace', notes: 'Signature rose cocktails, oyster bar, and guestbook rotary phone.', completed: false },
      { id: 'ros-05', time: '07:30 PM', title: 'Candlelit 5-Course Dinner & Sabered Champagne', durationMinutes: 90, leadPerson: 'Chef Laurent', location: 'Main Conservatory Hall', notes: 'Chandelier dimming, father-of-bride toast, sabering of Jeroboam.', completed: false },
      { id: 'ros-06', time: '09:30 PM', title: 'First Dance & Live 7-Piece Soul Orchestra', durationMinutes: 120, leadPerson: 'The Grand Velvet Band', location: 'Glasshouse Center Stage', notes: 'First dance to "At Last", upbeat soul and vintage funk sets.', completed: false },
      { id: 'ros-07', time: '11:30 PM', title: 'Sparkler Pathway & Vintage Rolls-Royce Sendoff', durationMinutes: 30, leadPerson: 'Coordinator Claire', location: 'Main Garden Gates', notes: 'Smokeless golden sparkler tunnel to getaway car.', completed: false },
    ],
    vendors: [
      {
        id: 'v1',
        name: 'Atelier Botanica Studio',
        role: 'Suspended Floral Architecture',
        category: 'florist',
        status: 'booked',
        estimatedCost: 9500,
        quoteAmount: 9800,
        depositPaid: 4900,
        rating: 4.9,
        contactPerson: 'Claire Dupré',
        email: 'claire@atelierbotanica.com',
        phone: '(212) 555-8921',
        image: 'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&w=800&q=80',
        notes: 'Includes 40ft hanging white phalaenopsis orchid cloud over head table.'
      },
      {
        id: 'v2',
        name: 'Lumière Film & Stills',
        role: 'Medium Format & Super 8mm Film',
        category: 'photography',
        status: 'booked',
        estimatedCost: 7500,
        quoteAmount: 7500,
        depositPaid: 3750,
        rating: 5.0,
        contactPerson: 'Sebastian Vance',
        email: 'sebastian@lumierefilm.co',
        phone: '(212) 555-3410',
        image: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80',
        notes: '2 photographers + vintage Kodak Super 8mm reel delivery.'
      },
      {
        id: 'v3',
        name: 'Maison Savour Culinary',
        role: 'Farm-to-Table Haute Catering',
        category: 'catering',
        status: 'quoted',
        estimatedCost: 18500,
        quoteAmount: 19200,
        depositPaid: 8000,
        rating: 4.8,
        contactPerson: 'Chef Marcus Shaw',
        email: 'events@maisonsavour.com',
        phone: '(212) 555-6677',
        image: 'https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=800&q=80',
        notes: 'Includes interactive raw oyster & caviar bar during cocktail hour.'
      }
    ],
    themes: [
      {
        id: 'i1',
        title: 'Bespoke Botanical Fragrance Bar',
        category: 'Guest Experience',
        vibe: 'Haute Couture Sensory',
        impact: 'High Memorability',
        description: 'Guests blend miniature crystal atomizers with notes of Damask rose, bergamot, and cedarwood as a living scent memory of the night.',
        colorPalette: [
          { name: 'Champagne Gold', hex: '#F3E5AB' },
          { name: 'Velvet Rose', hex: '#D46A7E' },
          { name: 'Sage Botanical', hex: '#9CAF88' },
          { name: 'Obsidian Silk', hex: '#1C1917' },
        ],
        decorStyle: 'French Belle Époque Conservatory & Modern Fine-Art Glass',
        sensoryDetails: 'Damask rose attar in the air, sound of crystal fountains and cello strings.',
        diyTips: [
          'Hand-stamp wax seals with the couple’s crest onto personalized seeded thank-you cards.',
          'Arrange antique brass candelabras at staggered heights across velvet runners.',
        ]
      },
      {
        id: 'i2',
        title: 'Midnight Espresso Martini & Cannoli Cart',
        category: 'Culinary Surprise',
        vibe: 'Late-Night Luxe',
        impact: 'Crowd Favorite',
        description: 'At 11 PM, a brass vintage Italian cart rolls onto the dancefloor serving nitro-infused espresso martinis and pistachio-dipped cannoli.',
        colorPalette: [
          { name: 'Espresso Roast', hex: '#2A1A1F' },
          { name: 'Crema Gold', hex: '#EED9A4' },
          { name: 'Pistachio Mint', hex: '#A3C9A8' },
        ],
        decorStyle: 'Vintage Parisian Brass & Mirror Accents',
        sensoryDetails: 'Roasting espresso aromas, chilled nitro foam, and crisp Italian pastry.',
        diyTips: [
          'Pre-chill coupe glasses in ice buckets lined with fresh rosemary sprigs.',
        ]
      },
      {
        id: 'i3',
        title: 'Audio Guestbook on a 1920s Brass Rotary Phone',
        category: 'Keepsake',
        vibe: 'Nostalgic Cinema',
        impact: 'Heirloom Value',
        description: 'Guests pick up an antique Parisian brass telephone in a velvet booth to leave unfiltered voice toasts pressed onto custom vinyl.',
        colorPalette: [
          { name: 'Antique Brass', hex: '#C5A059' },
          { name: 'Midnight Velvet', hex: '#111827' },
        ],
        decorStyle: 'Velvet Speakeasy Phone Nook',
        sensoryDetails: 'Tactile brass rotary dial, warm vintage lighting, and velvet curtain privacy.',
        diyTips: [
          'Frame instructions in a gilded ornate mini-frame with typewriter font.',
        ]
      }
    ],
    invitations: [
      {
        id: 'inv-01',
        tone: 'formal',
        headline: 'Under the Glass Dome: Julian & Elena',
        body: 'Together with their families, Julian and Elena request the honor of your presence at their botanical wedding celebration at The Vanderbilt Glasshouse.',
        rsvpWording: 'Kindly reply by August 15th. Black tie attire requested.',
        dressCodeNotice: 'Black Tie: Tuxedos and floor-length evening gowns in rich jewel tones.',
      }
    ],
    menus: [
      {
        id: 'menu-01',
        title: 'Michelin-Inspired 5-Course Autumn Degustation',
        welcomeDrinks: ['Sabered Vintage Champagne Rosé', 'Elderflower Citrus Mocktail'],
        appetizers: ['Wild Beluga Caviar & Blinis', 'Truffled Maine Lobster Medallions', 'Heritage Beet Carpaccio'],
        mains: ['Dry-Aged Wagyu Tenderloin with Morel Sauce', 'Pan-Seared Chilean Sea Bass', 'Artisanal Wild Chanterelle Risotto (Vegan)'],
        desserts: ['Gold-Leaf Valrhona Chocolate Dome', 'Meyer Lemon Thyme Tart'],
        dietaryAccommodations: ['Dedicated vegan and gluten-free table service', 'Nut-free pastry kitchen'],
      }
    ],
    entertainment: [
      {
        id: 'ent-01',
        playlistVibe: 'Cinematic Classical Cello & Motown Soul Orchestra',
        keyMoments: [
          { moment: 'Aisle Walk', suggestion: '"Experience" by Ludovico Einaudi on Cello' },
          { moment: 'First Dance', suggestion: '"La Vie En Rose" Live Acoustic Duet' },
          { moment: 'Late Night Euphoria', suggestion: '"Signed, Sealed, Delivered" into Funk House' },
        ],
        interactiveActivities: [
          'Fragrance blending station at Orangerie',
          'Rotary phone voice recordings pressed to vinyl',
        ]
      }
    ],
    speeches: [
      {
        id: 'sp-01',
        speakerRole: 'Father of the Bride',
        tone: 'Poignant, proud, and celebratory',
        speechText: 'From Elena’s first footsteps in our garden to seeing her stand under this cathedral of glass with Julian tonight—my heart is overflowing. Julian, you bring out her greatest laughter and strength. To the two of you, and to a lifetime under open skies.',
        keyPoints: ['Childhood memories', 'Welcoming Julian to the family', 'The toast to their adventure'],
      }
    ],
    contingencies: [
      {
        id: 'c-01',
        risk: 'Excessive conservatory greenhouse humidity or heat',
        severity: 'high',
        mitigation: 'Automated hydraulic roof vents and commercial chiller fans pre-installed.',
        planBAction: 'Activate climate-controlled North Gallery transition within 10 minutes.',
      }
    ]
  },

  {
    id: 'birthday',
    type: 'birthday',
    themeName: 'Cyber Velvet & Electric Magenta',
    title: 'NOVA // 30: Midnight Penthouse Odyssey',
    subtitle: 'Immersive Synthwave Lounge & Holographic Mixology',
    date: '2026-11-14',
    location: 'Skyline Glass Penthouse, Downtown Tokyo / LA',
    guestCount: 95,
    totalBudget: 18500,
    currency: 'USD',
    heroImage: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1800&q=85',
    fontClass: 'font-sans',
    accentPrimary: '#D946EF',
    accentSecondary: '#06B6D4',
    gradientText: 'from-fuchsia-400 via-cyan-300 to-indigo-400',
    gradientBg: 'from-fuchsia-600 via-purple-600 to-cyan-500',
    badgeBg: 'bg-fuchsia-500/15 text-fuchsia-400 border-fuchsia-500/30',
    palette: [
      { name: 'Electric Magenta', hex: '#FF007F' },
      { name: 'Cyber Cyan', hex: '#00F0FF' },
      { name: 'Ultraviolet Velvet', hex: '#4C1D95' },
      { name: 'Void Chrome', hex: '#090D16' },
    ],
    themeNotes: 'Neon rooftop synthwave aesthetic with holographic cocktails, 360 slow-mo photo rig, and midnight wagyu ramen.',
    createdAt: '2026-10-10T14:00:00Z',
    updatedAt: '2026-10-29T13:00:00Z',
    budgetItems: [
      { id: 'b1', category: 'venue', name: 'Penthouse Loft & Rooftop Buyout', estimatedCost: 6500, actualCost: 6500, paid: true, color: '#D946EF', dueDate: '2026-10-01' },
      { id: 'b2', category: 'catering', name: 'Molecular Mixology & Neon Ice Bar', estimatedCost: 4800, actualCost: 5100, paid: true, color: '#06B6D4', dueDate: '2026-11-01' },
      { id: 'b3', category: 'decor', name: 'Projection Mapping & Laser Rig', estimatedCost: 3200, actualCost: 2950, paid: false, color: '#8B5CF6', dueDate: '2026-11-10' },
      { id: 'b4', category: 'entertainment', name: 'Vinyl House DJ & Electric Sax', estimatedCost: 2200, actualCost: 2200, paid: true, color: '#EC4899', dueDate: '2026-11-05' },
      { id: 'b5', category: 'catering', name: 'Omakase Bite Stations & Metallic Cake', estimatedCost: 1800, actualCost: 1650, paid: false, color: '#3B82F6', dueDate: '2026-11-12' },
    ],
    milestones: [
      { id: 't1', phase: '1_month', dueDate: '2026-10-15', title: 'Send Augmented Reality NFC VIP Keycards', description: 'Digital hologram invitations sent to 95 guests.', category: 'marketing', completed: true, priority: 'high' },
      { id: 't2', phase: '1_week', dueDate: '2026-11-07', title: 'Program 360° Sound-Reactive LED Tunnel', description: 'Sync lasers and visual projection to DJ playlist.', category: 'entertainment', completed: true, priority: 'high' },
      { id: 't3', phase: 'day_of', dueDate: '2026-11-14', title: 'Liquid Nitrogen Chrome Cake Cutting', description: 'Pyrotechnic sparklers and neon ice bar kickoff.', category: 'general', completed: false, priority: 'high' },
    ],
    runOfShow: [
      { id: 'ros-01', time: '09:00 PM', title: 'Bioluminescent Welcome Shots in Mirror Tunnel', durationMinutes: 60, leadPerson: 'Alchemy Vapor Bar', location: 'Penthouse Entrance', notes: 'Guests walk through reactive LED infinity portal with signature neon shots.', completed: false },
      { id: 'ros-02', time: '10:00 PM', title: 'Vinyl House DJ & Electric Saxophone Set', durationMinutes: 75, leadPerson: 'DJ Kai & Leo Sax', location: 'Skyline Terrace Deck', notes: 'Deep progressive house with live brass improvisation.', completed: false },
      { id: 'ros-03', time: '11:15 PM', title: 'Liquid Nitrogen Chrome Cake & Pyrotechnic Toast', durationMinutes: 30, leadPerson: 'Everyone', location: 'Center Neon Lounge', notes: 'Metallic tiered cake with champagne cannon toast.', completed: false },
      { id: 'ros-04', time: '01:00 AM', title: 'Sunrise Rooftop Silent Disco & Ramen Bar', durationMinutes: 120, leadPerson: 'Late Night Crew', location: 'Open Sky Helipad', notes: 'Custom holographic takeout boxes with steaming tonkotsu ramen.', completed: false },
    ],
    vendors: [
      {
        id: 'v1',
        name: 'Kroma Visual Lab',
        role: '3D Projection Mapping & Lasers',
        category: 'entertainment',
        status: 'booked',
        estimatedCost: 3200,
        quoteAmount: 2950,
        depositPaid: 1500,
        rating: 5.0,
        contactPerson: 'Kai Tanaka',
        email: 'kai@kromalab.io',
        phone: '(213) 555-0912',
        image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=800&q=80',
        notes: 'Custom audio-reactive visuals synced to guest movement.'
      },
      {
        id: 'v2',
        name: 'Alchemy Vapor Bar',
        role: 'Molecular Cocktail Experience',
        category: 'catering',
        status: 'booked',
        estimatedCost: 4800,
        quoteAmount: 5100,
        depositPaid: 2500,
        rating: 4.9,
        contactPerson: 'Sora Kim',
        email: 'mix@alchemyvapor.co',
        phone: '(213) 555-7722',
        image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=800&q=80',
        notes: 'Edible citrus smoke bubbles and laser-etched clear ice spheres.'
      },
      {
        id: 'v3',
        name: 'Glitch Paparazzi Booth',
        role: '360° Slow-Mo Matrix Rig',
        category: 'photography',
        status: 'quoted',
        estimatedCost: 1500,
        quoteAmount: 1400,
        depositPaid: 500,
        rating: 4.8,
        contactPerson: 'Jordan Reed',
        email: 'book@glitchbooth.com',
        phone: '(213) 555-3344',
        image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=800&q=80',
        notes: 'Instant AirDrop delivery with custom chrome magazine overlays.'
      }
    ],
    themes: [
      {
        id: 'i1',
        title: 'NFC Smart Wristbands for Aura Matchmaking',
        category: 'Interactive Tech',
        vibe: 'Cyber Social',
        impact: 'Icebreaker Gold',
        description: 'Wristbands glow the same color when two guests share a mutual connection or trivia answer about the birthday host.',
        colorPalette: [
          { name: 'Electric Magenta', hex: '#FF007F' },
          { name: 'Cyber Cyan', hex: '#00F0FF' },
          { name: 'Ultraviolet Velvet', hex: '#4C1D95' },
          { name: 'Void Chrome', hex: '#090D16' },
        ],
        decorStyle: 'Tokyo Neo-Noir & Cyber Lounge',
        sensoryDetails: 'Bioluminescent laser glows, bass-heavy house beats, and nitrogen cocktail vapors.',
        diyTips: [
          'Program cheap NFC tags to load photo albums onto guests’ smartphones automatically.',
        ]
      },
      {
        id: 'i2',
        title: 'Temporary UV Chrome Tattoo Parlor',
        category: 'Style Station',
        vibe: 'Editorial Club',
        impact: 'High IG Shareability',
        description: 'Minimalist metallic and blacklight-reactive fine-line airbrush tattoos applied by a live editorial makeup artist.',
        colorPalette: [
          { name: 'Liquid Chrome', hex: '#E5E7EB' },
          { name: 'Neon Violet', hex: '#8B5CF6' },
        ],
        decorStyle: 'Illuminated Acrylic Beauty Vanity',
        sensoryDetails: 'Gentle mist of fine airbrush ink and glowing ultraviolet mirrors.',
        diyTips: [
          'Pre-print stencils of custom cyber icons and birth year (1996) typography.',
        ]
      },
      {
        id: 'i3',
        title: '2 AM Truffle Wagyu Sliders & Matcha Soft Serve',
        category: 'Late Night Fuel',
        vibe: 'Tokyo Konbini Luxe',
        impact: 'Essential Energy',
        description: 'Custom holographic takeout boxes served right on the dancefloor to keep energy peaking past midnight.',
        colorPalette: [
          { name: 'Matcha Jade', hex: '#4ade80' },
          { name: 'Smoked Charcoal', hex: '#18181b' },
        ],
        decorStyle: 'Konbini Neon Food Kiosk',
        sensoryDetails: 'Sizzling savory wagyu, truffle butter warmth, and chilled sweet ceremonial matcha.',
        diyTips: [
          'Brand simple kraft food boxes with custom holographic logo stickers.',
        ]
      }
    ],
    invitations: [
      {
        id: 'binv-01',
        tone: 'witty',
        headline: 'NOVA // 30: Entering The Next Orbit',
        body: 'Join us atop the downtown skyline for an evening of molecular cocktails, immersive synths, and pure celebration as we usher in decade three.',
        rsvpWording: 'Tap your NFC card or reply online by Nov 1st to register security clearance.',
        dressCodeNotice: 'Cyber Luxe: Sharp silhouettes, metallic pops, and midnight black attire.',
      }
    ],
    menus: [
      {
        id: 'bm-01',
        title: 'Tokyo Midnight Molecular Bites',
        welcomeDrinks: ['Smoked Dragonfruit Yuzu Margarita', 'Bioluminescent Electrolyte Elixir'],
        appetizers: ['A5 Wagyu Nigiri with Truffle Caviar', 'Crispy Tuna Tartare Rice Cakes', 'Edamame Truffle Dumplings'],
        mains: ['Miso-Glazed Chilean Sea Bass Skewers', 'Smoked Pork Belly Bao with Kimchi Slaw', 'Shiitake Truffle Noodles (Vegan)'],
        desserts: ['Liquid Nitrogen Chrome Birthday Cake', 'Matcha White Chocolate Ice Cream Bars'],
        dietaryAccommodations: ['Full pescatarian and gluten-free roll station', 'Plant-based baos available'],
      }
    ],
    entertainment: [
      {
        id: 'bent-01',
        playlistVibe: 'French Touch House, Future Funk & Live Electric Saxophone',
        keyMoments: [
          { moment: 'Guest Arrival', suggestion: 'Daft Punk & French House Instrumentals' },
          { moment: 'Cake Cutting', suggestion: 'Justice - "D.A.N.C.E." or Kavinsky' },
          { moment: 'Peak Midnight', suggestion: 'Peggy Gou & Fred Again Festival Edits' },
        ],
        interactiveActivities: [
          '360 Slow-Mo Matrix Video Booth',
          'UV Airbrush Chrome Body Art Bar',
        ]
      }
    ],
    speeches: [
      {
        id: 'bsp-01',
        speakerRole: 'Best Friend',
        tone: 'Witty, energetic, and celebratory',
        speechText: 'Thirty years on this planet and you’ve somehow managed to make every single year look effortless and stylish. Looking at this skyline tonight, nobody shines brighter. Here’s to chapter thirty!',
        keyPoints: ['College crazy stories', 'Honoring ambition & loyalty', 'The countdown toast'],
      }
    ],
    contingencies: [
      {
        id: 'bc-01',
        risk: 'High rooftop wind speeds exceeding 30 knots',
        severity: 'medium',
        mitigation: 'Motorized glass panoramic wind shields and indoor loft atrium backup.',
        planBAction: 'Move laser production and DJ station inside within 10 minutes.',
      }
    ]
  },

  {
    id: 'community',
    type: 'community',
    themeName: 'Botanical Emerald & Terracotta',
    title: 'Solstice Earth & Artisan Commons',
    subtitle: 'Zero-Waste Neighborhood Harvest Gala & Lantern Parade',
    date: '2026-10-10',
    location: 'Redwood Heritage Park & Amphitheater',
    guestCount: 450,
    totalBudget: 32000,
    currency: 'USD',
    heroImage: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&w=1800&q=85',
    fontClass: 'font-serif',
    accentPrimary: '#10B981',
    accentSecondary: '#EA580C',
    gradientText: 'from-emerald-400 via-amber-200 to-orange-400',
    gradientBg: 'from-emerald-600 via-teal-600 to-orange-500',
    badgeBg: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    palette: [
      { name: 'Emerald Moss', hex: '#10B981' },
      { name: 'Sunlit Amber', hex: '#F59E0B' },
      { name: 'Terracotta Clay', hex: '#EA580C' },
      { name: 'Forest Obsidian', hex: '#064E3B' },
    ],
    themeNotes: 'Zero-waste neighborhood harvest festival with solar acoustic stages, living plant installations, and artisan makers.',
    createdAt: '2026-10-15T09:00:00Z',
    updatedAt: '2026-10-29T14:00:00Z',
    budgetItems: [
      { id: 'cb-01', category: 'venue', name: 'Redwood Amphitheater & Sound Variance Permit', estimatedCost: 8500, actualCost: 8200, paid: true, color: '#10B981', dueDate: '2026-08-01' },
      { id: 'cb-02', category: 'catering', name: 'Farm-to-Park Artisan Stalls & Organic Cider Bar', estimatedCost: 9500, actualCost: 9800, paid: true, color: '#EA580C', dueDate: '2026-09-15' },
      { id: 'cb-03', category: 'venue', name: '30 Weighted Canopies & Reclaimed Timber Staging', estimatedCost: 4500, actualCost: 4400, paid: true, color: '#F59E0B', dueDate: '2026-09-20' },
      { id: 'cb-04', category: 'entertainment', name: 'Solar Soundstage & Acoustic Buskers Circle', estimatedCost: 4200, actualCost: 4000, paid: false, color: '#06B6D4', dueDate: '2026-10-01' },
      { id: 'cb-05', category: 'logistics', name: 'Zero-Waste Compost Hub & Green Volunteer Radios', estimatedCost: 3300, actualCost: 3100, paid: true, color: '#8B5CF6', dueDate: '2026-10-05' },
      { id: 'cb-06', category: 'contingency', name: 'Weather Shelter & Emergency Medical Kit', estimatedCost: 2000, actualCost: 0, paid: false, color: '#EC4899', dueDate: '2026-10-10' },
    ],
    milestones: [
      { id: 'cm-01', phase: '6_months', dueDate: '2026-04-15', title: 'City Park Authority Permit & Environmental Signoff', description: 'Municipal park approval and acoustic variance granted.', category: 'permits', completed: true, priority: 'high' },
      { id: 'cm-02', phase: '3_months', dueDate: '2026-07-15', title: 'Curate 30 Sustainable Local Makers & Food Trucks', description: 'Screen zero-packaging artisan stalls and organic farmers.', category: 'catering', completed: true, priority: 'high' },
      { id: 'cm-03', phase: '1_month', dueDate: '2026-09-10', title: 'Volunteer Orientation & Zero-Waste Station Drill', description: 'Brief 45 neighborhood volunteer leads on waste stream diversion.', category: 'logistics', completed: true, priority: 'medium' },
      { id: 'cm-04', phase: 'day_of', dueDate: '2026-10-10', title: 'Sunset Solar Lantern Parade & Mayor Address', description: 'Community lantern procession and announcement of local civic grants.', category: 'general', completed: false, priority: 'high' },
    ],
    runOfShow: [
      { id: 'cros-01', time: '10:00 AM', title: 'Gates Open & Welcome Acoustic Banjo Prelude', durationMinutes: 60, leadPerson: 'Youth String Ensemble', location: 'Redwood Solar Amphitheater', notes: 'Community arrival; hand out reusable canvas seed tote bags.', completed: false },
      { id: 'cros-02', time: '11:30 AM', title: 'Interactive Seed Bomb & Composting Workshop', durationMinutes: 45, leadPerson: 'Master Naturalist Sarah', location: 'Pavilion Lawn', notes: 'Hands-on family workshop; clay seed balls for urban pollinators.', completed: false },
      { id: 'cros-03', time: '01:30 PM', title: 'Artisan Makers Showcase & Cider Tasting', durationMinutes: 90, leadPerson: 'Vendor Chair Maya', location: 'Commons Meadow', notes: 'Locally pressed spiced ciders, artisan sourdough, and honey tasting.', completed: false },
      { id: 'cros-04', time: '04:00 PM', title: 'Civic Grant Awards & Mayor Keynote', durationMinutes: 30, leadPerson: 'Civic Council Chairs', location: 'Main Solar Stage', notes: 'Announcing 3 grants for community green rooftop gardens.', completed: false },
      { id: 'cros-05', time: '06:30 PM', title: 'Sunset Solar Lantern Parade', durationMinutes: 60, leadPerson: 'All Neighborhood Teams', location: 'Park Perimeter Walkway', notes: 'Children and families carry illuminated paper lanterns around the lake.', completed: false },
    ],
    vendors: [
      {
        id: 'cv-01',
        name: 'Cascade Timber Stages',
        role: 'Modular Reclaimed Wood Stages',
        category: 'rentals',
        status: 'booked',
        estimatedCost: 4500,
        quoteAmount: 4400,
        depositPaid: 2200,
        rating: 4.9,
        contactPerson: 'Gordon Vance',
        email: 'gordon@cascadestage.org',
        phone: '(503) 555-8840',
        image: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=800&q=80',
        notes: 'Constructed from sustainably salvaged Oregon Douglas fir.'
      },
      {
        id: 'cv-02',
        name: 'SolSound Mobile Audio',
        role: 'Solar Lithium Mobile Audio Rig',
        category: 'dj_music',
        status: 'booked',
        estimatedCost: 4200,
        quoteAmount: 4000,
        depositPaid: 2000,
        rating: 5.0,
        contactPerson: 'Leo Barnes',
        email: 'leo@solsound.org',
        phone: '(503) 555-9921',
        image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=800&q=80',
        notes: 'Zero carbon footprint; trailer-mounted solar panel audio rig.'
      },
      {
        id: 'cv-03',
        name: 'EcoSan Clean Restrooms',
        role: 'Zero-Footprint Luxury Restrooms',
        category: 'security',
        status: 'quoted',
        estimatedCost: 2500,
        quoteAmount: 2200,
        depositPaid: 0,
        rating: 4.8,
        contactPerson: 'Tina Alvarez',
        email: 'service@ecosan.org',
        phone: '(503) 555-1120',
        image: 'https://images.unsplash.com/photo-1541971875076-8f970d573be6?auto=format&fit=crop&w=800&q=80',
        notes: 'Includes organic solar-lit washing sinks and compostable towels.'
      }
    ],
    themes: [
      {
        id: 'ct-01',
        title: 'Seed Bomb & Pollinator Hotel Station',
        category: 'Guest Experience',
        vibe: 'Eco-Interactive',
        impact: 'High Memorability',
        description: 'Children and adults hand-roll native wildflower seed bombs and build wooden bee nesting tubes to place in neighborhood green spaces.',
        colorPalette: [
          { name: 'Emerald Moss', hex: '#10B981' },
          { name: 'Sunlit Amber', hex: '#F59E0B' },
          { name: 'Terracotta Clay', hex: '#EA580C' },
          { name: 'Forest Obsidian', hex: '#064E3B' },
        ],
        decorStyle: 'Pacific Northwest Timber & Living Botanical Burlap',
        sensoryDetails: 'Aroma of red cedarwood shavings, fresh pressed warm cider, and live bluegrass fiddle.',
        diyTips: [
          'Paint signs using non-toxic milk paint on salvaged pallet boards.',
        ]
      },
      {
        id: 'ct-02',
        title: 'Live Digital Zero-Waste Diversion Scale',
        category: 'Civic Innovation',
        vibe: 'Impact Visualizer',
        impact: 'High Community Pride',
        description: 'A large digital outdoor scale displays cumulative pounds of organic compost diverted from landfills every hour during the festival.',
        colorPalette: [
          { name: 'Fresh Sprout', hex: '#4ADE80' },
          { name: 'Rich Compost', hex: '#451A03' },
        ],
        decorStyle: 'Salvaged Wood Solar Meter',
        sensoryDetails: 'Visual digital counter updates with cheering sound effects upon every 100 lbs milestone.',
        diyTips: [
          'Connect an industrial scale to an open-source LED marquee board.',
        ]
      }
    ],
    invitations: [
      {
        id: 'cinv-01',
        tone: 'warm',
        headline: 'Celebrate Our Earth & Neighbors',
        body: 'Join 450 neighbors at Redwood Heritage Amphitheater for an afternoon of live acoustic music, artisan food trucks, tree plantings, and our evening lantern walk.',
        rsvpWording: 'Free admission! RSVP online to reserve your family seedling kit.',
        dressCodeNotice: 'Casual outdoor apparel and walking shoes. Bring your refillable water flasks!',
      }
    ],
    menus: [
      {
        id: 'cm-01',
        title: 'Pacific Northwest Farm-to-Park Harvest Feast',
        welcomeDrinks: ['Hot Spiced Heirloom Apple Cider', 'Cold Brew Nitro Coffee from Local Roaster'],
        appetizers: ['Warm Soft Pretzels with Smoked Cheddar Dip', 'Roasted Sweet Corn Ribs with Chili Lime'],
        mains: ['Wood-Fired Sourdough Personal Flatbreads', 'Organic Lentil Veggie Burgers with Slaw', 'Pacific Salmon Chowder in Bread Bowls'],
        desserts: ['Marionberry Hand Pies', 'Vegan Molasses Ginger Cookies'],
        dietaryAccommodations: ['Zero single-use plastics permitted on festival grounds', 'Certified compostable tableware'],
      }
    ],
    entertainment: [
      {
        id: 'cent-01',
        playlistVibe: 'Acoustic Americana, Pacific Northwest Bluegrass & Celtic Fiddle',
        keyMoments: [
          { moment: 'Morning Gates Open', suggestion: 'Acoustic Guitar & Mountain Dulcimer' },
          { moment: 'Midday Family Hours', suggestion: 'Upbeat Folk Singalongs & World Drumming Circle' },
          { moment: 'Sunset Lantern Walk', suggestion: 'Ethereal Fiddle & Ambient Acoustic Harmonies' },
        ],
        interactiveActivities: [
          'Urban Pollinator Hotel Building Station',
          'Pass-the-Seed Passport challenge across 5 artisan stalls',
        ]
      }
    ],
    speeches: [
      {
        id: 'csp-01',
        speakerRole: 'Civic Association President',
        tone: 'Inspiring, welcoming, and community-centered',
        speechText: 'Welcome everyone! When we see four hundred and fifty of our neighbors smiling under these redwoods, we are reminded that community is our greatest renewable resource. Let us celebrate our makers, our youth, and the earth.',
        keyPoints: ['Thanking volunteer chairs', 'Celebrating zero-waste goals', 'Lighting the lanterns together'],
      }
    ],
    contingencies: [
      {
        id: 'cc-01',
        risk: 'Typical Oregon coastal rain squall',
        severity: 'high',
        mitigation: 'All 30 artisan canopies are commercial heavy-duty vinyl with sidewalls ready to zip down.',
        planBAction: 'Move acoustic performances under the covered timber pavilion within 15 minutes.',
      }
    ]
  }
];
