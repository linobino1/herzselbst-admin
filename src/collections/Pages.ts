import type { CollectionConfig, FieldHookArgs } from "payload/types";
import { publicReadOnly } from "../access/publicReadOnly";

const Pages: CollectionConfig = {
  slug: "pages",
  labels: {
    singular: "Seite",
    plural: "Seiten",
  },
  admin: {
    group: "Inhalte",
    useAsTitle: "title",
    defaultColumns: ["title", "slug"],
    pagination: {
      defaultLimit: 50,
    },
  },
  access: publicReadOnly,
  custom: {
    addUrlField: {
      hook: ({ siblingData }: FieldHookArgs) => `/${siblingData.slug || ""}`,
    },
    addSlugField: {
      from: "title",
    },
  },
  fields: [
    {
      name: "title",
      type: "text",
      required: true,
    },
    {
      name: "content",
      type: "richText",
    },
  ],
};

export default Pages;
