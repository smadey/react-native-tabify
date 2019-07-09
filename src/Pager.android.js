import React, {
  useRef,
  useMemo,
  useCallback,
} from 'react'
import {
  StyleSheet,
  ViewPagerAndroid,
} from 'react-native'

import createPagerComponent from './PagerFactory'

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})

export function createPager() {
  return createPagerComponent({
    usePager({ shared, setLayout, onScrolling, onStopped }) {
      const self = useMemo(() => ({ idle: true }), [])

      const ref = useRef()

      const onLayout = useCallback((e) => {
        setLayout(e.nativeEvent.layout)
      }, [])

      const onPageScroll = useCallback((e) => {
        const x = (e.nativeEvent.position + e.nativeEvent.offset) * shared.width
        onScrolling({ x })
      }, [])

      const onPageSelected = useCallback((e) => {
        self.index = e.nativeEvent.position
      }, [])

      const onPageScrollStateChanged = useCallback((e) => {
        const state = (e && e.nativeEvent && e.nativeEvent.pageScrollState) || e
        self.idle = state === 'idle'

        const x = self.index * shared.width
        onStopped({ x })
      }, [])

      const scrollToIndex = useCallback((index) => {
        if (self.idle && ref.current) {
          ref.current.setPageWithoutAnimation(index)
        }
      }, [])

      return [
        ({ children }) => {
          return (
            <ViewPagerAndroid
              initialPage={shared.index}
              keyboardDismissMode="on-drag"
              onLayout={onLayout}
              onPageScroll={onPageScroll}
              onPageScrollStateChanged={onPageScrollStateChanged}
              onPageSelected={onPageSelected}
              ref={ref}
              removeClippedSubviews
              style={styles.container}
            >
              {children}
            </ViewPagerAndroid>
          )
        },
        scrollToIndex,
      ]
    },
  })
}
