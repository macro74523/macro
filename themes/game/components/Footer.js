import { siteConfig } from '@/lib/config'

export const Footer = props => {
  const d = new Date()
  const currentYear = d.getFullYear()
  const since = siteConfig('SINCE')
  const copyrightDate =
    parseInt(since) < currentYear ? since + '-' + currentYear : currentYear

  return (
    <footer className='pix-card p-5 text-center'>
      <div className='text-sm text-zinc-400 dark:text-zinc-500 space-y-1'>
        <p>
          © {copyrightDate} {siteConfig('TITLE')}
        </p>
        <p className='text-xs'>
          Powered by
          <a
            href='https://github.com/tangly1024/NotionNext'
            className='ml-1 hover:text-violet-500 dark:hover:text-violet-400 transition-colors'
            target='_blank'
            rel='noopener noreferrer'>
            NotionNext
          </a>
        </p>
      </div>
    </footer>
  )
}
