import type { CollectionConfig } from "payload/types";
import { publicReadOnly } from "../access/publicReadOnly";

export const Media: CollectionConfig = {
  slug: "media",
  access: publicReadOnly,
  upload: true,
  fields: [
    {
      name: "alt",
      label: "alt text",
      type: "text",
      hooks: {
        beforeValidate: [
          // use filename as alt text if alt text is empty
          ({ value, data }) => {
            if (typeof value === "string" && value.length > 0) {
              return value;
            }
            if (typeof data?.filename === "string") {
              return data.filename.split(".")[0];
            }
            return value;
          },
        ],
      },
    },
  ],
};

export default Media;
