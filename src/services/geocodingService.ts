export interface LocationResult {
  name: string;
  displayName: string;
  latitude: number;
  longitude: number;
  type: string;
}

export async function searchLocation(query: string): Promise<LocationResult[]> {
  const params = new URLSearchParams({
    q: query,
    format: 'json',
    limit: 5,
    addressdetails: 1,
  });

  const response = await fetch(`https://nominatim.openstreetmap.org/search?${params}`, {
    headers: {
      'Accept': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to search location');
  }

  const data = await response.json();

  return data.map((item: any) => ({
    name: item.display_name.split(',')[0],
    displayName: item.display_name,
    latitude: parseFloat(item.lat),
    longitude: parseFloat(item.lon),
    type: item.type,
  }));
}

export function formatLocationName(displayName: string, maxLength: number = 40): string {
  const parts = displayName.split(',');
  if (parts.length <= 2) return displayName;

  const shortened = parts.slice(0, 2).join(',');
  return shortened.length > maxLength
    ? shortened.substring(0, maxLength) + '...'
    : shortened;
}
