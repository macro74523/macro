import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import { ArticleList } from './ArticleList'
import PaginationSimple from './PaginationSimple'

export const BlogListPage = props => {
  const { page = 1, postCount } = props
  const { NOTION_CONFIG } = useGlobal()
  const POSTS_PER_PAGE = siteConfig('POSTS_PER_PAGE', null, NOTION_CONFIG)
  const totalPage = Math.ceil(postCount / POSTS_PER_PAGE)
  const showNext = page < totalPage

  return (
    <>
      <div id='posts-wrapper' className='select-none'>
        <ArticleList {...props} />
      </div>

      <PaginationSimple page={page} totalPage={totalPage} showNext={showNext} />
    </>
  )
}
