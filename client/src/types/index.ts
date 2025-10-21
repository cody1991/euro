export interface Itinerary {
  id: number;
  title: string;
  start_date: string;
  end_date: string;
  cities?: City[];
  transportation?: Transportation[];
}

export interface City {
  id: number;
  name: string;
  name_en?: string;
  country: string;
  latitude: number;
  longitude: number;
  arrival_date: string;
  departure_date: string;
  attractions?: Attraction[];
  accommodation?: Accommodation;
}

export interface Accommodation {
  hotel_name?: string;
  hotel_name_en?: string;
  address?: string;
  phone?: string;
  check_in?: string;
  check_out?: string;
}

export interface Attraction {
  id: number;
  name: string;
  name_en?: string;
  description: string;
  city_id: number;
  latitude: number;
  longitude: number;
  category: string;
  rating: number;
  booking_required?: boolean;
  booking_advance?: string;
  booking_notes?: string;
}

export interface Transportation {
  id: number;
  from_city_id: number;
  to_city_id: number;
  transport_type: string;
  departure_time: string;
  arrival_time: string;
  duration: string;
  flight_number?: string;
  train_number?: string;
  departure_location?: string;
  departure_location_en?: string;
  arrival_location?: string;
  arrival_location_en?: string;
}

export interface RecommendedAttraction {
  name: string;
  description: string;
  latitude: number;
  longitude: number;
  category: string;
  rating: number;
  city: string;
  country: string;
}
