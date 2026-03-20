import { siteConfig } from '@/lib/config'
import SmartLink from '@/components/SmartLink'
import dynamic from 'next/dynamic'

const NotionPage = dynamic(() => import('@/components/NotionPage'))

export default function RightSidebar(props) {
  const { siteInfo, tagOptions, categoryOptions, postCount, notice } = props

  const tags = tagOptions?.slice(0, 8) || []
  const categories = categoryOptions?.slice(0, 5) || []

  return (
    <aside className='w-[280px] hidden xl:block flex-shrink-0'>
      <div className='sticky top-8 space-y-0'>
        <AboutCard siteInfo={siteInfo} />
        <StatsCard {...props} />
        <CategoryCard categories={categories} />
        <TagCard tags={tags} />
        {notice?.blockMap && <AnnouncementCard notice={notice} />}
      </div>
    </aside>
  )
}

function AboutCard({ siteInfo }) {
  return (
    <div className='pix-card p-5'>
      <h4 className='text-sm font-medium text-zinc-800 dark:text-zinc-100 mb-4'>
        About Me
      </h4>
      <div className='flex items-center gap-3'>
        <div className='w-14 h-14 rounded-full overflow-hidden bg-zinc-100 dark:bg-zinc-800 flex-shrink-0 ring-2 ring-zinc-100 dark:ring-zinc-800'>
          {siteInfo?.icon ? (
            <img src={siteInfo.icon} alt='avatar' className='w-full h-full object-cover' />
          ) : (
            <div className='w-full h-full pix-gradient-bg flex items-center justify-center'>
              <i className='fas fa-user text-white text-lg'></i>
            </div>
          )}
        </div>
        <div className='flex-1 min-w-0'>
          <h5 className='text-sm font-medium text-zinc-800 dark:text-zinc-100 truncate'>
            {siteInfo?.title || '博主'}
          </h5>
          <p className='text-xs text-zinc-400 dark:text-zinc-500 flex items-center gap-1.5 mt-1'>
            <i className='fas fa-map-marker-alt text-[10px]'></i>
            {siteConfig('LOCATION') || '中国'}
          </p>
        </div>
      </div>
      <div className='flex gap-2 mt-4 pt-4 border-t border-zinc-100 dark:border-zinc-800'>
        <a href='#' className='flex-1 text-center py-2 bg-zinc-50 dark:bg-zinc-800/50 text-zinc-400 dark:text-zinc-500 text-xs hover:text-violet-500 dark:hover:text-violet-400 transition-colors'>
          <i className='fab fa-github'></i>
        </a>
        <a href='#' className='flex-1 text-center py-2 bg-zinc-50 dark:bg-zinc-800/50 text-zinc-400 dark:text-zinc-500 text-xs hover:text-violet-500 dark:hover:text-violet-400 transition-colors'>
          <i className='fab fa-twitter'></i>
        </a>
        <a href='#' className='flex-1 text-center py-2 bg-zinc-50 dark:bg-zinc-800/50 text-zinc-400 dark:text-zinc-500 text-xs hover:text-violet-500 dark:hover:text-violet-400 transition-colors'>
          <i className='fab fa-weibo'></i>
        </a>
        <a href='#' className='flex-1 text-center py-2 bg-zinc-50 dark:bg-zinc-800/50 text-zinc-400 dark:text-zinc-500 text-xs hover:text-violet-500 dark:hover:text-violet-400 transition-colors'>
          <i className='fas fa-envelope'></i>
        </a>
      </div>
    </div>
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
    <div className='pix-card p-5'>
      <h4 className='text-sm font-medium text-zinc-800 dark:text-zinc-100 mb-4'>
        站点统计
      </h4>
      <div className='grid grid-cols-3 gap-3 text-center'>
        {stats.map((stat, index) => (
          <div key={index} className='py-1'>
            <div className='text-xl font-bold pix-gradient-text'>{stat.value}</div>
            <div className='text-xs text-zinc-400 dark:text-zinc-500 mt-1'>{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

function CategoryCard({ categories }) {
  if (!categories || categories.length === 0) return null

  return (
    <div className='pix-card p-5'>
      <h4 className='text-sm font-medium text-zinc-800 dark:text-zinc-100 mb-4'>
        分类目录
      </h4>
      <div className='space-y-0.5'>
        {categories.map((category, index) => (
          <SmartLink
            key={index}
            href={`/category/${category.name}`}
            className='flex items-center justify-between py-2 px-2 -mx-2 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors group'>
            <span className='text-sm text-zinc-600 dark:text-zinc-400 group-hover:text-violet-500 dark:group-hover:text-violet-400 transition-colors'>
              {category.name}
            </span>
            <span className='text-xs text-zinc-300 dark:text-zinc-600 bg-zinc-50 dark:bg-zinc-800 px-2 py-0.5'>
              {category.count}
            </span>
          </SmartLink>
        ))}
      </div>
    </div>
  )
}

function TagCard({ tags }) {
  if (!tags || tags.length === 0) return null

  return (
    <div className='pix-card p-5'>
      <h4 className='text-sm font-medium text-zinc-800 dark:text-zinc-100 mb-4'>
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
    <div className='pix-card p-5'>
      <h4 className='text-sm font-medium text-zinc-800 dark:text-zinc-100 mb-4 flex items-center gap-2'>
        <i className='fas fa-bullhorn text-amber-400'></i>
        公告
      </h4>
      <div className='text-sm text-zinc-600 dark:text-zinc-400 prose dark:prose-invert max-w-none'>
        <NotionPage post={notice} />
      </div>
    </div>
  )
}
