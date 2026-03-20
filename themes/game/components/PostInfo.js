import NotionIcon from '@/components/NotionIcon'
import SmartLink from '@/components/SmartLink'
import TagItem from './TagItem'
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

        {post?.type !== 'Page' && (
          <div className='flex flex-wrap items-center gap-3 text-sm text-zinc-500 dark:text-zinc-400 mt-4 pt-4 border-t border-zinc-100 dark:border-zinc-800'>
            {post?.category && (
              <div className='flex items-center gap-1.5'>
                <i className='fas fa-folder text-violet-500 text-xs'></i>
                <SmartLink
                  href={`/category/${post?.category}`}
                  className='hover:text-violet-500 dark:hover:text-violet-400 transition-colors'>
                  {post?.category}
                </SmartLink>
              </div>
            )}
            
            {post?.tags && post.tags.length > 0 && (
              <div className='flex items-center gap-1.5'>
                <i className='fas fa-tags text-violet-500 text-xs'></i>
                <div className='flex flex-wrap gap-1'>
                  {post?.tags.map(tag => (
                    <TagItem key={tag} tag={tag} />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  )
}
