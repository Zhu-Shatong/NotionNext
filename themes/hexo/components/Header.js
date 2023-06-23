// import Image from 'next/image'
import { useCallback, useEffect, useState } from 'react'
import Typed from 'typed.js'
import CONFIG_HEXO from '../config_hexo'
import NavButtonGroup from './NavButtonGroup'
import throttle from 'lodash.throttle'

let wrapperTop = 0
let windowTop = 0
let autoScroll = false
const enableAutoScroll = false // 是否开启自动吸附滚动

/**
 *
 * @returns 头图
 */
const Header = props => {
  const [typed, changeType] = useState()
  const { siteInfo } = props
  useEffect(() => {
    updateHeaderHeight()

    if (!typed && window && document.getElementById('typed')) {
      changeType(
        new Typed('#typed', {
          strings: CONFIG_HEXO.HOME_BANNER_GREETINGS,
          typeSpeed: 200,
          backSpeed: 100,
          backDelay: 400,
          showCursor: true,
          smartBackspace: true
        })
      )
    }

    if (enableAutoScroll) {
      scrollTrigger()
      window.addEventListener('scroll', scrollTrigger)
    }

    window.addEventListener('resize', updateHeaderHeight)
    return () => {
      if (enableAutoScroll) {
        window.removeEventListener('scroll', scrollTrigger)
      }
      window.removeEventListener('resize', updateHeaderHeight)
    }
  })

  function updateHeaderHeight() {
    requestAnimationFrame(() => {
      const wrapperElement = document.getElementById('wrapper')
      wrapperTop = wrapperElement?.offsetTop
    })
  }

  const autoScrollEnd = () => {
    if (autoScroll) {
      windowTop = window.scrollY
      autoScroll = false
    }
  }
  const throttleMs = 200
  const scrollTrigger = useCallback(throttle(() => {
    if (screen.width <= 768) {
      return
    }

    const scrollS = window.scrollY
    // 自动滚动
    if ((scrollS > windowTop) & (scrollS < window.innerHeight) && !autoScroll
    ) {
      autoScroll = true
      window.scrollTo({ top: wrapperTop, behavior: 'smooth' })
      autoScrollEnd()
    }
    if ((scrollS < windowTop) && (scrollS < window.innerHeight) && !autoScroll) {
      autoScroll = true
      window.scrollTo({ top: 0, behavior: 'smooth' })
      autoScrollEnd()
    }
    windowTop = scrollS
  }, throttleMs))

  return (
        <header id="header" style={{ zIndex: 1 }} className="w-full h-screen relative" >

            <div id="google_translate_element" style="position:absolute;bottom:10px;right:10px;z-index:2000;opacity:0.7"></div>
<script>
function googleTranslateElementInit() {
 
	new google.translate.TranslateElement(
		{
                //这个参数不起作用，看文章底部更新，翻译面板的语言
                //pageLanguage: 'zh-CN',
            //这个是你需要翻译的语言，比如你只需要翻译成越南和英语，这里就只写en,vi
			includedLanguages: 'en,zh-CN,hr,cs,da,nl,fr,de,el,iw,hu,ga,it,ja,ko,pt,ro,ru,sr,es,th,vi',
            //选择语言的样式，这个是面板，还有下拉框的样式，具体的记不到了，找不到api~~
			layout: google.translate.TranslateElement.InlineLayout.SIMPLE,
            //自动显示翻译横幅，就是翻译后顶部出现的那个，有点丑，这个属性没有用的话，请看文章底部的其他方法
			autoDisplay: true, 
			//还有些其他参数，由于原插件不再维护，找不到详细api了，将就了，实在不行直接上dom操作
		}, 
		'google_translate_element'//触发按钮的id
	);
 
}
</script>
<script src="https://translate.google.cn/translate_a/element.js?cb=googleTranslateElementInit"></script>

            <div id='header-cover' style={{ backgroundImage: `url('${siteInfo.pageCover}')` }}
                className={`header-cover bg-center w-full h-screen bg-cover ${CONFIG_HEXO.HOME_NAV_BACKGROUND_IMG_FIXED ? 'bg-fixed' : ''}`}/>

            <div className="text-white absolute bottom-0 flex flex-col h-full items-center justify-center w-full ">
                <div className='text-4xl md:text-5xl shadow-text'>{siteInfo?.title}</div>
                <div className='mt-2 h-12 items-center text-center shadow-text text-lg'>
                    <span id='typed' />
                </div>

                {/* 首页导航插件 */}
                {CONFIG_HEXO.HOME_NAV_BUTTONS && <NavButtonGroup {...props} />}

            </div>

            <div
                onClick={() => { window.scrollTo({ top: wrapperTop, behavior: 'smooth' }) }}
                className="cursor-pointer w-full text-center py-4 text-3xl absolute bottom-10 text-white"
            >
                <i className='animate-bounce fas fa-angle-down' />
            </div>

        </header>
  )
}

export default Header
