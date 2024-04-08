import fs from "fs";
import path from "path";
import type { Payload } from "payload";

const collections = ["pages"];

export const seed = async (payload: Payload): Promise<void> => {
  payload.logger.info("Seeding database...");

  payload.logger.info(`— Clearing media...`);

  const mediaDir = path.resolve(__dirname, "../../media");
  if (fs.existsSync(mediaDir)) {
    fs.rmdirSync(mediaDir, { recursive: true });
  }

  payload.logger.info(`— Clearing collections and globals...`);

  // clear the database
  await Promise.all([
    ...collections.map(async (collection) =>
      payload.delete({
        collection: collection as "pages",
        where: {},
      })
    ),
  ]);

  payload.logger.info(`— Seeding pages...`);

  // create page1 & page2
  const [page1, page2] = await Promise.all([
    payload.create({
      collection: "pages",
      data: {
        title: "Page 1",
        content: {
          root: {
            type: "root",
            format: "",
            indent: 0,
            version: 1,
            direction: "ltr",
            children: [],
          },
        },
      },
    }),
    payload.create({
      collection: "pages",
      data: {
        title: "Page 2",
        content: {
          root: {
            type: "root",
            format: "",
            indent: 0,
            version: 1,
            direction: "ltr",
            children: [],
          },
        },
      },
    }),
  ]);

  // add a link to page2 in page1
  await payload.update({
    collection: "pages",
    id: page1.id,
    data: {
      content: {
        root: {
          type: "root",
          format: "",
          indent: 0,
          version: 1,
          direction: "ltr",
          children: [
            {
              type: "paragraph",
              format: "",
              indent: 0,
              version: 1,
              direction: "ltr",
              children: [
                {
                  type: "heading",
                  tag: "h1",
                  direction: "ltr",
                  format: "",
                  indent: 0,
                  version: 1,
                  children: [
                    {
                      detail: 0,
                      format: 0,
                      mode: "normal",
                      style: "",
                      text: "Page1",
                      type: "text",
                      version: 1,
                    },
                  ],
                },
                {
                  direction: "ltr",
                  format: "",
                  indent: 0,
                  type: "link",
                  version: 2,
                  fields: {
                    doc: {
                      value: page2.id,
                      relationTo: "pages",
                    },
                    linkType: "internal",
                  },
                  children: [
                    {
                      detail: 0,
                      format: 0,
                      mode: "normal",
                      style: "",
                      text: "link to page2",
                      type: "text",
                      version: 1,
                    },
                  ],
                },
              ],
            },
          ],
        },
      },
    },
  });

  // add a link to page1 in page2
  await payload.update({
    collection: "pages",
    id: page2.id,
    data: {
      content: {
        root: {
          type: "root",
          format: "",
          indent: 0,
          version: 1,
          direction: "ltr",
          children: [
            {
              type: "paragraph",
              format: "",
              indent: 0,
              version: 1,
              direction: "ltr",
              children: [
                {
                  type: "heading",
                  tag: "h1",
                  direction: "ltr",
                  format: "",
                  indent: 0,
                  version: 1,
                  children: [
                    {
                      detail: 0,
                      format: 0,
                      mode: "normal",
                      style: "",
                      text: "Page2",
                      type: "text",
                      version: 1,
                    },
                  ],
                },
                {
                  direction: "ltr",
                  format: "",
                  indent: 0,
                  type: "link",
                  version: 2,
                  fields: {
                    doc: {
                      value: page1.id,
                      relationTo: "pages",
                    },
                    linkType: "internal",
                  },
                  children: [
                    {
                      detail: 0,
                      format: 0,
                      mode: "normal",
                      style: "",
                      text: "link to page1",
                      type: "text",
                      version: 1,
                    },
                  ],
                },
              ],
            },
          ],
        },
      },
    },
  });

  payload.logger.info("Seeded database successfully!");
  payload.logger.info(`page1 id: ${page1.id}`);
};
