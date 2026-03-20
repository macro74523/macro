import { useGameGlobal } from '..'
import Tags from './Tags'

export default function BlogListBar(props) {
  const { tag, setFilterKey } = useGameGlobal()
  const handleSearchChange = val => {
    setFilterKey(val)
  }
  if (tag) {
    return (
      <div className='mb-4'>
        <div className='relative'>
          <input
            type='text'
            placeholder={tag ? `Search in #${tag}` : 'Search Articles'}
            className='outline-none block w-full border px-4 py-2 border-black bg-white text-black dark:bg-zinc-900 dark:border-zinc-700 dark:text-zinc-100 focus:border-violet-500 dark:focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-colors'
            onChange={e => handleSearchChange(e.target.value)}
          />
          <svg
            className='absolute right-3 top-3 h-5 w-5 text-black dark:text-white'
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
            stroke='currentColor'>
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth='2'
              d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'></path>
          </svg>
        </div>
        <Tags {...props} />
      </div>
    )
  } else {
    return <></>
  }
}
