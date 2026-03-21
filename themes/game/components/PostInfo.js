import NotionIcon from '@/components/NotionIcon'
import { siteConfig } from '@/lib/config'
import { useEffect } from 'react'

export default function PostInfo(props) {
  const { post } = props
  const serverURL = siteConfig('COMMENT_WALINE_SERVER_URL')
  const articlePath = post?.href

  useEffect(() => {
    if (!serverURL || !articlePath) return
    
    const initPageview = async () => {
      const { pageviewCount } = await import('@waline/client/pageview')
      pageviewCount({
        serverURL,
        path: articlePath,
        selector: '.waline-pageview-count',
        update: true
      })
    }
    
    initPageview()
  }, [serverURL, articlePath])

  return (
    <section className='flex-wrap flex m-0 sm:m-2 text-gray-600 dark:text-gray-400 font-light leading-8'>
      <div className='w-full'>
        <h1 className='font-bold text-3xl text-black dark:text-white mb-3'>
          {siteConfig('POST_TITLE_ICON') && <NotionIcon icon={post?.pageIcon} />}
          {post?.title}
        </h1>
        {serverURL && (
          <div className='flex items-center gap-4 text-sm text-zinc-500 dark:text-zinc-400 mb-4'>
            <span className='flex items-center gap-1.5'>
              <i className='far fa-eye text-xs'></i>
              <span className='waline-pageview-count' data-path={articlePath}>
                --
              </span>
              <span>次阅读</span>
            </span>
          </div>
        )}
      </div>
    </section>
  )
}
