import * as readline from 'readline/promises'
import { Logging, useCrayon } from "../helpers.js";
import { appendBlk } from "../notion/index.js";

export const getNowISOString = () => {
  const now = new Date()
  const hourThatIWant = now.getHours().toString().padStart(2, '0')
  return now.toISOString().substring(0,11) + hourThatIWant + now.toISOString().substring(13,16)
}

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
}

export const addTodo = async (...args) => {
  const day = args.find(e => Object.keys(idMap).includes(e.toLowerCase()))?.toLowerCase()
  const color = args.find(e => e.includes('-'))
  const targetDay = day || new Date().toString().slice(0, 3).toLowerCase();
  const formattedDay = `${targetDay.charAt(0).toUpperCase()}${targetDay.slice(1).toLowerCase()}`;
  const rl = readline.createInterface({input: process.stdin, output: process.stdout})
  const { cyan } = useCrayon();

  const content = await rl.question(cyan("What are you going to do?\n"))
  if (!content) {
    Logging.error("Nothing to add, bye.")
    process.exit(0)
  }

  Logging.warn(`Adding => ${formattedDay}...`);
  const blkId = idMap[targetDay];
  const targetColor = todoColorType[color] || todoColorType['-b']
  try {
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
              // { mention: { date: {
              //       start: getNowISOString(),
              //       time_zone: "Asia/Hong_Kong"
              // }}} TODO:  Reserved for Adding Time Entry !!
            ]
          }
        }
      ]
    })
    if (res?.results?.length) {
      Logging.success(`Succesfully added:\n${targetColor} ${content},`)
    }
  } catch (error) {
    Logging.error("Adding failed: ", error);
  } finally {
    rl.close()
    process.exit(0)
  }
}
