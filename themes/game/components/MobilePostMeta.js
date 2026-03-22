import SmartLink from '@/components/SmartLink'
import WordCount from '@/components/WordCount'

export default function MobilePostMeta({ post }) {
  return (
    <div className='xl:hidden mt-4 mb-2'>
      <div className='flex items-center justify-end gap-2 text-xs text-zinc-400 dark:text-zinc-500'>
        {post?.publishDay && (
          <span>{post.publishDay}</span>
        )}
        {post?.publishDay && (post?.wordCount || post?.readTime) && (
          <span className='text-zinc-300 dark:text-zinc-600'>·</span>
        )}
        {(post?.wordCount || post?.readTime) && (
          <WordCount wordCount={post.wordCount} readTime={post.readTime} />
        )}
      </div>

      <div className='flex flex-wrap items-center justify-end gap-1.5 mt-2'>
        {post?.category && (
          <SmartLink
            href={`/category/${post.category}`}
            className='px-2 py-0.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 rounded text-xs hover:bg-violet-100 dark:hover:bg-violet-500/20 hover:text-violet-500 transition-colors'>
            {post.category}
          </SmartLink>
        )}
        {post?.tags && post.tags.length > 0 && post.tags.slice(0, 4).map((tag, index) => (
          <SmartLink
            key={index}
            href={`/tag/${encodeURIComponent(tag)}`}
            className='px-2 py-0.5 text-zinc-400 dark:text-zinc-500 text-xs hover:text-violet-500 transition-colors'>
            #{tag}
          </SmartLink>
        ))}
      </div>
    </div>
  )
}
