import type { NextApiHandler } from "next"
import { gotHtml } from "../../util/got"
import { BASE_URL, makeCategoryKey } from "../../util/urls"

export type Response = { categories: { name: string; key: string }[] }

const handler: NextApiHandler = async (req, res) => {
  try {
    const { $ } = await gotHtml(BASE_URL)
    const $links = $(".moduletable_menu a")

    const categories = $links.get().flatMap((a) => {
      const $a = $(a)
      const url = new URL($a.attr("href"), BASE_URL)
      if (url.searchParams.get("option") !== "com_weblinks") return []
      return [{ name: $a.text().trim(), key: makeCategoryKey(url) }]
    })

    res.setHeader("Cache-Control", "max-age=43200, stale-while-revalidate=43200")
    res.json({ categories } as Response)
  } catch (err) {
    res.status(500).send("" + err)
    console.error(err)
  } finally {
    res.end()
  }
}

export default handler
