export interface SectionData {
  shop_id: number;
  shop_name: string;
  shop_url: string;
  products: [{ name: string; url: string }];
  image: { type: string; url: string; alt: string };
}

export interface Section {
  section_id: number;
  layout: string;
  merchants: SectionData[];
}

export interface GroupData {
  title: string;
  group_name: string;
  sections: Section[];
}
