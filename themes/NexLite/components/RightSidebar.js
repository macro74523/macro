import { siteConfig } from '@/lib/config'
import SmartLink from '@/components/SmartLink'
import dynamic from 'next/dynamic'
import DarkModeButton from './DarkModeButton'
import { BusuanziStats } from './BusuanziCounter'
import PostCalendar from './PostCalendar'
import RandomPostButton from './RandomPostButton'
import DanmakuButton from './DanmakuButton'
import { useNexLiteGlobal } from '..'

const NotionPage = dynamic(() => import('@/components/NotionPage'))

export default function RightSidebar(props) {
  const { siteInfo, tagOptions, categoryOptions, postCount, notice, posts } = props
  const { scrollToComment } = useNexLiteGlobal()

  const tags = tagOptions?.slice(0, 8) || []

  return (
    <aside className='w-[280px] hidden xl:block flex-shrink-0 border-l border-zinc-100 dark:border-zinc-800'>
      <div className='sticky top-8 p-5 space-y-6'>
        <div className='flex items-center justify-end gap-2'>
          <DanmakuButton onClick={scrollToComment} />
          <RandomPostButton posts={posts} />
          <DarkModeButton />
        </div>
        <StatsCard {...props} />
        <PostCalendar posts={posts} />
        <TagCard tags={tags} />
        {notice?.blockMap && <AnnouncementCard notice={notice} />}
      </div>
    </aside>
  )
}

function StatsCard(props) {
  const { postCount, tagOptions, categoryOptions } = props
  const stats = [
    { label: '文章', value: postCount || 0 },
    { label: '分类', value: categoryOptions?.length || 0 },
    { label: '标签', value: tagOptions?.length || 0 },
  ]

  return (
    <div>
      <h4 className='text-xs font-medium text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-4'>
        站点统计
      </h4>
      <div className='grid grid-cols-3 gap-3 text-center mb-4'>
        {stats.map((stat, index) => (
          <div key={index} className='py-1'>
            <div className='text-lg font-bold pix-gradient-text'>{stat.value}</div>
            <div className='text-xs text-zinc-400 dark:text-zinc-500 mt-1'>{stat.label}</div>
          </div>
        ))}
      </div>
      <BusuanziStats />
    </div>
  )
}

function TagCard({ tags }) {
  if (!tags || tags.length === 0) return null

  return (
    <div className='pt-6 border-t border-zinc-100 dark:border-zinc-800'>
      <h4 className='text-xs font-medium text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-4'>
        热门标签
      </h4>
      <div className='flex flex-wrap gap-2'>
        {tags.map((tag, index) => (
          <SmartLink
            key={index}
            href={`/tag/${encodeURIComponent(tag.name)}`}
            className='pix-tag text-xs'>
            {tag.name}
          </SmartLink>
        ))}
      </div>
    </div>
  )
}

function AnnouncementCard({ notice }) {
  return (
    <div className='pt-6 border-t border-zinc-100 dark:border-zinc-800'>
      <h4 className='text-xs font-medium text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-4 flex items-center gap-2'>
        <i className='fas fa-bullhorn text-violet-500'></i>
        公告
      </h4>
      <div className='text-sm text-zinc-600 dark:text-zinc-400 prose dark:prose-invert max-w-none'>
        <NotionPage post={notice} />
      </div>
    </div>
  )
}
