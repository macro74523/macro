import DarkModeButton from './DarkModeButton'
import PostToc from './PostToc'
import ReadingProgress from './ReadingProgress'
import WordCount from '@/components/WordCount'

export default function PostSidebar({ post }) {
  const toc = post?.toc || []
  const hasToc = toc.length > 0

  return (
    <aside className='w-[280px] hidden xl:block flex-shrink-0 border-l border-zinc-100 dark:border-zinc-800'>
      <div className='sticky top-8 p-5'>
        <div className='space-y-6'>
          <ReadingProgress />

          {hasToc && (
            <div className='pt-6 border-t border-zinc-100 dark:border-zinc-800'>
              <h4 className='text-xs font-medium text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-4 flex items-center gap-1.5'>
                <i className='fas fa-list text-violet-500'></i>
                目录
              </h4>
              <PostToc toc={toc} />
            </div>
          )}

          <div className='pt-6 border-t border-zinc-100 dark:border-zinc-800'>
            <h4 className='text-xs font-medium text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-4 flex items-center gap-1.5'>
              <i className='fas fa-info-circle text-violet-500'></i>
              文章信息
            </h4>
            <div className='space-y-3 text-sm text-zinc-600 dark:text-zinc-400'>
              {post?.publishDay && (
                <div className='flex items-center gap-2'>
                  <i className='far fa-calendar text-zinc-400 text-xs w-4'></i>
                  <span>{post.publishDay}</span>
                </div>
              )}
              {post?.category && (
                <div className='flex items-center gap-2'>
                  <i className='fas fa-folder text-zinc-400 text-xs w-4'></i>
                  <span>{post.category}</span>
                </div>
              )}
              {post?.tags && post.tags.length > 0 && (
                <div className='flex items-start gap-2'>
                  <i className='fas fa-tags text-zinc-400 text-xs w-4 mt-0.5'></i>
                  <div className='flex flex-wrap gap-1'>
                    {post.tags.slice(0, 5).map((tag, index) => (
                      <span key={index} className='pix-tag text-xs'>{tag}</span>
                    ))}
                  </div>
                </div>
              )}
              {(post?.wordCount || post?.readTime) && (
                <div className='flex items-start gap-2'>
                  <i className='fas fa-file-alt text-zinc-400 text-xs w-4 mt-0.5'></i>
                  <div className='text-xs'>
                    <WordCount wordCount={post.wordCount} readTime={post.readTime} />
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className='pt-6 border-t border-zinc-100 dark:border-zinc-800'>
            <div className='flex items-center justify-between'>
              <span className='text-xs text-zinc-400 dark:text-zinc-500 font-medium'>主题切换</span>
              <DarkModeButton />
            </div>
          </div>
        </div>
      </div>
    </aside>
  )
}
