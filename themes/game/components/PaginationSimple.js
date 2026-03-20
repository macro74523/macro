import { useGlobal } from '@/lib/global'
import SmartLink from '@/components/SmartLink'
import { useRouter } from 'next/router'

const PaginationSimple = ({ page, showNext }) => {
  const { locale } = useGlobal()
  const router = useRouter()
  const currentPage = +page
  const pagePrefix = router.asPath
    .split('?')[0]
    .replace(/\/page\/[1-9]\d*/, '')
    .replace(/\/$/, '')
    .replace('.html', '')

  return (
    <div className='my-4 flex justify-between gap-4'>
      <SmartLink
        href={{
          pathname:
            currentPage === 2
              ? `${pagePrefix}/`
              : `${pagePrefix}/page/${currentPage - 1}`,
          query: router.query.s ? { s: router.query.s } : {}
        }}
        passHref
        rel='prev'
        className={`${currentPage === 1 ? 'invisible pointer-events-none' : ''} pix-card px-4 py-2 text-sm text-gray-500 dark:text-gray-400 hover:text-purple-500 transition-colors`}>
        <i className='fas fa-chevron-left mr-1'></i>
        {locale.PAGINATION.PREV}
      </SmartLink>
      <SmartLink
        href={{
          pathname: `${pagePrefix}/page/${currentPage + 1}`,
          query: router.query.s ? { s: router.query.s } : {}
        }}
        passHref
        rel='next'
        className={`${showNext ? '' : 'invisible pointer-events-none'} pix-card px-4 py-2 text-sm text-gray-500 dark:text-gray-400 hover:text-purple-500 transition-colors`}>
        {locale.PAGINATION.NEXT}
        <i className='fas fa-chevron-right ml-1'></i>
      </SmartLink>
    </div>
  )
}

export default PaginationSimple
