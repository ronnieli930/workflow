import { Logging, getInputMultilines, getInputSingleline } from "../helpers.js";
import { appendBlk, deleteBlk, retrieveBlkChildren } from "../notion/index.js";
import { drawProgressBar } from "./updateDate.js";

const dayBlkIds = [
  process.env.NOTION_AGENDA_SUN_BLK_ID,
  process.env.NOTION_AGENDA_MON_BLK_ID,
  process.env.NOTION_AGENDA_TUE_BLK_ID,
  process.env.NOTION_AGENDA_WED_BLK_ID,
  process.env.NOTION_AGENDA_THU_BLK_ID,
  process.env.NOTION_AGENDA_FRI_BLK_ID,
  process.env.NOTION_AGENDA_SAT_BLK_ID,
]

const todoColorType = {
  '-r': "🟥",
  '-o': "🟧",
  '-y': "🟨",
  '-g': "🟩",
  '-b': "🟦",
  '-p': "🟪",
  '-w': "⬜",
}

export const resetAg = async (...args) => {
  const content = await getInputSingleline("Back up yet? (type 'yes' if you did)");
  if (content.toLowerCase() !== 'yes') {
    Logging.error("Go BACKUP first then reset.")
    process.exit(0)
  }

  Logging.warn(`Resetting Agenda...`);
  try {
    let counter = 0;
    drawProgressBar(counter/dayBlkIds.length);
    for (const blkId of dayBlkIds) {

      // retrieve id
      const { results: blkChildren } = await retrieveBlkChildren({
        block_id: blkId,
      });
      
      // clear children
      const delReqs = blkChildren.map(e => async () => deleteBlk({block_id: e.id}))
      for (const req of delReqs) {
        try {
          await req()
        } catch (err) {
          Logging.error(`\rReset error: ${err}`)
        }
      }

      // append new children
      const todoRes = await appendBlk({
        block_id: blkId,
        children: [
          {
            toggle: {
              rich_text: [
                {
                  text: {
                    content: "TODO",
                  },
                  annotations: {
                    bold: true,
                    code: true,
                    color: 'green'
                  }
                },
              ]
            }
          }
        ]
      })
      const logsRes = await appendBlk({
        block_id: blkId,
        children: [
          {
            toggle: {
              rich_text: [
                {
                  text: {
                    content: "LOG",
                  },
                  annotations: {
                    bold: true,
                    code: true,
                    color: 'blue'
                  }
                },
              ]
            }
          }
        ]
      })

      // update counter
      counter += 1;
      drawProgressBar(counter/dayBlkIds.length);
    }
    Logging.success(`\n\\^o^/ Succesfully reset the Block`)
  } catch (error) {
    console.log(error)
    Logging.error("Reset failed: ", error);
  } finally {
    process.exit(0)
  }
}
