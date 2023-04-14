import { Logging, getCurrentDateWithTimezone } from '../helpers.js';
import { getPageById, queryPageFromDB, updatePage } from './notionHelper.js';

const counterPlusOne = async (propName) => {
  try {
    // get today's document
    const { results } = await queryPageFromDB({
      database_id: process.env.NOTION_HABIT_DB_ID,
      filter: {
        "property": "Created time",
        "date": {
          "on_or_after": `${getCurrentDateWithTimezone()}`
        }
      }
    })
    if (!results.length) {
      throw new Error('\`results\` is empty')
    }
    
    // get original counter value
    const docId = results?.[0]?.id;
    // get property id
    const { properties } = await getPageById({page_id: docId})
    const originalValue = (Object.entries(properties).find(p => p[0] === propName) || [])?.[1]?.number

    if (typeof originalValue !== 'number') {
      throw new Error(`Get ${propName} Attribute incorrect. Either it does not exist or its' not a number type.`)
    }

    // update, counter +1
    const newValue = originalValue + 1
    const res = await updatePage({
      page_id: docId,
      properties: {
        [propName]: {
          number: newValue
        }
      }
    })
    if (res?.id) {
      Logging.success(`${propName} modified from ${originalValue} to ${newValue}!`)
    } else {
      Logging.error(`Cannot modify ${propName}`)
    }
  } catch (getDocErr) {
    if (getDocErr?.status === 429) {
      // slow down the request.
      Logging.warn(`${getDocErr.code}, Retry in 3s...`)
      setTimeout(() => {
        counterPlusOne(propName)
      }, 3000);
      return;
    }
    Logging.error(getDocErr)
    Logging.error("Get Today's habit error! Please mannualy create the document")
  }
};

export default counterPlusOne;
