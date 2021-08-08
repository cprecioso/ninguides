import type { NextPage } from "next"
import Link from "next/link"
import useSWR from "swr"
import type { Response } from "./api/categories"

const IndexPage: NextPage = () => {
  const { data } = useSWR<Response>("/api/categories")

  return (
    <>
      <h1>Consolas</h1>

      <ul>
        {data?.categories.map((category) => (
          <li key={category.key}>
            <Link href={`/category/${category.key}`}>
              <a>{category.name}</a>
            </Link>
          </li>
        ))}
      </ul>
    </>
  )
}

export default IndexPage
