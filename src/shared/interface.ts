type Dimensions = {
  width: number;
  height: number;
}

export interface Media {
  alt_text: string;
  tablet_up: {
    small: {
      url: string;
      dimensions: Dimensions;
    }
    large: {
      url: string;
      dimensions: Dimensions;
    }
  }
  mobile: {
    small: {
      url: string;
      dimensions: Dimensions;
    }
    large: {
      url: string;
      dimensions: Dimensions;
    }
  }
}

export interface SectionData {
  shop_id: number;
  shop_name: string;
  shop_url: string;
  products: [{ name: string; url: string }];
  media: Media;
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
