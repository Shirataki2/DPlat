interface Option {
  displayDate: boolean,
  displayHM: boolean,
  displaySec: boolean,
  displayMilliSec: boolean
}

const defaultOption = {
  displayDate: true,
  displayHM: true,
  displaySec: false,
  displayMilliSec: false
}

// eslint-disable-next-line no-undef
export default (date: Date, option: Partial<Option> = defaultOption): string => {
  option = { ...defaultOption, ...option }
  const formatted = '' +
    (option.displayDate ? `${date.getFullYear()}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getDate().toString().padStart(2, '0')}` : '') +
    (option.displayHM ? ` ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}` : '') +
    (option.displaySec ? `:${date.getSeconds().toString().padStart(2, '0')}` : '') +
    (option.displayMilliSec ? `.${date.getMilliseconds().toFixed(3)}` : '')
  return formatted
}

export const toDifDate = (date: number): string => {
  const y = Math.floor(date / (1000 * 60 * 60 * 24 * 365))
  const m = Math.floor(date / (1000 * 60 * 60 * 24 * 30))
  const d = Math.floor(date / (1000 * 60 * 60 * 24))
  const H = Math.floor(date / (1000 * 60 * 60))
  const M = Math.floor(date / (1000 * 60))
  const S = Math.floor(date / (1000))
  if (y > 0) { return `${y}年前` }
  if (m > 0) { return `${m}ヶ月前` }
  if (d > 0) { return `${d}日前` }
  if (H > 0) { return `${H}時間前` }
  if (M > 0) { return `${M}分前` }
  if (S > 10) { return `${S}秒前` }
  return '数秒前'
}
