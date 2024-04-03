import { mongooseAdapter } from "@payloadcms/db-mongodb";
import { viteBundler } from "@payloadcms/bundler-vite";
import { buildConfig } from "payload/config";
import path from "path";
import Users from "./collections/Users";
import Media from "./collections/Media";
import Pages from "./collections/Pages";
import { cloudStorage } from "@payloadcms/plugin-cloud-storage";
import { s3Adapter } from "@payloadcms/plugin-cloud-storage/s3";
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
  // disable rate limiting
  rateLimit: {
    window: 5 * 60 * 1000, // 5 minutes
    max: 1000000000,
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
  collections: [Pages, Media, Users],
  typescript: {
    outputFile: path.resolve(__dirname, "payload-types.ts"),
  },
  plugins: [
    addSlugField,
    addUrlField,
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
