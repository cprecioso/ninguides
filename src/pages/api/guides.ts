import type { CheerioAPI } from "cheerio"
import type { NextApiHandler } from "next"
import { $Element, gotHtml } from "../../util/got"
import { makeGameUrl } from "../../util/urls"

export type Query = { gameId: string }
export type Page = { name: string; url?: string; children?: Page[] }
export type Response = { pages: Page[] }

const extractMenu = (
  $: CheerioAPI,
  $ul: $Element,
  guideMainUrl: string | URL
): Page[] =>
  $ul
    .children("li")
    .get()
    .map((li) => {
      const $li = $(li)
      const $a = $li.children("a")

      const name = $a.text().trim()

      const href = $a.attr("href")
      const url =
        href == null || href === "#" ? void 0 : new URL(href, guideMainUrl).href

      const $submenu = $li.children("ul")
      const hasSubmenu = $submenu.length > 0
      const children = hasSubmenu
        ? extractMenu($, $submenu, guideMainUrl)
        : void 0

      return { name, url, children }
    })

const handler: NextApiHandler = async (req, res) => {
  try {
    const { $, finalUrl } = await gotHtml(
      makeGameUrl((req.query as Query).gameId)
    )
    const $menu = $(".menu")
    const pages = extractMenu($, $menu, finalUrl)

    res.json({ pages } as Response)
  } catch (err) {
    res.status(500).send("" + err)
    console.error(err)
  } finally {
    res.end()
  }
}

export default handler
