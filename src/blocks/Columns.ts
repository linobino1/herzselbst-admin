import { BlocksFeature, lexicalEditor } from "@payloadcms/richtext-lexical";
import type { Block } from "payload/types";

export const Columns: Block = {
  slug: "Columns",
  fields: [
    {
      name: "items",
      type: "array",
      fields: [
        {
          name: "content",
          type: "richText",
          required: true,
          editor: lexicalEditor({
            features: ({ defaultFeatures }) => [
              ...defaultFeatures,
              BlocksFeature({
                blocks: [],
              }),
            ],
          }),
        },
      ],
    },
  ],
};

export default Columns;
