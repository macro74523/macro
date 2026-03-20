import SmartLink from '@/components/SmartLink'

const TagItem = ({ tag }) => (
  <SmartLink href={`/tag/${encodeURIComponent(tag)}`}>
    <p className='cursor-pointer hover:bg-violet-50 dark:hover:bg-violet-500/10 mr-1 rounded-full px-2 py-1 border leading-none text-sm text-gray-700 border-gray-100 dark:text-gray-200 dark:border-gray-600 transition-colors'>
      {tag}
    </p>
  </SmartLink>
)

export default TagItem
