import type { GetStaticPaths, GetStaticProps, NextPage } from "next"
import Link from "next/link"
import useSWR from "swr"
import type { Response } from "../api/games"

export type Params = { id: string }
export type Props = { id: string }

const CategoryPage: NextPage<Props> = ({ id }) => {
  const { data } = useSWR<Response>(
    `/api/games?categoryId=${encodeURIComponent(id)}`
  )

  return (
    <>
      <h1>Juegos</h1>

      <ul>
        {data?.games.map((game) => (
          <li key={game.key}>
            <Link href={`/game/${game.key}`}>
              <a>{game.name}</a>
            </Link>
          </li>
        ))}
      </ul>
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
