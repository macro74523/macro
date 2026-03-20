import NotionIcon from '@/components/NotionIcon'
import { siteConfig } from '@/lib/config'

export default function PostInfo(props) {
  const { post } = props

  return (
    <section className='flex-wrap flex m-0 sm:m-2 text-gray-600 dark:text-gray-400 font-light leading-8'>
      <div className='w-full'>
        <h1 className='font-bold text-3xl text-black dark:text-white mb-3'>
          {siteConfig('POST_TITLE_ICON') && <NotionIcon icon={post?.pageIcon} />}
          {post?.title}
        </h1>
      </div>
    </section>
  )
}
