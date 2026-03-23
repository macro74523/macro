import { useGlobal } from '@/lib/global'

export default function BlogPostBar(props) {
  const { tag, category } = props
  const { locale } = useGlobal()

  if (tag) {
    return (
      <div className='pix-card p-4 mb-4'>
        <div className='flex items-center gap-2'>
          <i className='fas fa-tag text-purple-500'></i>
          <span className='text-sm text-gray-500 dark:text-gray-400'>{locale.COMMON.TAGS}:</span>
          <span className='text-sm font-medium text-gray-800 dark:text-white'>{tag}</span>
        </div>
      </div>
    )
  } else if (category) {
    return (
      <div className='pix-card p-4 mb-4'>
        <div className='flex items-center gap-2'>
          <i className='fas fa-folder text-purple-500'></i>
          <span className='text-sm text-gray-500 dark:text-gray-400'>{locale.COMMON.CATEGORY}:</span>
          <span className='text-sm font-medium text-gray-800 dark:text-white'>{category}</span>
        </div>
      </div>
    )
  } else {
    return <></>
  }
}
