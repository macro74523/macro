import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

const QrCode = dynamic(() => import('@/components/QrCode'), { ssr: false })

const ShareBar = ({ post }) => {
  if (!post || post?.type !== 'Post') {
    return <></>
  }

  const router = useRouter()
  const { locale } = useGlobal()
  const [shareUrl, setShareUrl] = useState(siteConfig('LINK') + router.asPath)
  const [qrCodeShow, setQrCodeShow] = useState(false)
  const title = post?.title || siteConfig('TITLE')
  const body = post?.title + ' | ' + title + ' ' + shareUrl + ' ' + post?.summary

  useEffect(() => {
    setShareUrl(window.location.href)
  }, [])

  const copyUrl = () => {
    const decodedUrl = decodeURIComponent(shareUrl)
    navigator?.clipboard?.writeText(decodedUrl)
    alert(locale.COMMON.URL_COPIED + ' \n' + decodedUrl)
  }

  const shareItems = [
    {
      name: 'wechat',
      icon: 'fab fa-weixin',
      bgColor: 'bg-green-500',
      hoverBg: 'hover:bg-green-600',
      action: () => {}
    },
    {
      name: 'weibo',
      icon: 'fab fa-weibo',
      bgColor: 'bg-red-500',
      hoverBg: 'hover:bg-red-600',
      action: () => {
        window.open(
          `https://service.weibo.com/share/share.php?url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(title)}`,
          '_blank'
        )
      }
    },
    {
      name: 'qq',
      icon: 'fab fa-qq',
      bgColor: 'bg-blue-500',
      hoverBg: 'hover:bg-blue-600',
      action: () => {
        window.open(
          `http://connect.qq.com/widget/shareqq/index.html?url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(title)}&desc=${encodeURIComponent(body)}`,
          '_blank'
        )
      }
    },
    {
      name: 'link',
      icon: 'fas fa-link',
      bgColor: 'bg-zinc-500',
      hoverBg: 'hover:bg-zinc-600',
      action: copyUrl
    }
  ]

  return (
    <div className='my-4'>
      <h4 className='text-xs font-medium text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-3 flex items-center gap-1.5'>
        <i className='fas fa-share-alt text-violet-500'></i>
        分享到
      </h4>
      <div className='flex items-center gap-2'>
        {shareItems.map(item => (
          <button
            key={item.name}
            onClick={item.action}
            onMouseEnter={() => item.name === 'wechat' && setQrCodeShow(true)}
            onMouseLeave={() => item.name === 'wechat' && setQrCodeShow(false)}
            className={`relative w-9 h-9 flex items-center justify-center rounded-full ${item.bgColor} ${item.hoverBg} text-white transition-all duration-200 hover:scale-110`}>
            <i className={`${item.icon} text-sm`}></i>
            {item.name === 'wechat' && qrCodeShow && (
              <div className='absolute bottom-12 left-1/2 -translate-x-1/2 bg-white dark:bg-zinc-800 rounded-lg shadow-xl p-2 z-50'>
                <div className='w-24 h-24'>
                  <QrCode value={shareUrl} />
                </div>
                <p className='text-xs text-zinc-600 dark:text-zinc-400 text-center mt-1'>微信扫码分享</p>
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  )
}

export default ShareBar
