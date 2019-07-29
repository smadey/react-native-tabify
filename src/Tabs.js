import React, {
  forwardRef,
  memo,
  useState,
  useMemo,
  useCallback,
  useEffect,
  useImperativeHandle,
} from 'react'
import {
  Animated,
  View,
} from 'react-native'

import { createUseStyles } from './utils'

export function createTabs({ Bar, Pager, Scene, styles: stylesOptions }) {
  const useStyles = createUseStyles(stylesOptions)

  const defaultRenderBar = props => <Bar {...props} />
  const defaultRenderPager = props => <Pager {...props} />
  const defaultRenderScene = props => <Scene {...props} />

  function Tabs({
    style,
    initialTab,
    barPosition,
    renderBar = defaultRenderBar,
    renderPager = defaultRenderPager,
    renderScene = defaultRenderScene,
    onTabFocused,
    onTabChange,
    children,
  }, forwardedRef) {
    const styles = useStyles()

    const [tabs, routes] = useMemo(() => {
      const nextTabs = {}
      const nextRoutes = []
      React.Children.forEach(children, (tab, index) => {
        if (!tab) return

        const { name, title, subTitle, badge, lazy } = tab.props
        const key = name || title || `tab-${index}`
        nextTabs[key] = tab
        nextRoutes.push({
          key,
          index,
          title,
          subTitle,
          badge,
          lazy,
        })
      })
      return [nextTabs, nextRoutes]
    }, [children])

    const [index, setIndex] = useState(initialTab > 0 ? Math.min(initialTab, routes.length - 1) : 0)

    const state = useMemo(() => ({ index, routes }), [index, JSON.stringify(routes)])

    const position = useMemo(() => new Animated.Value(index), [])

    const self = useMemo(() => ({}), [])
    self.state = state

    const jumpTo = useCallback((key) => {
      // eslint-disable-next-line no-shadow
      const { index, routes } = self.state
      const jumpToIndex = routes.findIndex(d => d.key === key)
      if (jumpToIndex > -1 && jumpToIndex !== index) {
        setIndex(jumpToIndex)
        onTabFocused && onTabFocused({ index: jumpToIndex, key })

        const prevRoute = routes[index]
        if (prevRoute && onTabChange) {
          onTabChange({ prevIndex: index, prevKey: prevRoute.key, index: jumpToIndex, key })
        }
      }
    }, [])

    useImperativeHandle(forwardedRef, () => ({
      jumpTo,
    }), [])

    useEffect(() => {
      const route = routes[index]
      route && onTabFocused && onTabFocused({ index, key: route.key })
    }, [])

    const props = {
      navigationState: state,
      position,
      jumpTo,
    }

    return (
      <View collapsable={false} style={[styles.container, style]}>
        {
          barPosition === 'top' && renderBar(props)
        }
        {
          renderPager({
            ...props,
            children: routes.map((route, i) => renderScene({
              key: route.key,
              route,
              tab: tabs[route.key],
              focused: i === index,
            })),
          })
        }
        {
          barPosition === 'bottom' && renderBar(props)
        }
      </View>
    )
  }

  Tabs = memo(forwardRef(Tabs))
  Tabs.defaultProps = {
    barPosition: 'top',
  }

  return Tabs
}
