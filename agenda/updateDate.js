import { Logging, useCrayon } from "../helpers.js";
import { updateBlk } from "../notion/index.js";

const getCurrentWeekStr = () => {
  const res = {
    mon: {id: process.env.NOTION_AGENDA_MON_BLK_ID, value: ''},
    tue: {id: process.env.NOTION_AGENDA_TUE_BLK_ID, value: ''},
    wed: {id: process.env.NOTION_AGENDA_WED_BLK_ID, value: ''},
    thu: {id: process.env.NOTION_AGENDA_THU_BLK_ID, value: ''},
    fri: {id: process.env.NOTION_AGENDA_FRI_BLK_ID, value: ''},
    sat: {id: process.env.NOTION_AGENDA_SAT_BLK_ID, value: ''},
    sun: {id: process.env.NOTION_AGENDA_SUN_BLK_ID, value: ''},
  }

  // First day is Monday,
  // On Sunday will get next week, i.e. next Sunday in result
  const today = new Date();
  const monday = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay()+1);
  Object.keys(res).forEach((e, index) => {
    const date = new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() + index + 1);
    const formattedDate = date.toISOString().slice(0, 10);
    res[e].value = formattedDate;
  })
  return res;
}

const PROGRESS_BAR_LENGTH = 12;

export const drawProgressBar = (percentage) => {
  const {cyan} = useCrayon();
  const drawBar = () => `${'🟦'.repeat(Math.round(percentage*PROGRESS_BAR_LENGTH))}${'⬜'.repeat(Math.round((1-percentage)*PROGRESS_BAR_LENGTH))}`
  process.stdout.write(`Progress: ${cyan(`[${drawBar()}]`)} ${(percentage*100).toFixed(2)}%\r`);
}

export const updateDate = async () => {
  Logging.info('Updating Agenda date to current week...');
  const blkIdMap =  getCurrentWeekStr()

  const requests = Object.keys(blkIdMap).map(day => async () => updateBlk({
    block_id: blkIdMap[day]?.id,
      paragraph: {
      rich_text: [
        {
          type: 'text',
          text: {
            content:"🎯 ",
          },
        },
        {
          type: "mention",
          mention: {
            date: {
              start: blkIdMap[day].value,
              end: null,
            }
          },
          annotations: {
            bold: true,
          }
        }
      ]
    }
  }))
  let counter = 0;
  drawProgressBar(counter/7);
  for (const req of requests) {
    try {
      const res = await req()
      if (res?.id) {
        counter += 1;
        drawProgressBar(counter/7);
      }
    } catch (err) {
      Logging.error(`\nupdate error: ${err}`)
    }
  }
  Logging.success("\n\\^o^/ Successfully update Agenda to current week!")
}
