import type { AssetType } from "@/lib/schema/recipe";

export interface AssetTypeTemplate {
  id: AssetType;
  label: string;
  whatModelGenerates: string;
  whatStaysFixed: string;
  templateVersion: string;
  subjectPhrase: string;
  extraNegative: string[];
}

export const ASSET_TYPE_TEMPLATES: Record<AssetType, AssetTypeTemplate> = {
  product_hero: {
    id: "product_hero",
    label: "Product hero",
    whatModelGenerates: "Background, surface and lighting around the real product photo",
    whatStaysFixed: "Product pixels, logo, price",
    templateVersion: "product_hero@1",
    subjectPhrase:
      "an empty staging area sized and lit for a single hero product to be composited in afterwards",
    extraNegative: ["any product or packaging rendered by the model", "invented product features"],
  },
  lifestyle_scene: {
    id: "lifestyle_scene",
    label: "Lifestyle scene",
    whatModelGenerates: "Setting, people, props and mood",
    whatStaysFixed: "Product photo (composited or referenced), logo, copy",
    templateVersion: "lifestyle_scene@1",
    subjectPhrase: "a lifestyle scene with people naturally using the space, product left as open negative space",
    extraNegative: ["visible brand logos on props or clothing", "narrow or stereotyped representation of people"],
  },
  seasonal_promo: {
    id: "seasonal_promo",
    label: "Seasonal or promo",
    whatModelGenerates: "Themed background, textures and props",
    whatStaysFixed: "Offer copy, dates, logo, legal line",
    templateVersion: "seasonal_promo@1",
    subjectPhrase: "a seasonal themed background with decorative props and textures",
    extraNegative: ["any rendered price, date, or offer text", "holiday symbols outside the brand's approved set"],
  },
  type_led_banner: {
    id: "type_led_banner",
    label: "Type-led banner",
    whatModelGenerates: "Abstract background or texture",
    whatStaysFixed: "All typography and copy",
    templateVersion: "type_led_banner@1",
    subjectPhrase: "an abstract background texture with no representational subject",
    extraNegative: ["any letterforms, numerals, or pseudo-text", "photographic subjects"],
  },
};

export const ASSET_TYPE_LIST = Object.values(ASSET_TYPE_TEMPLATES);
