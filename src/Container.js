import React, {
  createRef,
  forwardRef,
  memo,
  useState,
  useMemo,
  useCallback,
} from 'react'
import {
  ScrollView,
  StyleSheet,
  View,
} from 'react-native'

const stickyHeaderIndices = [1] // Tabs 固定
const round = Math.round

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})

function useEvent(props, name, fn, deps) {
  const handler = props[name]
  return {
    ...props,
    [name]: useCallback((...args) => {
      fn(...args)
      return handler && handler(...args)
    }, [handler, ...(deps || [])]),
  }
}

function useScrollEnd(props, onScrollEnd, deps) {
  const { onScrollBeginDrag, onScrollEndDrag, onMomentumScrollBegin, onMomentumScrollEnd } = props
  const events = useMemo(() => {
    if (!onScrollEnd) return {}

    let isMomentumScroll
    return {
      onScrollBeginDrag(e) {
        isMomentumScroll = false
        return onScrollBeginDrag && onScrollBeginDrag(e)
      },
      onScrollEndDrag(e) {
        e.persist()
        global.requestAnimationFrame(() => {
          !isMomentumScroll && onScrollEnd(e)
        })
        return onScrollEndDrag && onScrollEndDrag(e)
      },
      onMomentumScrollBegin(e) {
        isMomentumScroll = true
        return onMomentumScrollBegin && onMomentumScrollBegin(e)
      },
      onMomentumScrollEnd(e) {
        isMomentumScroll = false
        onScrollEnd(e)
        return onMomentumScrollEnd && onMomentumScrollEnd(e)
      },
    }
  }, [onScrollBeginDrag, onScrollEndDrag, onMomentumScrollBegin, onMomentumScrollEnd, ...(deps || [])])
  return {
    ...props,
    ...events,
  }
}

function useScroller() {
  return useMemo(() => {
    const ref = createRef()
    let enabled = true
    const getEnabled = () => enabled
    const setEnabled = (value) => {
      if (enabled === value) return
      enabled = value
      ref.current && ref.current.setNativeProps({ scrollEnabled: value })
    }
    const setScrollTop = (scrollTop, animated) => {
      ref.current && ref.current.scrollTo && ref.current.scrollTo({ y: scrollTop, animated: !!animated })
    }
    return [ref, getEnabled, setEnabled, setScrollTop]
  }, [])
}

function usePlaceholder() {
  return useMemo(() => {
    const ref = createRef()
    const el = <View ref={ref} />
    const heights = {}
    const addHeight = (key, height) => {
      heights[key] = height
    }
    const setHeight = (key) => {
      const height = heights[key] || 0
      ref.current && ref.current.setNativeProps({ style: { height } })
    }
    return [el, addHeight, setHeight]
  }, [])
}

export function createContainer({ Tabs }) {
  function TabScroller({ tabKey, onTabScrollerRef, onTabScrollerLayout, onTabScrollerScrollEnd, ...props }, forwardedRef) {
    const state = useMemo(() => ({ enabled: false }), [])

    const onRef = useCallback((ref) => {
      onTabScrollerRef(tabKey, ref && {
        isScrollable() {
          const { height, contentHeight } = state
          return height > 0 && contentHeight > height
        },
        scrollTo(value) {
          ref && ref.scrollTo(value)
        },
        setEnabled(enabled) {
          if (state.enabled === enabled) return
          state.enabled = enabled
          ref && ref.setNativeProps({ scrollEnabled: enabled })
        },
      })
      if (typeof forwardedRef === 'function') {
        forwardedRef(ref)
      } else if (forwardedRef) {
        forwardedRef.current = ref
      }
    }, [])

    props = useEvent(props, 'onLayout', (e) => {
      const height = round(e.nativeEvent.layout.height)
      if (state.height !== height) {
        state.height = height

        const contentHeight = state.contentHeight
        height > 0 && contentHeight > height && onTabScrollerLayout(tabKey, { height, contentHeight })
      }
    })

    props = useEvent(props, 'onContentSizeChange', (contentWidth, contentHeight) => {
      contentHeight = round(contentHeight)
      if (state.contentHeight !== contentHeight) {
        state.contentHeight = contentHeight

        const height = state.height
        height > 0 && contentHeight > height && onTabScrollerLayout(tabKey, { height, contentHeight })
      }
    })

    props = useScrollEnd(props, (e) => {
      if (!state.enabled) return
      const scrollTop = e.nativeEvent.contentOffset.y
      onTabScrollerScrollEnd(tabKey, { scrollTop })
    })

    return (
      <ScrollView
        {...props}
        ref={onRef}
        refreshControl={null} // 不能用下拉刷新
        onRefresh={null}
        scrollEnabled={state.enabled}
      />
    )
  }
  TabScroller = memo(forwardRef(TabScroller))

  function Container({ HeaderComponent, ...props }, forwardedRef) {
    const [containerHeight, setContainerHeight] = useState()
    const state = useMemo(() => ({}), [])

    const [scrollerRef, getScrollerEnabled, setScrollerEnabled, setScrollerScrollTop] = useScroller()

    const [placeholder, addPlaceholderHeight, setPlaceholderHeight] = usePlaceholder()

    const [setTabRef, setTabEnabled, isTabScrollable, setTabScrollTop] = useMemo(() => {
      const refs = {}
      const setRef = (key, ref) => {
        refs[key] = ref
      }
      const setEnabled = (key, enabled) => {
        refs[key] && refs[key].setEnabled(enabled)
      }
      const isScrollable = (key) => {
        return refs[key] && refs[key].isScrollable()
      }
      const setScrollTop = (key, scrollTop, animated) => {
        refs[key] && refs[key].scrollTo({ y: scrollTop, animated: !!animated })
      }
      return [setRef, setEnabled, isScrollable, setScrollTop]
    }, [])

    const onLayout = useCallback((e) => {
      const height = round(e.nativeEvent.layout.height)
      if (state.height !== height) {
        state.height = height
        state.contentStyle = { height }
        setContainerHeight(height)
      }
    }, [])

    const onHeaderLayout = useCallback((e) => {
      state.headerHeight = round(e.nativeEvent.layout.height)
    }, [])

    const onScroll = useCallback((e) => {
      if (!getScrollerEnabled()) return

      const activeTabKey = state.activeTabKey
      if (!isTabScrollable(activeTabKey)) return

      const scrollTop = round(e.nativeEvent.contentOffset.y)
      const tabScrollTop = Math.max(scrollTop - state.headerHeight, 0) // tab 的 scrollTop 小于 0 会有异常
      setTabScrollTop(activeTabKey, tabScrollTop)
    }, [])

    const onScrollEndProps = useScrollEnd({}, (e) => {
      if (!getScrollerEnabled()) return

      const scrollTop = e.nativeEvent.contentOffset.y
      if (scrollTop <= state.headerHeight) return

      const activeTabKey = state.activeTabKey
      if (!isTabScrollable(activeTabKey)) return

      setScrollerEnabled(false)
      setScrollerScrollTop(state.headerHeight, true)
      global.requestAnimationFrame(() => {
        setTabEnabled(activeTabKey, true)
      })
    })

    props.renderTabScroller = useMemo(() => {
      const onTabScrollerLayout = (tabKey, { height, contentHeight }) => {
        addPlaceholderHeight(tabKey, contentHeight - height)

        if (tabKey === state.activeTabKey) {
          if (getScrollerEnabled()) {
            setTabScrollTop(tabKey, 0)
          } else {
            setTabEnabled(tabKey, true)
          }
          setPlaceholderHeight(tabKey)
        }
      }
      const onTabScrollerScrollEnd = (tabKey, { scrollTop }) => {
        if (scrollTop > 1) return
        setScrollerEnabled(true)
        setScrollerScrollTop(0, true)
        setTabEnabled(tabKey, false)
        setTabScrollTop(tabKey, 0)
      }
      return tabScrollerProps => (
        <TabScroller
          {...tabScrollerProps}
          onTabScrollerRef={setTabRef}
          onTabScrollerLayout={onTabScrollerLayout}
          onTabScrollerScrollEnd={onTabScrollerScrollEnd}
        />
      )
    }, [])
    props = useEvent(props, 'onTabFocused', ({ key }) => {
      if (getScrollerEnabled()) {
        setTabScrollTop(key, 0)
      } else {
        setTabEnabled(state.activeTabKey, false)
        setTabEnabled(key, true)
      }
      setPlaceholderHeight(key)
      state.activeTabKey = key
    })

    return (
      <ScrollView
        ref={scrollerRef}
        style={styles.container}
        onLayout={onLayout}
        showsVerticalScrollIndicator={false}
        stickyHeaderIndices={stickyHeaderIndices}
        scrollEnabled={getScrollerEnabled()}
        scrollEventThrottle={16}
        decelerationRate="fast"
        onScroll={onScroll}
        {...onScrollEndProps}
      >
        <View onLayout={onHeaderLayout}>
          <HeaderComponent />
        </View>
        <View style={state.contentStyle}>
          {
            containerHeight > 0
              ? <Tabs {...props} ref={forwardedRef} />
              : null
          }
        </View>
        {placeholder}
      </ScrollView>
    )
  }
  Container = memo(forwardRef(Container))

  return Container
}
