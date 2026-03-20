/* eslint-disable @next/next/no-img-element */
import Comment from '@/components/Comment'
import { AdSlot } from '@/components/GoogleAdsense'
import replaceSearchResult from '@/components/Mark'
import NotionPage from '@/components/NotionPage'
import { PWA as initialPWA } from '@/components/PWA'
import ShareBar from '@/components/ShareBar'
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
import { GameListRelate } from './components/GameListRealate'
import { GameListRecent } from './components/GameListRecent'
import Header from './components/Header'
import { MenuList } from './components/MenuList'
import { ArticleLock } from './components/ArticleLock'
import PostInfo from './components/PostInfo'
import RightSidebar from './components/RightSidebar'
import SearchModal from './components/SearchModal'
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
          className='relative flex justify-center w-full mx-auto gap-0 px-6 pt-8 max-w-[1300px]'>
          <aside className='w-[180px] hidden lg:block flex-shrink-0'>
            <div className='sticky top-8'>
              <div className='pix-card p-4'>
                <MenuList {...props} />
              </div>
            </div>
          </aside>

          <main className='flex-1 min-w-0 min-h-screen px-5'>
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
      <div className='pix-card p-4 mb-4'>
        <div className='flex flex-wrap gap-2'>
          <SmartLink
            href='/'
            className={`pix-tag ${!currentCategory ? 'active' : ''}`}>
            全部
          </SmartLink>
          {categoryOptions?.slice(0, 5).map((category, index) => (
            <SmartLink
              key={index}
              href={`/category/${category.name}`}
              className={`pix-tag ${currentCategory === category.name ? 'active' : ''}`}>
              {category.name}
            </SmartLink>
          ))}
        </div>
      </div>
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
  const { post, siteInfo, allNavPages, recommendPosts, lock, validPassword } =
    props

  const relateGames = recommendPosts
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
          <div className='game-detail-wrapper w-full grow flex'>
            <div className={`w-full`}>
              <GameEmbed post={post} siteInfo={siteInfo} />

              <div className='game-info py-2 mt-14 md:mt-0'>
                <div className='w-full mb-4'>
                  <GameListRelate posts={relateGames} />
                </div>

                {post && (
                  <div className='pix-card p-4 mb-4'>
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
  const { categoryOptions } = props

  return (
    <>
      <div className='pix-card p-5'>
        <h2 className='text-lg font-bold mb-4 flex items-center'>
          <i className='fas fa-folder-open mr-2 pix-gradient-text'></i>
          分类目录
        </h2>
        <div className='flex flex-wrap gap-2'>
          {categoryOptions?.map(category => {
            return (
              <SmartLink
                key={category.name}
                href={`/category/${category.name}`}
                className='pix-tag'>
                {category.name}
                <span className='ml-1 text-xs opacity-60'>({category.count})</span>
              </SmartLink>
            )
          })}
        </div>
      </div>
    </>
  )
}

const LayoutTagIndex = props => {
  const { tagOptions } = props
  return (
    <>
      <div className='pix-card p-5'>
        <h2 className='text-lg font-bold mb-4 flex items-center'>
          <i className='fas fa-tags mr-2 pix-gradient-text'></i>
          标签云
        </h2>
        <div className='flex flex-wrap gap-2'>
          {tagOptions.map(tag => {
            return (
              <SmartLink
                key={tag.name}
                href={`/tag/${encodeURIComponent(tag.name)}`}
                className='pix-tag'>
                <i className='fas fa-hashtag mr-1 text-xs opacity-60'></i>
                {tag.name}
                {tag.count && (
                  <span className='ml-1 text-xs opacity-60'>({tag.count})</span>
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
