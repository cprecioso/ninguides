import cheerio from "cheerio"
import defaultGot, { OptionsOfTextResponseBody } from "got"

export { defaultGot }

export const got = defaultGot.extend({ https: { rejectUnauthorized: false } })

export const gotHtml = async (
  url: string | URL,
  options?: OptionsOfTextResponseBody
) => {
  const res = await got(url, options)
  return { $: cheerio.load(res.body), finalUrl: res.url }
}

export type $Element = ReturnType<ReturnType<typeof cheerio.load>>
