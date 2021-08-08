import type { GetStaticPaths, GetStaticProps, NextPage } from "next"
import { FunctionComponent } from "react"
import useSWR from "swr"
import type { Page, Response } from "../api/guides"

export type Params = { id: string }
export type Props = { id: string }

const PageLinks: FunctionComponent<{ pages: Page[] }> = ({ pages }) => (
  <ul>
    {pages.map((page, i) => (
      <li key={i}>
        <p>
          <a href={page.url}>{page.name}</a>
        </p>
        {page.children ? <PageLinks pages={page.children} /> : null}
      </li>
    ))}
  </ul>
)

const CategoryPage: NextPage<Props> = ({ id }) => {
  const { data } = useSWR<Response>(
    `/api/guides?gameId=${encodeURIComponent(id)}`
  )

  return (
    <>
      <h1>Guías</h1>

      <ul>{data?.pages ? <PageLinks pages={data.pages} /> : null}</ul>
    </>
  )
}

export default CategoryPage

export const getStaticProps: GetStaticProps<Props, Params> = async ({
  params,
}) => ({
  props: { id: params.id },
})

export const getStaticPaths: GetStaticPaths<Params> = async () => ({
  paths: [],
  fallback: "blocking",
})
