import type { NextApiHandler } from "next"
import { gotHtml } from "../../util/got"
import { BASE_URL, makeCategoryUrl, makeGameKey } from "../../util/urls"

export type Query = { categoryId: string }
export type Response = { games: { name: string; key: string }[] }

const handler: NextApiHandler = async (req, res) => {
  try {
    const { $ } = await gotHtml(
      makeCategoryUrl((req.query as Query).categoryId)
    )
    const $links = $("a.category")

    const games = $links.get().flatMap((a) => {
      const $a = $(a)
      const url = new URL($a.attr("href"), BASE_URL)
      return [{ name: $a.text().trim(), key: makeGameKey(url) }]
    })

    res.setHeader("Cache-Control","max-age=43200, stale-while-revalidate=43200")
    res.json({ games } as Response)
  } catch (err) {
    res.status(500).send("" + err)
    console.error(err)
  } finally {
    res.end()
  }
}

export default handler
