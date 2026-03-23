/* eslint-disable @next/next/no-img-element */

export default function FullScreenButton() {
  function toggleFullScreen() {
    document?.querySelector('#embed-wrapper')?.scrollIntoView({
      behavior: 'smooth',
      block: 'end',
      inline: 'nearest'
    })
    document?.getElementById('embed-wrapper')?.contentWindow?.toggleFullScreen &&
      document?.getElementById('embed-wrapper')?.contentWindow?.toggleFullScreen()
  }

  return (
    <div
      className='group text-white w-full justify-center items-center flex rounded-lg m-2 md:m-0 p-2 hover:bg-gray-700 bg-[#1F2030] md:rounded-none md:bg-none'
      onClick={toggleFullScreen}>
      <i
        alt='full screen'
        title='full screen'
        className='cursor-pointer fas fa-expand group-hover:scale-125 transition-all duration-150 '
      />
      <span className='h-full flex mx-2 md:hidden items-center select-none'>FullScreen</span>
    </div>
  )
}
