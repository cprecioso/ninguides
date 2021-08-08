export const BASE_URL = "https://www.guiasnintendo.com/"

export const makeFullUrl =
  (baseUrl: string | URL) =>
  (template: TemplateStringsArray, ...substitutions: any[]) =>
    new URL(
      String.raw(template, ...substitutions.map((v) => encodeURIComponent(v))),
      baseUrl
    )

const u = makeFullUrl(BASE_URL)

export const makeCategoryKey = (url: URL) =>
  `${url.searchParams.get("id")}:${url.searchParams.get("Itemid")}`

export const makeCategoryUrl = (key: ReturnType<typeof makeCategoryKey>) => {
  const [id, itemId] = key.split(":")
  return u`/index.php?option=com_weblinks&view=category&id=${id}&Itemid=${itemId}`
}

export const makeGameKey = makeCategoryKey

export const makeGameUrl = (key: ReturnType<typeof makeGameKey>) => {
  const [id, itemId] = key.split(":")
  return u`/index.php?option=com_weblinks&task=weblink.go&id=${id}&Itemid=${itemId}`
}
