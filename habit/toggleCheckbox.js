import { Logging, getCurrentDateWithTimezone } from '../helpers.js';
import { getPageById, queryPageFromDB, updatePage } from '../notion/index.js';

const toggleCheckbox = async (propName, value) => {
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
    const originalValue = (Object.entries(properties).find(p => p[0] === propName) || [])?.[1]?.checkbox

    if (typeof originalValue !== 'boolean') {
      throw new Error(`Get ${propName} Attribute incorrect. Either it does not exist or its' not a number type.`)
    }

    // update set toggle to desired value or toggle it
    const newValue = typeof value === 'boolean' ? value : !originalValue
    if (typeof value !== 'boolean') {
      Logging.warn('Default: toggle checkbox')
    }
    const res = await updatePage({
      page_id: docId,
      properties: {
        [propName]: {
          checkbox: newValue
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
        toggleCheckbox(propName)
      }, 3000);
      return;
    }
    Logging.error(getDocErr)
    Logging.error("Get Today's habit error! Please mannualy create the document")
    process.exit(0);
  }
};

export default toggleCheckbox;
