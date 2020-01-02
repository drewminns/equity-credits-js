export interface SectionData {
  shop_id: number;
  merchant: string;
  store_url: string;
  product_desc: string;
  media: { type: string; url: string; alt: string }[]
}

export interface Section {
  section_id: number;
  layout: string;
  data: SectionData[];
}

export interface GroupData {
  title: string;
  group_name: string;
  sections: Section[];
}
