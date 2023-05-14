import { Logging, getInputMultilines } from "../helpers.js";
import { appendBlk, retrieveBlkChildren } from "../notion/index.js";

const idMap = {
  sun: process.env.NOTION_AGENDA_SUN_BLK_ID,
  mon: process.env.NOTION_AGENDA_MON_BLK_ID,
  tue: process.env.NOTION_AGENDA_TUE_BLK_ID,
  wed: process.env.NOTION_AGENDA_WED_BLK_ID,
  thu: process.env.NOTION_AGENDA_THU_BLK_ID,
  fri: process.env.NOTION_AGENDA_FRI_BLK_ID,
  sat: process.env.NOTION_AGENDA_SAT_BLK_ID,
}

const todoColorType = {
  '-r': "🟥",
  '-o': "🟧",
  '-y': "🟨",
  '-g': "🟩",
  '-b': "🟦",
  '-p': "🟪",
  '-w': "⬜",
}

export const addTodo = async (...args) => {
  const day = args.find(e => Object.keys(idMap).includes(e.toLowerCase()))?.toLowerCase()
  const color = args.find(e => e.includes('-'))
  const targetDay = day || new Date().toString().slice(0, 3).toLowerCase();
  const formattedDay = `${targetDay.charAt(0).toUpperCase()}${targetDay.slice(1).toLowerCase()}`;

  const content = await getInputMultilines("What are you going to do?");
  if (!content) {
    Logging.error("Nothing to add, bye.")
    process.exit(0)
  }

  Logging.warn(`Adding => ${formattedDay}...`);
  const dayBlkId = idMap[targetDay];
  const targetColor = todoColorType[color] || todoColorType['-b']
  try {
    // retrieve id
    const { results: blkChildren } = await retrieveBlkChildren({
      block_id: dayBlkId,
    });
    const todoBlk = blkChildren.find(blk => blk.toggle?.rich_text?.[0]?.plain_text === 'TODO' )
    if (!todoBlk) {
      throw new Error("Cannot find TODO Block!")
    }
    const { id: blkId } = todoBlk;
    
    const res = await appendBlk({
      block_id: blkId,
      children: [
        {
          to_do: {
            rich_text: [
              {
                text: {
                  content: `${targetColor} ${content}` || "" 
                }
              },
            ]
          }
        }
      ]
    })

    if (res?.results?.length) {
      Logging.success(`Succesfully added:\n${targetColor} ${content}`)
    }
  } catch (error) {
    Logging.error("Adding failed: ");
    console.error(error)
  } finally {
    process.exit(0)
  }
}
