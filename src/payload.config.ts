import { mongooseAdapter } from "@payloadcms/db-mongodb";
import { viteBundler } from "@payloadcms/bundler-vite";
import { buildConfig } from "payload/config";
import path from "path";
import Users from "./collections/Users";
import Media from "./collections/Media";
import Pages from "./collections/Pages";
import Categories from "./collections/Categories";
import seoPlugin from "@payloadcms/plugin-seo";
import { cloudStorage } from "@payloadcms/plugin-cloud-storage";
import { s3Adapter } from "@payloadcms/plugin-cloud-storage/s3";
import Navigations from "./globals/Navigations";
import Site from "./globals/Site";
import addSlugField from "./plugins/addSlugField";
import addUrlField from "./plugins/addUrlField";
import {
  BlocksFeature,
  HTMLConverterFeature,
  LinkFeature,
  lexicalEditor,
} from "@payloadcms/richtext-lexical";
import { HTMLConverterWithAlign } from "./lexical/HTMLConverterWithAlign";
import { UploadHTMLConverter } from "./lexical/UploadHTMLCOnverter";
import Video from "./blocks/Video";
import Publications from "./blocks/Publications";
import Foldable from "./blocks/Foldable";
import Button from "./blocks/Button";
import Review from "./blocks/Review";
import CTAColumns from "./blocks/CTAColumns";
import Newsletter from "./blocks/Newsletter";
import Gallery from "./blocks/Gallery";
import GoogleMaps from "./blocks/GoogleMaps";

export default buildConfig({
  rateLimit: {
    window: 15 * 60 * 1000, // 15 minutes
    max: process.env.NODE_ENV === "development" ? 9999999 : 1000, // limit each IP to 1000 requests per windowMs
  },
  localization: {
    locales: ["de"],
    defaultLocale: "de",
  },
  admin: {
    user: Users.slug,
    bundler: viteBundler(),
    vite: (incomingViteConfig) => ({
      ...incomingViteConfig,
      build: {
        ...incomingViteConfig.build,
        emptyOutDir: false,
      },
    }),
  },
  editor: lexicalEditor({
    features: ({ defaultFeatures }) => [
      ...defaultFeatures,
      LinkFeature({
        enabledCollections: ["pages", "media"],
      }),
      BlocksFeature({
        blocks: [
          Button,
          CTAColumns,
          Foldable,
          Gallery,
          GoogleMaps,
          Publications,
          Review,
          Video,
          Newsletter,
        ],
      }),
      HTMLConverterFeature({
        // @ts-ignore
        converters: ({ defaultConverters }) => {
          return [
            HTMLConverterWithAlign,
            UploadHTMLConverter,
            ...defaultConverters,
          ];
        },
      }),
    ],
  }),
  db: mongooseAdapter({
    url: process.env.MONGODB_URI ?? false,
    migrationDir: path.resolve(__dirname, "migrations"),
  }),
  collections: [Pages, Categories, Media, Users],
  globals: [Navigations, Site],
  typescript: {
    outputFile: path.resolve(__dirname, "cms/payload-types.ts"),
  },
  plugins: [
    addSlugField,
    addUrlField,
    seoPlugin({
      globals: ["site"],
      uploadsCollection: "media",
      fields: [
        {
          name: "additionalMetaTags",
          label: "Zusätzliche Meta-Tags",
          labels: {
            singular: "Meta-Tag",
            plural: "Meta-Tags",
          },
          type: "array",
          fields: [
            {
              name: "key",
              label: "Key",
              type: "text",
              required: true,
            },
            {
              name: "value",
              label: "Value",
              type: "text",
              required: true,
            },
          ],
        },
      ],
    }),
    cloudStorage({
      enabled: process.env.S3_ENABLED === "true",
      collections: {
        media: {
          disablePayloadAccessControl: true, // serve files directly from S3
          generateFileURL: (file) => {
            return `${process.env.MEDIA_URL}/${file.filename}`;
          },
          adapter: s3Adapter({
            bucket: process.env.S3_BUCKET || "",
            config: {
              endpoint: process.env.S3_ENDPOINT || undefined,
              credentials: {
                accessKeyId: process.env.S3_ACCESS_KEY || "",
                secretAccessKey: process.env.S3_SECRET_KEY || "",
              },
              region: process.env.S3_REGION || "",
            },
          }),
        },
      },
    }),
  ],
});
