import NotionIcon from '@/components/NotionIcon'
import { siteConfig } from '@/lib/config'
import { useEffect } from 'react'
import { useRouter } from 'next/router'

export default function PostInfo(props) {
  const { post } = props
  const router = useRouter()
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

  const handleBack = () => {
    if (window.history.length > 1) {
      router.back()
    } else {
      router.push('/')
    }
  }

  return (
    <section className='flex-wrap flex m-0 sm:m-2 text-gray-600 dark:text-gray-400 font-light leading-8'>
      <div className='w-full'>
        <button
          onClick={handleBack}
          className='flex items-center gap-2 mb-4 text-sm text-zinc-500 dark:text-zinc-400 hover:text-violet-500 dark:hover:text-violet-400 transition-colors'>
          <span className='w-8 h-8 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center'>
            <i className='fas fa-arrow-left text-xs'></i>
          </span>
          <span>返回</span>
        </button>

        <h1 className='font-bold text-3xl text-zinc-800 dark:text-zinc-100 mb-4 leading-tight'>
          {siteConfig('POST_TITLE_ICON') && <NotionIcon icon={post?.pageIcon} />}
          {post?.title}
        </h1>
        {serverURL && (
          <div className='flex items-center gap-4 text-sm text-zinc-500 dark:text-zinc-400 mb-4'>
            <span className='flex items-center gap-2'>
              <span className='w-5 h-5 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center'>
                <i className='far fa-eye text-[10px] text-zinc-400'></i>
              </span>
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
