import md5 from 'js-md5'
import Identicon from 'identicon.js'

export default (uid: string): Blob => {
  const hex = md5(uid)
  const data = new Identicon(hex, {
    size: 420,
    format: 'png'
  }).toString()
  const bin = atob(data)
  const buf = new Uint8Array(bin.length)
  for (let i = 0; i < bin.length; i++) {
    buf[i] = bin.charCodeAt(i)
  }
  const blob = new Blob([buf.buffer], { type: 'image/png' })
  return blob
}
