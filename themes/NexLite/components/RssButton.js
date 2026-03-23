export default function RssButton({ className = '' }) {
  return (
    <a
      href='/rss/feed.xml'
      target='_blank'
      rel='noreferrer'
      onClick={(e) => e.stopPropagation()}
      className={`absolute -top-1 -right-1 w-6 h-6 rounded-full bg-gradient-to-r from-orange-400 to-orange-500 flex items-center justify-center shadow-md hover:shadow-lg hover:scale-110 transition-all duration-200 z-10 ${className}`}
      title='RSS 订阅'>
      <i className='fas fa-rss text-white text-[10px]'></i>
    </a>
  )
}
