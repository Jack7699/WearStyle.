import { MoroccanCity } from '../types';

export const MOROCCAN_CITIES: MoroccanCity[] = [
  { name: 'Casablanca', region: 'Casablanca-Settat', deliveryTime: '24 Hours', shippingRate: 35 },
  { name: 'Rabat', region: 'Rabat-Salé-Kénitra', deliveryTime: '24-48 Hours', shippingRate: 35 },
  { name: 'Marrakech', region: 'Marrakech-Safi', deliveryTime: '24-48 Hours', shippingRate: 40 },
  { name: 'Tangier', region: 'Tanger-Tétouan-Al Hoceïma', deliveryTime: '24-48 Hours', shippingRate: 40 },
  { name: 'Fes', region: 'Fès-Meknès', deliveryTime: '48 Hours', shippingRate: 40 },
  { name: 'Agadir', region: 'Souss-Massa', deliveryTime: '48 Hours', shippingRate: 45 },
  { name: 'Meknes', region: 'Fès-Meknès', deliveryTime: '24-48 Hours', shippingRate: 40 },
  { name: 'Oujda', region: 'Oriental', deliveryTime: '48-72 Hours', shippingRate: 45 },
  { name: 'Kenitra', region: 'Rabat-Salé-Kénitra', deliveryTime: '24-48 Hours', shippingRate: 35 },
  { name: 'Tetouan', region: 'Tanger-Tétouan-Al Hoceïma', deliveryTime: '48 Hours', shippingRate: 40 },
  { name: 'Mohammedia', region: 'Casablanca-Settat', deliveryTime: '24 Hours', shippingRate: 35 },
  { name: 'Salé', region: 'Rabat-Salé-Kénitra', deliveryTime: '24 Hours', shippingRate: 35 },
  { name: 'El Jadida', region: 'Casablanca-Settat', deliveryTime: '24-48 Hours', shippingRate: 40 },
  { name: 'Nador', region: 'Oriental', deliveryTime: '48-72 Hours', shippingRate: 45 },
  { name: 'Beni Mellal', region: 'Béni Mellal-Khénifra', deliveryTime: '48 Hours', shippingRate: 45 },
  { name: 'Khouribga', region: 'Béni Mellal-Khénifra', deliveryTime: '48 Hours', shippingRate: 45 },
  { name: 'Safi', region: 'Marrakech-Safi', deliveryTime: '48 Hours', shippingRate: 45 },
  { name: 'Temara', region: 'Rabat-Salé-Kénitra', deliveryTime: '24 Hours', shippingRate: 35 },
  { name: 'Essaouira', region: 'Marrakech-Safi', deliveryTime: '48 Hours', shippingRate: 45 },
  { name: 'Laayoune', region: 'Laâyoune-Sakia El Hamra', deliveryTime: '72 Hours', shippingRate: 50 },
  { name: 'Dakhla', region: 'Dakhla-Oued Ed-Dahab', deliveryTime: '72-96 Hours', shippingRate: 55 },
  { name: 'Al Hoceima', region: 'Tanger-Tétouan-Al Hoceïma', deliveryTime: '48-72 Hours', shippingRate: 45 },
  { name: 'Taza', region: 'Fès-Meknès', deliveryTime: '48 Hours', shippingRate: 45 },
  { name: 'Settat', region: 'Casablanca-Settat', deliveryTime: '24-48 Hours', shippingRate: 40 },
];

export const FREE_SHIPPING_THRESHOLD_MAD = 500;
