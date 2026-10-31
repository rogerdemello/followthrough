// Free-to-use photos from Unsplash, loaded from their CDN. Credits are shown in the site footer.
export const PHOTOS = {
  hero: {
    id: "1758873269035-aae0e1fd3422",
    alt: "A teammate presenting a plan on a whiteboard while colleagues take notes",
    credit: "Vitaly Gariev",
  },
  speak: {
    id: "1631642130860-4ee662475333",
    alt: "A man in headphones speaking",
    credit: "Andrik Langfield",
  },
  review: {
    id: "1758691736872-61a1f75fe2d5",
    alt: "A team sorting sticky notes on a glass wall",
    credit: "Vitaly Gariev",
  },
  confirm: {
    id: "1615914143778-1a1a6e50c5dd",
    alt: "Someone writing in a notebook next to a laptop",
    credit: "Vadim Bozhko",
  },
  meeting: {
    id: "1517245386807-bb43f82c33c4",
    alt: "A meeting around a table with a laptop",
    credit: "Headway",
  },
} as const;

export type PhotoKey = keyof typeof PHOTOS;

export function photoUrl(key: PhotoKey, width: number): string {
  return `https://images.unsplash.com/photo-${PHOTOS[key].id}?fm=jpg&q=70&w=${width}&auto=format&fit=crop`;
}
