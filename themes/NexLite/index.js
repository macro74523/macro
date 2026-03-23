/* eslint-disable @next/next/no-img-element */
import { AdSlot } from '@/components/GoogleAdsense'
import replaceSearchResult from '@/components/Mark'
import { PWA as initialPWA } from '@/components/PWA'
import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import { loadWowJS } from '@/lib/plugins/wow'
import { deepClone, isBrowser, shuffleArray } from '@/lib/utils'
import SmartLink from '@/components/SmartLink'
import NotionIcon from '@/components/NotionIcon'
import { useRouter } from 'next/router'
import dynamic from 'next/dynamic'
import { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react'
import BlogArchiveItem from './components/BlogArchiveItem'
import { BlogListPage } from './components/BlogListPage'
import { BlogListScroll } from './components/BlogListScroll'
import BlogPostBar from './components/BlogPostBar'
import { Footer } from './components/Footer'
import { PostListRecent } from './components/PostListRecent'
import Header from './components/Header'
import { MenuList } from './components/MenuList'
import { ArticleLock } from './components/ArticleLock'
import RightSidebar from './components/RightSidebar'
import PostSidebar from './components/PostSidebar'
import CategoryTabs from './components/CategoryTabs'
import BackToTop from './components/BackToTop'
import CONFIG from './config'
import { Style } from './style'
import { useWalinePageview } from './hooks/useWalinePageview'

const Comment = dynamic(() => import('@/components/Comment'), { ssr: false })
const NotionPage = dynamic(() => import('@/components/NotionPage'))
const PostEmbed = dynamic(() => import('./components/PostEmbed'))
const PostListIndexCombine = dynamic(() => import('./components/PostListIndexCombine').then(mod => ({ default: mod.PostListIndexCombine })))
const SearchModal = dynamic(() => import('./components/SearchModal'), { ssr: false })
const PostReaction = dynamic(() => import('./components/PostReaction'), { ssr: false })
const MobilePostDetail = dynamic(() => import('./components/MobilePostDetail'), { ssr: false })
const PostInfo = dynamic(() => import('./components/PostInfo'), { ssr: false })
const MobilePostFooter = dynamic(() => import('./components/MobilePostFooter'), { ssr: false })

const filterPostsByKeyword = (posts, filterKey) => {
  if (!filterKey || !posts) {
    return posts || []
  }
  return posts.filter(post => {
    const tagContent = post?.tags ? post?.tags.join(' ') : ''
    const searchContent = post.title + post.summary + tagContent
    return searchContent.toLowerCase().includes(filterKey.toLowerCase())
  })
}

const ThemeGlobalNexLite = createContext()
export const useNexLiteGlobal = () => useContext(ThemeGlobalNexLite)

const LoadingScreen = dynamic(() => import('./components/LoadingScreen'), { ssr: false })

const LayoutBase = props => {
  const {
    allNavPages,
    children,
    siteInfo,
    tagOptions,
    categoryOptions,
    postCount,
    notice,
    post
  } = props
  const searchModal = useRef(null)
  const commentRef = useRef(null)
  const [filterKey, setFilterKey] = useState('')

  const [filterPosts, setFilterPosts] = useState(() => {
    return allNavPages?.filter(item =>
      item.tags?.some(
        t => t === siteConfig('NEXLITE_RECOMMEND_TAG', 'Recommend', CONFIG)
      )
    ) || []
  })
  const [recentPosts, setRecentPosts] = useState([])
  const [sideBarVisible, setSideBarVisible] = useState(false)
  const { updateDarkMode } = useGlobal()

  useEffect(() => {
    loadWowJS()
  }, [])

  useEffect(() => {
    const defaultAppearance = siteConfig('APPEARANCE', 'dark', CONFIG)
    const savedDarkMode = isBrowser && localStorage.getItem('darkMode')
    
    if (defaultAppearance === 'dark' && savedDarkMode === null) {
      updateDarkMode(true)
      if (isBrowser) {
        document.getElementsByTagName('html')[0].classList.remove('light')
        document.getElementsByTagName('html')[0].classList.add('dark')
      }
    }
  }, [])

  return (
    <ThemeGlobalNexLite.Provider
      value={{
        searchModal,
        filterKey,
        setFilterKey,
        recentPosts,
        setRecentPosts,
        filterPosts,
        setFilterPosts,
        sideBarVisible,
        setSideBarVisible
      }}>
      <LoadingScreen />
      <div
        id='theme-nexlite'
        className={`${siteConfig('FONT_STYLE')} w-full h-full min-h-screen scroll-smooth`}>
        <Style />

        <div
          id='wrapper'
          className='relative flex justify-center w-full mx-auto gap-0 max-w-[1300px] lg:pt-10 pt-4 lg:px-4 px-0'>
          <div className='bg-white dark:bg-zinc-900 lg:rounded-xl shadow-sm flex w-full'>
            <aside className='w-[180px] hidden lg:block flex-shrink-0 border-r border-zinc-100 dark:border-zinc-800 bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-900 dark:to-zinc-900'>
              <div className='sticky top-8 p-4'>
                <MenuList {...props} showSearch={!post} />
              </div>
            </aside>

            <main className='flex-1 min-w-0 min-h-screen lg:px-5 px-3 py-6'>
              {children}
              <div className='py-4'>
                <AdSlot type='in-article' />
              </div>
              <Footer />
            </main>

            {post ? (
              <PostSidebar post={post} />
            ) : (
              <RightSidebar
                siteInfo={siteInfo}
                tagOptions={tagOptions}
                categoryOptions={categoryOptions}
                postCount={postCount}
                notice={notice}
                posts={allNavPages}
              />
            )}
          </div>
        </div>

        {!post && <SearchModal siteInfo={siteInfo} {...props} />}
      </div>
    </ThemeGlobalNexLite.Provider>
  )
}

const LayoutIndex = props => {
  return (
    <>
      <PostListRecent />
      <LayoutPostList {...props} />
      <HomeComment />
    </>
  )
}

const HomeComment = () => {
  const [isOpen, setIsOpen] = useState(false)
  const homePost = { id: '/', title: '留言板', comment: 'Show' }
  
  return (
    <div id='home-comment' className='mt-8 pt-6 border-t border-zinc-100 dark:border-zinc-800'>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className='w-full flex items-center justify-between gap-3 p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors'>
        <div className='flex items-center gap-3'>
          <div className='w-10 h-10 rounded-lg bg-violet-500/10 dark:bg-violet-500/20 flex items-center justify-center'>
            <i className='fas fa-envelope text-violet-500'></i>
          </div>
          <div className='text-left'>
            <h3 className='text-base font-bold text-zinc-800 dark:text-zinc-100'>留言板</h3>
            <p className='text-xs text-zinc-400 dark:text-zinc-500'>欢迎留言交流，无需登录即可评论</p>
          </div>
        </div>
        <i className={`fas fa-chevron-down text-zinc-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}></i>
      </button>
      
      {isOpen && (
        <div className='mt-4 animate-fadeIn'>
          <Comment frontMatter={homePost} />
        </div>
      )}
    </div>
  )
}

const LayoutPostList = props => {
  const { posts, categoryOptions, currentCategory, siteInfo } = props
  const { filterKey } = useNexLiteGlobal()
  const filteredBlogPosts = filterPostsByKeyword(posts, filterKey)

  return (
    <>
      <div className='lg:hidden mb-4'>
        <Header siteInfo={siteInfo} />
      </div>
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

  const { filterKey } = useNexLiteGlobal()
  const filteredBlogPosts = filterPostsByKeyword(posts, filterKey)

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
  const totalPosts = Object.values(archivePosts || {}).reduce((sum, posts) => sum + posts.length, 0)
  
  return (
    <>
      <div className='mb-6'>
        <div className='flex items-center gap-3 mb-2'>
          <div className='w-10 h-10 rounded-lg bg-violet-500/10 dark:bg-violet-500/20 flex items-center justify-center'>
            <i className='fas fa-archive text-violet-500'></i>
          </div>
          <div>
            <h1 className='text-xl font-bold text-zinc-800 dark:text-zinc-100'>归档</h1>
            <p className='text-xs text-zinc-400 dark:text-zinc-500'>共 {totalPosts} 篇文章</p>
          </div>
        </div>
      </div>
      
      <div className='space-y-8'>
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
  const { setRecentPosts } = useNexLiteGlobal()
  const { post, siteInfo, allNavPages, lock, validPassword, posts } = props
  const serverURL = siteConfig('COMMENT_WALINE_SERVER_URL')
  const articlePath = post?.href
  const [showRecommend, setShowRecommend] = useState(false)

  useWalinePageview(articlePath)

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY
      const windowHeight = window.innerHeight
      const docHeight = document.documentElement.scrollHeight
      
      if (scrollTop + windowHeight >= docHeight - 500) {
        setShowRecommend(true)
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const randomPosts = shuffleArray(deepClone(allNavPages))

  const getPrevNextPosts = useCallback(() => {
    if (!posts || !post) return { prevPost: null, nextPost: null }
    
    const currentIndex = posts.findIndex(p => p.id === post.id || p.slug === post.slug)
    
    return {
      prevPost: currentIndex > 0 ? posts[currentIndex - 1] : null,
      nextPost: currentIndex < posts.length - 1 ? posts[currentIndex + 1] : null
    }
  }, [posts, post])

  const { prevPost, nextPost } = getPrevNextPosts()

  initialPWA(post, siteInfo)

  useEffect(() => {
    const recentPosts = localStorage.getItem('recent_posts')
      ? JSON.parse(localStorage.getItem('recent_posts'))
      : []

    const existedIndex = recentPosts.findIndex(item => item?.id === post?.id)
    if (existedIndex === -1) {
      recentPosts.unshift(post)
    } else {
      const existingPost = recentPosts.splice(existedIndex, 1)[0]
      recentPosts.unshift(existingPost)
    }
    localStorage.setItem('recent_posts', JSON.stringify(recentPosts))

    setRecentPosts(recentPosts)
  }, [post])

  return (
    <>
      {lock && <ArticleLock validPassword={validPassword} />}

      {!lock && post && (
        <div id='article-wrapper'>
          <MobilePostDetail 
            post={post} 
            prevPost={prevPost}
            nextPost={nextPost}
            toc={post?.toc || []}
          />
          
          <div className='post-detail-wrapper w-full grow flex'>
            <div className={`w-full`}>
              <PostEmbed post={post} siteInfo={siteInfo} />

              <div className='post-info'>
                {post && (
                  <div>
                    <NotionPage post={post} />
                    
                    <div className='xl:hidden mt-8 px-1 mb-24'>
                      <h1 className='font-bold text-2xl text-zinc-800 dark:text-zinc-100 mb-4 leading-snug'>
                        {siteConfig('POST_TITLE_ICON') && <NotionIcon icon={post?.pageIcon} />}
                        {post?.title}
                      </h1>
                      
                      <div className='flex flex-wrap items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400 mb-3'>
                        {post?.publishDay && (
                          <span className='flex items-center gap-1'>
                            <i className='far fa-calendar text-[10px]'></i>
                            {post.publishDay}
                          </span>
                        )}
                        {post?.wordCount && (
                          <span className='flex items-center gap-1'>
                            <i className='fas fa-file-word text-[10px]'></i>
                            {post.wordCount} 字
                          </span>
                        )}
                        {post?.readTime && (
                          <span className='flex items-center gap-1'>
                            <i className='far fa-clock text-[10px]'></i>
                            {post.readTime}
                          </span>
                        )}
                        {serverURL && (
                          <span className='flex items-center gap-1'>
                            <i className='far fa-eye text-[10px]'></i>
                            <span className='waline-pageview-count font-medium' data-path={post?.href}>--</span>
                          </span>
                        )}
                      </div>
                      
                      <div className='flex flex-wrap items-center gap-2'>
                        {post?.category && (
                          <SmartLink 
                            href={`/category/${post.category}`}
                            className='inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-violet-500/10 dark:bg-violet-500/20 text-xs text-violet-600 dark:text-violet-400 hover:bg-violet-500/20 dark:hover:bg-violet-500/30 transition-colors'>
                            <i className='fas fa-folder text-[10px]'></i>
                            {post.category}
                          </SmartLink>
                        )}
                        {post?.tags && post.tags.length > 0 && post.tags.slice(0, 5).map((tag, index) => (
                          <SmartLink
                            key={index}
                            href={`/tag/${encodeURIComponent(tag)}`}
                            className='px-2 py-1 bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 rounded-full text-xs hover:bg-violet-100 dark:hover:bg-violet-500/20 hover:text-violet-500 transition-colors'>
                            #{tag}
                          </SmartLink>
                        ))}
                      </div>
                    </div>
                    
                    <div className='hidden xl:block mt-8'>
                      <PostInfo post={post} />
                    </div>
                    
                    <AdSlot />
                    <div className='hidden xl:block mt-8'>
                      <PostReaction post={post} />
                      <Comment frontMatter={post} />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {showRecommend && <PostListIndexCombine posts={randomPosts} />}
          <MobilePostFooter siteInfo={siteInfo} />
        </div>
      )}
      <BackToTop />
    </>
  )
}

const Layout404 = props => {
  const router = useRouter()
  const [countdown, setCountdown] = useState(5)
  
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer)
          router.push('/')
          return 0
        }
        return prev - 1
      })
    }, 1000)
    
    return () => clearInterval(timer)
  }, [router])

  return (
    <div className='fixed inset-0 flex items-center justify-center bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-zinc-900 dark:to-zinc-800'>
      <div className='text-center px-8'>
        <div className='relative mb-8'>
          <div className='text-[180px] md:text-[240px] font-black text-zinc-200 dark:text-zinc-800 select-none leading-none'>
            404
          </div>
          <div className='absolute inset-0 flex items-center justify-center'>
            <div className='w-24 h-24 md:w-32 md:h-32 rounded-full bg-violet-500/10 dark:bg-violet-500/20 flex items-center justify-center animate-pulse'>
              <i className='fas fa-ghost text-4xl md:text-5xl text-violet-500 animate-bounce'></i>
            </div>
          </div>
        </div>
        
        <h1 className='text-2xl md:text-3xl font-bold text-zinc-800 dark:text-zinc-100 mb-4'>
          页面走丢了
        </h1>
        
        <p className='text-zinc-500 dark:text-zinc-400 mb-8 max-w-md mx-auto'>
          抱歉，您访问的页面不存在或已被删除。即将在 {countdown} 秒后返回首页。
        </p>
        
        <div className='flex flex-col sm:flex-row gap-4 justify-center'>
          <button
            onClick={() => router.push('/')}
            className='px-6 py-3 bg-violet-500 hover:bg-violet-600 text-white rounded-xl font-medium transition-all hover:scale-105 active:scale-95'>
            <i className='fas fa-home mr-2'></i>
            返回首页
          </button>
          <button
            onClick={() => router.back()}
            className='px-6 py-3 bg-zinc-200 dark:bg-zinc-700 hover:bg-zinc-300 dark:hover:bg-zinc-600 text-zinc-700 dark:text-zinc-200 rounded-xl font-medium transition-all hover:scale-105 active:scale-95'>
            <i className='fas fa-arrow-left mr-2'></i>
            返回上页
          </button>
        </div>
        
        <div className='mt-12 flex justify-center gap-8 text-zinc-400 dark:text-zinc-500'>
          <div className='text-center'>
            <div className='text-2xl font-bold text-violet-500'>404</div>
            <div className='text-xs'>错误代码</div>
          </div>
          <div className='w-px bg-zinc-200 dark:bg-zinc-700'></div>
          <div className='text-center'>
            <div className='text-2xl font-bold text-violet-500'>{countdown}s</div>
            <div className='text-xs'>自动跳转</div>
          </div>
        </div>
      </div>
      
      <div className='absolute bottom-8 left-0 right-0 text-center text-xs text-zinc-400 dark:text-zinc-500'>
        <p>NexLite Theme • Powered by Notion</p>
      </div>
    </div>
  )
}

const LayoutCategoryIndex = props => {
  const { categoryOptions, allNavPages } = props

  const getCategoryCover = categoryName => {
    const categoryPosts = allNavPages?.filter(post => post.category === categoryName)
    if (categoryPosts && categoryPosts.length > 0) {
      return categoryPosts[0].pageCoverThumbnail || categoryPosts[0].pageCover
    }
    return null
  }

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
      
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
        {categoryOptions?.map((category, index) => (
          <CategoryCard key={category.name} category={category} getCategoryCover={getCategoryCover} />
        ))}
      </div>
    </>
  )
}

const CategoryCard = ({ category, getCategoryCover }) => {
  const cover = getCategoryCover(category.name)
  const [imageError, setImageError] = useState(false)

  return (
    <SmartLink
      href={`/category/${category.name}`}
      className='group relative block aspect-[4/3] rounded-xl overflow-hidden cursor-pointer bg-zinc-100 dark:bg-zinc-800'>
      {cover && !imageError ? (
        <img
          src={cover}
          alt={category.name}
          className='w-full h-full object-cover transition-transform duration-500 group-hover:scale-110'
          onError={() => setImageError(true)}
        />
      ) : (
        <div className='w-full h-full pix-gradient-bg flex items-center justify-center'>
          <i className='fas fa-folder text-white/30 text-4xl'></i>
        </div>
      )}
      <div className='absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent' />
      <div className='absolute bottom-0 left-0 right-0 p-4'>
        <h3 className='text-lg font-bold text-white mb-1 truncate'>
          {category.name}
        </h3>
        <p className='text-sm text-white/80'>
          {category.count} 篇文章
        </p>
      </div>
    </SmartLink>
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
