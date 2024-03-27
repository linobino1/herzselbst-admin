import {
  UploadNode,
  type HTMLConverter,
  type SerializedUploadNode,
} from "@payloadcms/richtext-lexical";
import payload from "payload";

export const UploadHTMLConverter: HTMLConverter<SerializedUploadNode> = {
  converter: async ({ node }) => {
    const uploadDocument = await payload.findByID({
      id: node.value.id,
      collection: node.relationTo as "media",
      depth: 0,
    });
    const url = (payload?.config?.serverURL || "") + uploadDocument?.url;

    if (!(uploadDocument?.mimeType as string)?.startsWith("image")) {
      // Only images can be serialized as HTML
      return ``;
    }

    return `<img src="${url}" alt="${uploadDocument?.filename}" width="${uploadDocument?.width}"  height="${uploadDocument?.height}"/>`;
  },
  nodeTypes: [UploadNode.getType()], // This is the type of the lexical node that this converter can handle. Instead of hardcoding 'upload' we can get the node type directly from the UploadNode, since it's static.
};
