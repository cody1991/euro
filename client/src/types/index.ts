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
  country: string;
  latitude: number;
  longitude: number;
  arrival_date: string;
  departure_date: string;
  attractions?: Attraction[];
}

export interface Attraction {
  id: number;
  name: string;
  description: string;
  city_id: number;
  latitude: number;
  longitude: number;
  category: string;
  rating: number;
}

export interface Transportation {
  id: number;
  from_city_id: number;
  to_city_id: number;
  transport_type: string;
  departure_time: string;
  arrival_time: string;
  duration: string;
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
