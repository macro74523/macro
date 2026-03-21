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
        className={`flex items-center gap-3 px-3 py-2.5 transition-all duration-200 text-sm group cursor-pointer rounded-lg ${
          isActive && !hasSubMenu
            ? 'bg-violet-50 dark:bg-violet-500/10 text-violet-600 dark:text-violet-400 font-medium'
            : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/50'
        }`}>
        <SmartLink
          href={hasSubMenu ? '#' : link?.href}
          target={link?.target}
          className='flex items-center gap-3 flex-1'
          onClick={(e) => hasSubMenu && e.preventDefault()}>
          <span className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors duration-200 ${
            isActive && !hasSubMenu
              ? 'bg-violet-100 dark:bg-violet-500/20' 
              : 'bg-zinc-100 dark:bg-zinc-800 group-hover:bg-violet-100 dark:group-hover:bg-violet-500/20'
          }`}>
            <i className={`${link?.icon} text-xs transition-colors duration-200 ${
              isActive && !hasSubMenu
                ? 'text-violet-500' 
                : 'text-zinc-400 dark:text-zinc-500 group-hover:text-violet-500'
            }`}></i>
          </span>
          <span className='group-hover:text-zinc-800 dark:group-hover:text-zinc-100 transition-colors'>{link?.name}</span>
        </SmartLink>
        
        {hasSubMenu && (
          <span className={`w-5 h-5 rounded bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
            <i className='fas fa-chevron-down text-[8px] text-zinc-400 dark:text-zinc-500'></i>
          </span>
        )}
      </div>

      {hasSubMenu && (
        <Collapse isOpen={isOpen}>
          <div className='ml-5 pl-4 border-l-2 border-zinc-100 dark:border-zinc-800 mt-1 mb-1 space-y-0.5'>
            {link.subMenus.map((subLink, index) => (
              <SmartLink
                key={index}
                href={subLink.href}
                target={link?.target}
                className='flex items-center gap-2 px-3 py-2 text-zinc-500 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 hover:text-violet-500 dark:hover:text-violet-400 transition-all duration-200 text-xs rounded-lg'>
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
