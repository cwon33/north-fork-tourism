type LatLng = { lat: number; lng: number };
export type Business = {
  id?: string;
  name: string;
  description?: string;
  category?: string;
  iconUrl?: string;
  bannerUrl?: string;

  photos?: string[];
  promotions?: string[];
  events?: string[];
  location?: LatLng;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zip?: string;
  };
  contact?: {
    phone?: string;
    website?: string;
    mapsUrl?: string;
  };
  isActive: boolean;
  createdAt?: any;
  updatedAt?: any;
};

export type Events = {
    id?: string;
    business: string;
    businessId: string;
    title: string;
    description?: string;
    imageUrl?: string;
    address?: {
      street?: string;
      city?: string;
      state?: string;
      zip?: string;
    };
    isActive: boolean;
    startAt?: string;
    endAt?: string;
    createdAt?: any;
    updatedAt?: any;
  };