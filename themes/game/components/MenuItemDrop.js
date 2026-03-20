import Collapse from '@/components/Collapse'
import SmartLink from '@/components/SmartLink'
import { useRouter } from 'next/router'
import { useState } from 'react'

export const MenuItemDrop = ({ link }) => {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  
  if (!link) {
    return null
  }

  const hasSubMenu = link?.subMenus?.length > 0
  const isActive = router.asPath === link?.href || 
    (link?.href !== '/' && router.asPath.startsWith(link?.href))

  const toggleSubMenu = (e) => {
    if (hasSubMenu) {
      e.preventDefault()
      setIsOpen(!isOpen)
    }
  }

  return (
    <div>
      <div
        onClick={toggleSubMenu}
        className={`flex items-center gap-2.5 px-3 py-2.5 transition-all duration-200 text-sm group cursor-pointer ${
          isActive && !hasSubMenu
            ? 'bg-violet-50 dark:bg-violet-500/10 text-violet-600 dark:text-violet-400 font-medium'
            : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/50'
        }`}>
        <SmartLink
          href={hasSubMenu ? '#' : link?.href}
          target={link?.target}
          className='flex items-center gap-2.5 flex-1'
          onClick={(e) => hasSubMenu && e.preventDefault()}>
          <i className={`${link?.icon} w-4 text-center transition-colors duration-200 ${
            isActive && !hasSubMenu
              ? 'text-violet-500' 
              : 'text-zinc-300 dark:text-zinc-600 group-hover:text-violet-500'
          }`}></i>
          <span className='group-hover:text-zinc-800 dark:group-hover:text-zinc-100 transition-colors'>{link?.name}</span>
        </SmartLink>
        
        {hasSubMenu && (
          <i className={`fas fa-chevron-down text-xs text-zinc-300 dark:text-zinc-600 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}></i>
        )}
        
        {isActive && !hasSubMenu && (
          <span className='w-1.5 h-1.5 bg-violet-500'></span>
        )}
      </div>

      {hasSubMenu && (
        <Collapse isOpen={isOpen}>
          <div className='ml-4 pl-2 border-l border-zinc-100 dark:border-zinc-800 mt-1 space-y-0.5'>
            {link.subMenus.map((subLink, index) => (
              <SmartLink
                key={index}
                href={subLink.href}
                target={link?.target}
                className='flex items-center gap-2 px-3 py-2 text-zinc-500 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 hover:text-violet-500 dark:hover:text-violet-400 transition-all duration-200 text-xs'>
                <i className={`${subLink.icon || 'fas fa-link'} w-3 text-center`}></i>
                <span>{subLink.title}</span>
              </SmartLink>
            ))}
          </div>
        </Collapse>
      )}
    </div>
  )
}
