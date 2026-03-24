export default async function handler(req, res) {
  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 10000)
    
    const response = await fetch('https://github.com/macro74523', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1'
      },
      signal: controller.signal
    })
    
    clearTimeout(timeoutId)
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const html = await response.text()
    
    const contributionData = []
    
    const regex = /data-date="(\d{4}-\d{2}-\d{2})"[^>]*data-level="(\d+)"/g
    let match
    
    while ((match = regex.exec(html)) !== null) {
      const date = match[1]
      const level = parseInt(match[2])
      contributionData.push({ date, level })
    }
    
    contributionData.sort((a, b) => new Date(a.date) - new Date(b.date))
    
    const lastYear = contributionData.slice(-365)
    
    const total = lastYear.reduce((sum, day) => sum + day.level, 0)
    
    console.log(`Fetched ${lastYear.length} days of contributions`)
    console.log(`Total contributions: ${total}`)
    
    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate')
    res.status(200).json({ 
      contributions: lastYear,
      total: total
    })
  } catch (error) {
    console.error('Failed to fetch GitHub contributions:', error)
    
    const today = new Date()
    const mockContributions = []
    
    for (let i = 364; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      const dateStr = date.toISOString().split('T')[0]
      const level = Math.random() > 0.7 ? Math.floor(Math.random() * 4) : 0
      mockContributions.push({ date: dateStr, level })
    }
    
    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate')
    res.status(200).json({ 
      contributions: mockContributions,
      total: mockContributions.reduce((sum, day) => sum + day.level, 0),
      mock: true
    })
  }
}
