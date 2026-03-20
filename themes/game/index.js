/* eslint-disable @next/next/no-img-element */
import Comment from '@/components/Comment'
import { AdSlot } from '@/components/GoogleAdsense'
import replaceSearchResult from '@/components/Mark'
import NotionPage from '@/components/NotionPage'
import { PWA as initialPWA } from '@/components/PWA'
import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import { loadWowJS } from '@/lib/plugins/wow'
import { deepClone, isBrowser, shuffleArray } from '@/lib/utils'
import SmartLink from '@/components/SmartLink'
import { useRouter } from 'next/router'
import { createContext, useContext, useEffect, useRef, useState } from 'react'
import BlogArchiveItem from './components/BlogArchiveItem'
import { BlogListPage } from './components/BlogListPage'
import { BlogListScroll } from './components/BlogListScroll'
import BlogPostBar from './components/BlogPostBar'
import { Footer } from './components/Footer'
import GameEmbed from './components/GameEmbed'
import { GameListIndexCombine } from './components/GameListIndexCombine'
import { GameListRecent } from './components/GameListRecent'
import Header from './components/Header'
import { MenuList } from './components/MenuList'
import { ArticleLock } from './components/ArticleLock'
import PostInfo from './components/PostInfo'
import ShareBar from './components/ShareBar'
import RightSidebar from './components/RightSidebar'
import SearchModal from './components/SearchModal'
import CategoryTabs from './components/CategoryTabs'
import BackToTop from './components/BackToTop'
import CONFIG from './config'
import { Style } from './style'

const ThemeGlobalGame = createContext()
export const useGameGlobal = () => useContext(ThemeGlobalGame)

const LayoutBase = props => {
  const {
    allNavPages,
    children,
    siteInfo,
    tagOptions,
    currentTag,
    categoryOptions,
    currentCategory,
    postCount,
    notice
  } = props
  const searchModal = useRef(null)
  const [filterKey, setFilterKey] = useState('')

  const [filterGames, setFilterGames] = useState(
    deepClone(
      allNavPages?.filter(item =>
        item.tags?.some(
          t => t === siteConfig('GAME_RECOMMEND_TAG', 'Recommend', CONFIG)
        )
      )
    )
  )
  const [recentGames, setRecentGames] = useState([])
  const [sideBarVisible, setSideBarVisible] = useState(false)

  useEffect(() => {
    loadWowJS()
  }, [])

  return (
    <ThemeGlobalGame.Provider
      value={{
        searchModal,
        filterKey,
        setFilterKey,
        recentGames,
        setRecentGames,
        filterGames,
        setFilterGames,
        sideBarVisible,
        setSideBarVisible
      }}>
      <div
        id='theme-game'
        className={`${siteConfig('FONT_STYLE')} w-full h-full min-h-screen scroll-smooth`}>
        <Style />

        <div
          id='wrapper'
          className='relative flex justify-center w-full mx-auto gap-0 max-w-[1300px] pt-6 px-4'>
          <div className='bg-white dark:bg-zinc-900 rounded-xl shadow-sm flex w-full overflow-hidden'>
            <aside className='w-[180px] hidden lg:block flex-shrink-0 border-r border-zinc-100 dark:border-zinc-800'>
              <div className='sticky top-8 p-4'>
                <MenuList {...props} />
              </div>
            </aside>

            <main className='flex-1 min-w-0 min-h-screen px-5 py-6'>
              {children}
              <div className='py-4'>
                <AdSlot type='in-article' />
              </div>
              <Footer />
            </main>

            <RightSidebar
              siteInfo={siteInfo}
              tagOptions={tagOptions}
              categoryOptions={categoryOptions}
              postCount={postCount}
              notice={notice}
            />
          </div>
        </div>

        <SearchModal siteInfo={siteInfo} {...props} />
      </div>
    </ThemeGlobalGame.Provider>
  )
}

const LayoutIndex = props => {
  const { siteInfo } = props
  return (
    <>
      <div className='lg:hidden mb-4'>
        <Header siteInfo={siteInfo} />
      </div>
      <GameListRecent />
      <LayoutPostList {...props} />
    </>
  )
}

const LayoutPostList = props => {
  const { posts, categoryOptions, currentCategory } = props
  const { filterKey } = useGameGlobal()
  let filteredBlogPosts = []
  if (filterKey && posts) {
    filteredBlogPosts = posts.filter(post => {
      const tagContent = post?.tags ? post?.tags.join(' ') : ''
      const searchContent = post.title + post.summary + tagContent
      return searchContent.toLowerCase().includes(filterKey.toLowerCase())
    })
  } else {
    filteredBlogPosts = deepClone(posts)
  }

  return (
    <>
      <CategoryTabs categories={categoryOptions} currentCategory={currentCategory} />
      <BlogPostBar {...props} />
      {siteConfig('POST_LIST_STYLE') === 'page' ? (
        <BlogListPage posts={filteredBlogPosts} {...props} />
      ) : (
        <BlogListScroll posts={filteredBlogPosts} {...props} />
      )}
    </>
  )
}

const LayoutSearch = props => {
  const { keyword, posts } = props
  useEffect(() => {
    if (isBrowser) {
      replaceSearchResult({
        doms: document.getElementById('posts-wrapper'),
        search: keyword,
        target: {
          element: 'span',
          className: 'text-red-500 border-b border-dashed'
        }
      })
    }
  }, [])

  const { filterKey } = useGameGlobal()
  let filteredBlogPosts = []
  if (filterKey && posts) {
    filteredBlogPosts = posts.filter(post => {
      const tagContent = post?.tags ? post?.tags.join(' ') : ''
      const searchContent = post.title + post.summary + tagContent
      return searchContent.toLowerCase().includes(filterKey.toLowerCase())
    })
  } else {
    filteredBlogPosts = deepClone(posts)
  }

  return (
    <>
      {siteConfig('POST_LIST_STYLE') === 'page' ? (
        <BlogListPage {...props} posts={filteredBlogPosts} />
      ) : (
        <BlogListScroll {...props} posts={filteredBlogPosts} />
      )}
    </>
  )
}

const LayoutArchive = props => {
  const { archivePosts } = props
  return (
    <>
      <div className='pix-card p-4 min-h-screen'>
        {Object.keys(archivePosts).map(archiveTitle => (
          <BlogArchiveItem
            key={archiveTitle}
            archiveTitle={archiveTitle}
            archivePosts={archivePosts}
          />
        ))}
      </div>
    </>
  )
}

const LayoutSlug = props => {
  const { setRecentGames } = useGameGlobal()
  const { post, siteInfo, allNavPages, lock, validPassword } = props

  const randomGames = shuffleArray(deepClone(allNavPages))

  initialPWA(post, siteInfo)

  useEffect(() => {
    const recentGames = localStorage.getItem('recent_games')
      ? JSON.parse(localStorage.getItem('recent_games'))
      : []

    const existedIndex = recentGames.findIndex(item => item?.id === post?.id)
    if (existedIndex === -1) {
      recentGames.unshift(post)
    } else {
      const existingGame = recentGames.splice(existedIndex, 1)[0]
      recentGames.unshift(existingGame)
    }
    localStorage.setItem('recent_games', JSON.stringify(recentGames))

    setRecentGames(recentGames)
  }, [post])

  return (
    <>
      {lock && <ArticleLock validPassword={validPassword} />}

      {!lock && post && (
        <div id='article-wrapper'>
          <div className='lg:hidden mb-4'>
            <Header siteInfo={siteInfo} />
          </div>
          <div className='game-detail-wrapper w-full grow flex'>
            <div className={`w-full`}>
              <GameEmbed post={post} siteInfo={siteInfo} />

              <div className='game-info py-2 mt-14 md:mt-0'>
                {post && (
                  <div className='mb-4'>
                    <PostInfo post={post} />
                    <NotionPage post={post} />
                    <AdSlot />
                    <ShareBar post={post} />
                    <Comment frontMatter={post} />
                  </div>
                )}
              </div>
            </div>
          </div>

          <GameListIndexCombine posts={randomGames} />
        </div>
      )}
      <BackToTop />
    </>
  )
}

const Layout404 = props => {
  const router = useRouter()
  const { locale } = useGlobal()
  useEffect(() => {
    setTimeout(() => {
      const article = isBrowser && document.getElementById('article-wrapper')
      if (!article) {
        router.push('/').then(() => {
        })
      }
    }, 3000)
  }, [])

  return (
    <>
      <div className='text-black w-full h-screen text-center justify-center content-center items-center flex flex-col'>
        <div className='dark:text-gray-200'>
          <h2 className='inline-block border-r-2 border-gray-600 mr-2 px-3 py-2 align-top'>
            <i className='mr-2 fas fa-spinner animate-spin' />
            404
          </h2>
          <div className='inline-block text-left h-32 leading-10 items-center'>
            <h2 className='m-0 p-0'>{locale.NAV.PAGE_NOT_FOUND_REDIRECT}</h2>
          </div>
        </div>
      </div>
    </>
  )
}

const LayoutCategoryIndex = props => {
  const { categoryOptions, siteInfo } = props

  const categoryIcons = [
    'fas fa-folder',
    'fas fa-book',
    'fas fa-code',
    'fas fa-palette',
    'fas fa-music',
    'fas fa-camera',
    'fas fa-gamepad',
    'fas fa-film',
    'fas fa-newspaper',
    'fas fa-lightbulb'
  ]

  return (
    <>
      <div className='mb-6'>
        <h1 className='text-2xl font-bold text-zinc-800 dark:text-zinc-100 mb-2'>
          分类目录
        </h1>
        <p className='text-sm text-zinc-500 dark:text-zinc-400'>
          共 {categoryOptions?.length || 0} 个分类
        </p>
      </div>
      
      <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3'>
        {categoryOptions?.map((category, index) => {
          const icon = categoryIcons[index % categoryIcons.length]
          const colors = [
            'from-violet-500 to-purple-500',
            'from-blue-500 to-cyan-500',
            'from-emerald-500 to-teal-500',
            'from-orange-500 to-amber-500',
            'from-pink-500 to-rose-500',
            'from-indigo-500 to-blue-500',
            'from-red-500 to-orange-500',
            'from-cyan-500 to-blue-500',
            'from-teal-500 to-green-500',
            'from-purple-500 to-pink-500'
          ]
          const color = colors[index % colors.length]
          
          return (
            <SmartLink
              key={category.name}
              href={`/category/${category.name}`}
              className='group bg-white dark:bg-zinc-900 rounded-lg p-4 hover:shadow-md transition-all duration-300 border border-zinc-100 dark:border-zinc-800 hover:border-zinc-200 dark:hover:border-zinc-700'>
              <div className='flex items-start gap-3'>
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${color} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                  <i className={`${icon} text-white text-sm`}></i>
                </div>
                <div className='flex-1 min-w-0'>
                  <h3 className='text-sm font-medium text-zinc-800 dark:text-zinc-100 truncate group-hover:text-violet-500 dark:group-hover:text-violet-400 transition-colors'>
                    {category.name}
                  </h3>
                  <p className='text-xs text-zinc-400 dark:text-zinc-500 mt-1'>
                    {category.count} 篇文章
                  </p>
                </div>
              </div>
            </SmartLink>
          )
        })}
      </div>
    </>
  )
}

const LayoutTagIndex = props => {
  const { tagOptions } = props
  
  const tagColors = [
    'bg-violet-100 dark:bg-violet-500/20 text-violet-600 dark:text-violet-400',
    'bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400',
    'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400',
    'bg-orange-100 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400',
    'bg-pink-100 dark:bg-pink-500/20 text-pink-600 dark:text-pink-400',
    'bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400',
    'bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400',
    'bg-cyan-100 dark:bg-cyan-500/20 text-cyan-600 dark:text-cyan-400',
    'bg-teal-100 dark:bg-teal-500/20 text-teal-600 dark:text-teal-400',
    'bg-purple-100 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400'
  ]

  return (
    <>
      <div className='mb-6'>
        <h1 className='text-2xl font-bold text-zinc-800 dark:text-zinc-100 mb-2'>
          标签云
        </h1>
        <p className='text-sm text-zinc-500 dark:text-zinc-400'>
          共 {tagOptions?.length || 0} 个标签
        </p>
      </div>
      
      <div className='bg-white dark:bg-zinc-900 rounded-lg p-5 border border-zinc-100 dark:border-zinc-800'>
        <div className='flex flex-wrap gap-2'>
          {tagOptions?.map((tag, index) => {
            const colorClass = tagColors[index % tagColors.length]
            return (
              <SmartLink
                key={tag.name}
                href={`/tag/${encodeURIComponent(tag.name)}`}
                className={`group px-4 py-2 rounded-lg text-sm transition-all duration-300 hover:shadow-md ${colorClass}`}>
                <i className='fas fa-hashtag mr-1 text-xs opacity-60'></i>
                {tag.name}
                {tag.count && (
                  <span className='ml-1.5 text-xs opacity-70'>·{tag.count}</span>
                )}
              </SmartLink>
            )
          })}
        </div>
      </div>
    </>
  )
}

export {
  Layout404,
  LayoutArchive,
  LayoutBase,
  LayoutCategoryIndex,
  LayoutIndex,
  LayoutPostList,
  LayoutSearch,
  LayoutSlug,
  LayoutTagIndex,
  CONFIG as THEME_CONFIG
}
