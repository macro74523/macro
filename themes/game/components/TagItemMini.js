import SmartLink from '@/components/SmartLink'

const TagItemMini = ({ tag, selected = false }) => {
  return (
    <SmartLink
      key={tag}
      href={selected ? '/' : `/tag/${encodeURIComponent(tag.name)}`}
      className={`rounded px-1.5 py-0.5 text-xs font-medium border transition-colors duration-200 ${
        selected
          ? 'bg-violet-500 text-white border-violet-500 dark:bg-violet-500/90 dark:border-violet-400'
          : 'bg-gray-100 text-gray-700 border-transparent hover:bg-violet-500 hover:text-white dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-violet-500/20'
      }`}
      passHref>
      {/* # {tag.name} */}
      <span className='flex flex-nowrap cursor-pointer'>
        # <span>{tag.name}</span>{' '}
        <span className='h-full flex items-start text-xs ml-1'>
          {tag.count ? `${tag.count}` : ''}
        </span>
      </span>
    </SmartLink>
  )
}

export default TagItemMini
