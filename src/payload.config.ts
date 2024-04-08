import { mongooseAdapter } from "@payloadcms/db-mongodb";
import { viteBundler } from "@payloadcms/bundler-vite";
import { buildConfig } from "payload/config";
import path from "path";
import Users from "./collections/Users";
import Media from "./collections/Media";
import Pages from "./collections/Pages";
import addSlugField from "./plugins/addSlugField";
import addUrlField from "./plugins/addUrlField";
import {
  BlocksFeature,
  LinkFeature,
  lexicalEditor,
} from "@payloadcms/richtext-lexical";
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
  plugins: [addSlugField, addUrlField],
});
