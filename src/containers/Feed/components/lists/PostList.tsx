import PostCard from "@components/PostCard"
import { TPosts } from "@/src/types"
import { useRouter } from "next/router"
import React, { useEffect, useState } from "react"
import { DEFAULT_CATEGORY } from "@/src/constants"

type Props = {
  q: string
  posts: TPosts
}

const PostList: React.FC<Props> = ({ q, posts }) => {
  const router = useRouter()
  const [filteredPosts, setFilteredPosts] = useState(posts)

  const currentTag = `${router.query.tag || ``}` || undefined
  const currentCategory = `${router.query.category || ``}` || DEFAULT_CATEGORY
  const currentOrder = `${router.query.order || ``}` || "desc"

  useEffect(() => {
    setFilteredPosts(() => {
      let filteredPosts = posts
      // keyword
      filteredPosts = filteredPosts.filter((post) => {
        const tagContent = post.tags ? post.tags.join(" ") : ""
        const searchContent = post.title + post.summary + tagContent
        return searchContent.toLowerCase().includes(q.toLowerCase())
      })

      // tag
      if (currentTag) {
        filteredPosts = filteredPosts.filter(
          (post) => post && post.tags && post.tags.includes(currentTag)
        )
      }

      // category
      if (currentCategory !== DEFAULT_CATEGORY) {
        filteredPosts = filteredPosts.filter(
          (post) =>
            post && post.category && post.category.includes(currentCategory)
        )
      }
      // order
      if (currentOrder !== "desc") {
        filteredPosts = filteredPosts.reverse()
      }

      return filteredPosts
    })
  }, [q, currentTag, currentCategory, currentOrder, setFilteredPosts, posts])

  return (
    <>
      <div className="my-2">
        {!filteredPosts.length && (
          <div className="flex justify-center p-5 align-center">
            <p className="text-gray-500 dark:text-gray-300">검색 결과 없음(⊙_⊙;)</p>
          </div>
        )}
        {filteredPosts.map((post) => (
          <PostCard key={post.id} data={post} />
        ))}
      </div>
    </>
  )
}

export default PostList
