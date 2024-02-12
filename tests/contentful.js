import contentful from 'contentful';
import { inspect } from 'util';

import { createFromJson } from '../dist/index.js';

import 'dotenv/config';

const spaceId = process.env.CONTENTFUL_SPACE_ID;
const accessToken = process.env.CONTENTFUL_ACCESS_TOKEN;
const contentTypeId = process.env.CONTENTFUL_CONTENT_TYPE_ID;
const contentEntryId = process.env.CONTENTFUL_CONTENT_ENTRY_ID;

async function createFromContentfulContentType(
  spaceID,
  accessToken,
  environmentID,
  contentTypeID) {

  const client = contentful.createClient({
    space: spaceID,
    accessToken: accessToken,
    environment: environmentID
  });

  const contentType = await client.getContentType(contentTypeID);
  // console.log(JSON.stringify(contentType));

  return createFromJson(contentTypeID, contentType);
}

async function createFromContentfulEntry(
  spaceID,
  accessToken,
  environmentID,
  entryID,
  include = 1) {

  const client = contentful.createClient({
    space: spaceID,
    accessToken: accessToken,
    environment: environmentID
  });

  // const entries = await client.withoutLinkResolution.getEntries({ 'sys.id': entryID, include });
  // const entries = await client.getEntries({ 'sys.id': entryID, include });
  const entry = await client.getEntry(entryID, { include });
  console.log(JSON.stringify(entry));
  const data = entry;

  const entryContentTypeID = 'Entry'; // entry?.sys?.contentType?.sys?.id;
  // console.log(JSON.stringify(entries));

  // console.log(inspect(entries, false, 20, true));

  // const data = JSON.stringify(entries.items[0]);
  return createFromJson(entryContentTypeID, data);

}

// const result = await createFromContentfulContentType(spaceId, accessToken, 'master', contentTypeId);
// console.log(result);

const result = await createFromContentfulEntry(spaceId, accessToken, 'master', contentEntryId, 2);
// console.log(result);