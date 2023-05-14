import { Client } from '@notionhq/client';
import { config as envConfig } from 'dotenv';

envConfig()

const notion = new Client({
  auth: process.env.NOTION_TOKEN,
})

const queryPageFromDB = notion.databases.query;
const getPageById = notion.pages.retrieve;
const updatePage = notion.pages.update;
const appendBlk = notion.blocks.children.append;
const retrieveBlkChildren = notion.blocks.children.list;
const deleteBlk = notion.blocks.delete;
const updateBlk = notion.blocks.update;

export {
  notion,
  queryPageFromDB,
  getPageById,
  updatePage,
  appendBlk,
  updateBlk,
  retrieveBlkChildren,
  deleteBlk,
}
