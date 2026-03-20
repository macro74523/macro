import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import { useEffect, useState, useCallback } from 'react'

const POST_REACTIONS_KEY = 'post_reactions'

const PostLike = ({ post }) => {
  const { isDarkMode } = useGlobal()
  const [isLoading, setIsLoading] = useState(true)
  const [likeCount, setLikeCount] = useState(0)
  const [hasLiked, setHasLiked] = useState(false)
  const [showAnimation, setShowAnimation] = useState(false)

  const repo = siteConfig('COMMENT_UTTERRANCES_REPO') || siteConfig('COMMENT_GISCUS_REPO')

  useEffect(() => {
    if (!repo) {
      setIsLoading(false)
      return
    }

    const savedReactions = localStorage.getItem(POST_REACTIONS_KEY)
    const likedPosts = savedReactions ? JSON.parse(savedReactions) : []
    setHasLiked(likedPosts.includes(post?.id))

    fetchLikeCount()
  }, [post?.id, repo])

  const fetchLikeCount = async () => {
    if (!repo) {
      setIsLoading(false)
      return
    }

    try {
      const [owner, name] = repo.split('/')
      const issueTitle = post?.title
      const query = `
        query($owner: String!, $name: String!, $issueTitle: String!) {
          repository(owner: $owner, name: $name) {
            issues(first: 1, filterBy: {searchQuery: $issueTitle}) {
              nodes {
                reactions(content: HEART) {
                  totalCount
                }
              }
            }
          }
        }
      `

      const response = await fetch('https://api.github.com/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query,
          variables: {
            owner,
            name,
            issueTitle: `is:issue "${issueTitle}"`
          }
        })
      })

      const data = await response.json()
      const count = data?.data?.repository?.issues?.nodes?.[0]?.reactions?.totalCount || 0
      setLikeCount(count)
    } catch (error) {
      console.error('Failed to fetch like count:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleLike = useCallback(async () => {
    if (hasLiked || !repo) return

    setShowAnimation(true)
    setTimeout(() => setShowAnimation(false), 1000)

    const savedReactions = localStorage.getItem(POST_REACTIONS_KEY)
    const likedPosts = savedReactions ? JSON.parse(savedReactions) : []
    likedPosts.push(post?.id)
    localStorage.setItem(POST_REACTIONS_KEY, JSON.stringify(likedPosts))

    setHasLiked(true)
    setLikeCount(prev => prev + 1)

    const issueUrl = `https://github.com/${repo}/issues?q=${encodeURIComponent(post?.title)}`
    window.open(issueUrl, '_blank')
  }, [hasLiked, post?.id, post?.title, repo])

  if (!repo) {
    return null
  }

  return (
    <div className='flex items-center justify-center my-6'>
      <button
        onClick={handleLike}
        disabled={hasLiked}
        className={`
          relative flex items-center gap-2 px-6 py-3 rounded-full
          transition-all duration-300 transform
          ${hasLiked 
            ? 'bg-violet-100 dark:bg-violet-500/20 cursor-default' 
            : 'bg-zinc-100 dark:bg-zinc-800 hover:bg-violet-50 dark:hover:bg-violet-500/10 hover:scale-105 cursor-pointer'
          }
        `}>
        <span className={`text-2xl transition-transform duration-300 ${showAnimation ? 'animate-bounce' : ''}`}>
          {hasLiked ? '❤️' : '🤍'}
        </span>
        <span className={`text-sm font-medium ${hasLiked ? 'text-violet-500' : 'text-zinc-600 dark:text-zinc-400'}`}>
          {hasLiked ? '已点赞' : '点赞'}
        </span>
        {likeCount > 0 && (
          <span className='text-xs text-zinc-400 dark:text-zinc-500 ml-1'>
            {likeCount}
          </span>
        )}
        
        {showAnimation && (
          <div className='absolute -top-2 -right-2 animate-ping'>
            <span className='text-lg'>❤️</span>
          </div>
        )}
      </button>
      
      {!hasLiked && (
        <p className='text-xs text-zinc-400 dark:text-zinc-500 ml-3'>
          点击后跳转到 GitHub 点赞
        </p>
      )}
    </div>
  )
}

export default PostLike
