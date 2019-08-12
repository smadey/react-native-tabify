import { createBarItem, createBarIndicator, createBar } from './Bar'
import { createTab, createScene } from './Tab'
import { createPager } from './Pager'
import { createTabs } from './Tabs'
import { createContainer } from './Container'

function define(obj, key, getter) {
  let value
  Object.defineProperty(obj, key, {
    get() {
      return value || (value = getter())
    },
  })
}

function createTabify(options) {
  function Tabify() {
  }

  Tabify.create = (opts) => {
    const mergedOptions = { ...options, ...opts }

    Object.keys(opts).forEach((optKey) => {
      const baseOpt = options[optKey]
      const opt = opts[optKey]
      if (baseOpt && opt) {
        const mergedOpt = { ...baseOpt, ...opt }
        Object.keys(opt).forEach((key) => {
          const baseVal = baseOpt[key]
          const val = opt[key]
          if (key === 'styles') {
            mergedOpt[key] = baseVal ? [baseVal, val] : val
          }
        })
        mergedOptions[optKey] = mergedOpt
      }
    })

    return createTabify(mergedOptions)
  }

  define(Tabify, 'BarItem', () => {
    const { isShowIndicator, isScrollable } = options.bar || {}
    const { getWidth, getOffset } = options.barIndicator || {}

    const isContentLayoutUsedIn = getter => getter && getter.toString().indexOf('content') > -1

    const isNeedContainerLayout = isShowIndicator || isScrollable
    const isNeedContentLayout = isShowIndicator && (isContentLayoutUsedIn(getWidth) || isContentLayoutUsedIn(getOffset))
    const isIgnoreLayoutChange = isScrollable

    return createBarItem({
      isNeedContainerLayout,
      isNeedContentLayout,
      isIgnoreLayoutChange,
      ...options.barItem,
    })
  })

  define(Tabify, 'BarIndicator', () => {
    if (options.bar && options.bar.isShowIndicator) {
      return createBarIndicator({
        ...options.barIndicator,
      })
    }
    return null
  })

  define(Tabify, 'Bar', () => {
    return createBar({
      BarItem: Tabify.BarItem,
      BarIndicator: Tabify.BarIndicator,
      ...options.bar,
    })
  })

  define(Tabify, 'Tab', () => {
    return createTab({
      ...options.tab,
    })
  })

  define(Tabify, 'Scene', () => {
    return createScene({
      ...options.scene,
    })
  })

  define(Tabify, 'Pager', () => {
    return createPager({
      ...options.pager,
    })
  })

  define(Tabify, 'Tabs', () => {
    return createTabs({
      Bar: Tabify.Bar,
      Pager: Tabify.Pager,
      Scene: Tabify.Scene,
      ...options.tabs,
    })
  })

  define(Tabify, 'Container', () => {
    return createContainer({
      Tabs: Tabify.Tabs,
      Scene: (options.tabs && options.tabs.Scene) || Tabify.Scene,
      ...options.container,
    })
  })

  return Tabify
}

export {
  createBarItem,
  createBarIndicator,
  createTab,
  createScene,
  createTabs,
  createContainer,
  createTabify,
}

export default createTabify({
  barItem: {
    styles: {
      container: {
        alignItems: 'center',
        flex: 1,
        flexDirection: 'row', // 让 content 宽度自适应
        justifyContent: 'center',
      },
      content: {
        overflow: 'visible', // 让 badge 可见
      },
      title: {
        textAlign: 'center',
      },
      subTitle: {
        textAlign: 'center',
      },
      badgeWrapper: {
        bottom: 0,
        justifyContent: 'center',
        left: '100%',
        position: 'absolute',
        top: 0,
      },
      badge: {
        alignItems: 'center',
        justifyContent: 'center',
      },
    },
  },
  barIndicator: {
    styles: {
      container: {
        bottom: 0,
        left: 0,
        position: 'absolute',
      },
    },
  },
  bar: {
    styles: {
      scroller: {
        flexGrow: 0,
      },
      container: {
        flexDirection: 'row',
        flexWrap: 'nowrap',
      },
    },
  },
  tabs: {
    styles: {
      container: {
        flex: 1,
        overflow: 'hidden',
      },
    },
  },
})
