import { useRouter } from 'next/router'
import { useEffect } from 'react'

const SideBarDrawer = ({ children, isOpen, onOpen, onClose, className }) => {
  const router = useRouter()
  
  useEffect(() => {
    const sideBarDrawerRouteListener = () => {
      switchSideDrawerVisible(false)
    }
    router.events.on('routeChangeComplete', sideBarDrawerRouteListener)
    return () => {
      router.events.off('routeChangeComplete', sideBarDrawerRouteListener)
    }
  }, [router.events])

  const switchSideDrawerVisible = showStatus => {
    if (showStatus) {
      onOpen && onOpen()
    } else {
      onClose && onClose()
    }
    const sideBarDrawer = window.document.getElementById('sidebar-drawer')
    const sideBarDrawerBackground = window.document.getElementById(
      'sidebar-drawer-background'
    )

    if (showStatus) {
      sideBarDrawer?.classList.replace('translate-x-full', 'translate-x-0')
      sideBarDrawerBackground?.classList.replace('hidden', 'block')
    } else {
      sideBarDrawer?.classList.replace('translate-x-0', 'translate-x-full')
      sideBarDrawerBackground?.classList.replace('block', 'hidden')
    }
  }

  return (
    <div id='sidebar-wrapper' className={`top-0 ${className}`}>
      <div
        id='sidebar-drawer'
        className={`${isOpen ? 'translate-x-0 visible opacity-100' : 'translate-x-full invisible opacity-0'} w-full max-w-md bg-white dark:bg-gray-900 shadow-2xl flex flex-col duration-300 fixed h-full right-0 overflow-y-auto top-0 z-50`}>
        {children}
      </div>

      <div
        id='sidebar-drawer-background'
        onClick={() => {
          switchSideDrawerVisible(false)
        }}
        className={`${isOpen ? 'visible opacity-100' : 'invisible opacity-0 '} fixed top-0 duration-300 left-0 z-40 w-full h-full bg-black/50 backdrop-blur-sm`}
      />
    </div>
  )
}
export default SideBarDrawer
