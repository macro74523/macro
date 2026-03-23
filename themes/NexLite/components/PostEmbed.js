/* eslint-disable @next/next/no-img-element */
import { Draggable } from '@/components/Draggable'
import { siteConfig } from '@/lib/config'
import { deepClone } from '@/lib/utils'
import SmartLink from '@/components/SmartLink'
import { useEffect, useState } from 'react'
import DownloadButton from './DownloadButton'
import FullScreenButton from './FullScreenButton'

export default function PostEmbed({ post, siteInfo }) {
  const postItem = deepClone(post)
  const newWindow = postItem?.ext?.new_window || false
  const originUrl = postItem?.ext?.href

  const [tipNewWindow, setTipNewWindow] = useState(newWindow)
  const [loading, setLoading] = useState(true)

  const openInNewWindow = () => {
    setTipNewWindow(false)
    document.addEventListener('visibilitychange', handleVisibilityChange)

    function handleVisibilityChange() {
      if (document.visibilityState === 'hidden') {
      } else {
        setLoading(true)
        reloadIframe()
        document.removeEventListener('visibilitychange', handleVisibilityChange)
      }
    }
  }

  const hiddenTips = () => {
    setTipNewWindow(false)
  }

  function reloadIframe() {
    var iframe = document.getElementById('embed-wrapper')
    iframe.contentWindow.location.reload()
  }

  function iframeLoaded() {
    if (postItem) {
      setLoading(false)
    }
  }

  useEffect(() => {
    setTipNewWindow(newWindow)

    const iframe = document.getElementById('embed-wrapper')

    if (iframe?.attachEvent) {
      iframe?.attachEvent('onload', iframeLoaded)
    } else if (iframe) {
      iframe.onload = iframeLoaded
    }

    if (
      document
        ?.getElementById('embed-wrapper')
        ?.contentDocument.querySelector('title')?.textContent
    ) {
      document
        .getElementById('embed-wrapper')
        .contentDocument.querySelector('title').textContent = `${
        postItem?.title || ''
      } - View ${postItem?.title || ''} on ${siteConfig('TITLE')}`
    }
  }, [post])

  return (
    <div
      className={`${originUrl ? '' : 'hidden'} bg-black w-full xl:h-[calc(100vh-8rem)] h-screen rounded-none md:rounded-md relative`}>
      <Draggable stick='left'>
        <div
          style={{ left: '0px', top: '1rem' }}
          className='text-white fixed xl:hidden group space-x-1 flex items-center z-20 pr-3 pl-1 bg-[#202030] rounded-r-2xl  shadow-lg '>
          <SmartLink
            href='/'
            className='flex items-center gap-1 px-2 py-3 hover:scale-125 duration-200 transition-all'
            passHref>
            <i className='fas fa-chevron-left' />
            <span className='text-xs font-medium whitespace-nowrap'>主页</span>
          </SmartLink>{' '}
          <span
            className='font-serif px-1'
            onClick={() => {
              document.querySelector('.post-info').scrollIntoView({
                behavior: 'smooth',
                block: 'start',
                inline: 'nearest'
              })
            }}>
            <i className='fas fa-info' />
          </span>
        </div>
      </Draggable>

      {tipNewWindow && (
        <div
          id='open-tips'
          className={`animate__animated animate__fadeIn bottom-8 right-4  absolute z-20 flex items-end justify-end`}>
          <div className='relative w-96 h-auto bg-white rounded-lg p-2'>
            <div className='absolute right-2'>
              <button className='text-xl p-2' onClick={hiddenTips}>
                <i className='fas fa-times'></i>
              </button>
            </div>
            <div className='p-2 text-lg'>
              If the content fails to load, please try accessing the{' '}
              <a
                className='underline text-blue-500'
                rel='noReferrer'
                href={`${originUrl?.replace('/external/common/index.htm?n=', '')}`}
                target='_blank'
                onClick={openInNewWindow}>
                source webpage
              </a>
              .
            </div>
          </div>
        </div>
      )}

      {loading && (
        <div className='absolute z-20 w-full xl:h-[calc(100vh-8rem)] h-screen rounded-md overflow-hidden '>
          <div className='z-20 absolute bg-black bg-opacity-75 w-full h-full flex flex-col gap-4 justify-center items-center'>
            <h2 className='text-3xl text-white flex gap-2 items-center'>
              <i className='fas fa-spinner animate-spin'></i>
              {siteInfo?.title || siteConfig('TITLE')}
            </h2>
            <h3 className='text-xl text-white'>
              {siteInfo?.description || siteConfig('DESCRIPTION')}
            </h3>
          </div>

          {postItem?.pageCoverThumbnail && (
            <img
              src={postItem?.pageCoverThumbnail}
              className='w-full h-full object-cover blur-md absolute top-0 left-0 z-0'
            />
          )}
        </div>
      )}
      <iframe
        id='embed-wrapper'
        src={originUrl}
        className={`relative w-full xl:h-[calc(100vh-8rem)] h-screen md:rounded-md overflow-hidden`}
      />

      {originUrl && !loading && (
        <div className='embed-decorator bg-[#0B0D14] right-0 bottom-0 flex justify-center z-10 md:absolute'>
          <DownloadButton />
          <FullScreenButton />
        </div>
      )}
    </div>
  )
}
