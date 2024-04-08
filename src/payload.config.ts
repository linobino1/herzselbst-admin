import { mongooseAdapter } from "@payloadcms/db-mongodb";
import { viteBundler } from "@payloadcms/bundler-vite";
import { buildConfig } from "payload/config";
import path from "path";
import { BlocksFeature, lexicalEditor } from "@payloadcms/richtext-lexical";

export default buildConfig({
  collections: [
    {
      slug: "users",
      auth: true,
      fields: [],
    },
    {
      slug: "pages",
      access: {
        read: () => true,
      },
      fields: [
        {
          name: "title",
          type: "text",
        },
        {
          name: "content",
          type: "richText",
        },
        {
          name: "url",
          type: "text",
          hooks: {
            beforeChange: [({ siblingData }) => `/${siblingData.id || ""}`],
          },
        },
      ],
    },
  ],
  editor: lexicalEditor({
    features: ({ defaultFeatures }) => [
      ...defaultFeatures,
      BlocksFeature({
        blocks: [
          {
            slug: "columns",
            fields: [
              {
                name: "columns",
                type: "array",
                fields: [
                  {
                    name: "content",
                    type: "richText",
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
          },
        ],
      }),
    ],
  }),
  admin: {
    user: "users",
    bundler: viteBundler(),
    vite: (incomingViteConfig) => ({
      ...incomingViteConfig,
      build: {
        ...incomingViteConfig.build,
        emptyOutDir: false,
      },
    }),
  },
  db: mongooseAdapter({
    url: process.env.MONGODB_URI ?? false,
  }),
  typescript: {
    outputFile: path.resolve(__dirname, "payload-types.ts"),
  },
});
