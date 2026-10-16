import { GhanaRegion } from '../types';

export interface RegionInfo {
  name: GhanaRegion;
  capital: string;
  popularTowns: string[];
}

export const GHANA_REGIONS: RegionInfo[] = [
  {
    name: 'Greater Accra',
    capital: 'Accra',
    popularTowns: ['Accra Central', 'East Legon', 'Osu', 'Airport Residential', 'Tema', 'Spintex', 'Madina', 'Dansoman', 'Cantonments', 'Achimota']
  },
  {
    name: 'Ashanti',
    capital: 'Kumasi',
    popularTowns: ['Kumasi Adum', 'Bantama', 'Asokwa', 'Ayeduase (KNUST)', 'Tafo', 'Obuasi', 'Mampong', 'Ejisu']
  },
  {
    name: 'Western',
    capital: 'Sekondi-Takoradi',
    popularTowns: ['Takoradi', 'Sekondi', 'Tarkwa', 'Effia-Kwesimintsim', 'Axim']
  },
  {
    name: 'Central',
    capital: 'Cape Coast',
    popularTowns: ['Cape Coast', 'Kasoa', 'Elmina', 'Winneba', 'Mfantseman']
  },
  {
    name: 'Eastern',
    capital: 'Koforidua',
    popularTowns: ['Koforidua', 'Nkawkaw', 'Nsawam', 'Aburi', 'Akosombo']
  },
  {
    name: 'Volta',
    capital: 'Ho',
    popularTowns: ['Ho', 'Hohoe', 'Aflao', 'Keta', 'Anloga']
  },
  {
    name: 'Northern',
    capital: 'Tamale',
    popularTowns: ['Tamale Central', 'Sagnarigu', 'Yendi', 'Bimbilla']
  },
  {
    name: 'Upper East',
    capital: 'Bolgatanga',
    popularTowns: ['Bolgatanga', 'Navrongo', 'Bawku', 'Paga']
  },
  {
    name: 'Upper West',
    capital: 'Wa',
    popularTowns: ['Wa', 'Jirapa', 'Lawra', 'Nandom']
  },
  {
    name: 'Bono',
    capital: 'Sunyani',
    popularTowns: ['Sunyani', 'Berekum', 'Dormaa Ahenkro']
  },
  {
    name: 'Bono East',
    capital: 'Techiman',
    popularTowns: ['Techiman', 'Kintampo', 'Atebubu', 'Nkoranza']
  },
  {
    name: 'Ahafo',
    capital: 'Goaso',
    popularTowns: ['Goaso', 'Kenyasi', 'Mim', 'Bechem']
  },
  {
    name: 'Oti',
    capital: 'Dambai',
    popularTowns: ['Dambai', 'Nkwanta', 'Jasikan', 'Kadjebi']
  },
  {
    name: 'Savannah',
    capital: 'Damongo',
    popularTowns: ['Damongo', 'Salaga', 'Bole', 'Sawla']
  },
  {
    name: 'North East',
    capital: 'Nalerigu',
    popularTowns: ['Nalerigu', 'Walewale', 'Gambaga', 'Bunkpurugu']
  },
  {
    name: 'Western North',
    capital: 'Sefwi Wiawso',
    popularTowns: ['Sefwi Wiawso', 'Bibiani', 'Enchi', 'Juaboso']
  }
];

export const ALL_REGION_NAMES: GhanaRegion[] = GHANA_REGIONS.map(r => r.name);
