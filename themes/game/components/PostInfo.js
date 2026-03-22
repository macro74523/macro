import NotionIcon from '@/components/NotionIcon'
import { siteConfig } from '@/lib/config'
import { useRouter } from 'next/router'
import { useWalinePageview } from '../hooks/useWalinePageview'

export default function PostInfo(props) {
  const { post } = props
  const router = useRouter()
  const serverURL = siteConfig('COMMENT_WALINE_SERVER_URL')
  const articlePath = post?.href

  useWalinePageview(articlePath)

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
          <div className='flex justify-end mb-4'>
            <div className='inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-zinc-100/80 dark:bg-zinc-800/80 text-sm text-zinc-500 dark:text-zinc-400'>
              <i className='far fa-eye text-xs'></i>
              <span className='waline-pageview-count font-medium' data-path={articlePath}>--</span>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
