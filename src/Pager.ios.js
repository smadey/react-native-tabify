import React, {
  useRef,
  useMemo,
  useCallback,
} from 'react'
import {
  ScrollView,
} from 'react-native'

import { createUseStyles } from './utils'
import createPagerComponent from './PagerFactory'

export function createPager({ styles: stylesOptions }) {
  const useStyles = createUseStyles(stylesOptions)

  return createPagerComponent({
    useStyles,
    usePager({ shared, setLayout, onScrolling, onStopped }) {
      const self = useMemo(() => ({ idle: true }), [])

      const ref = useRef()

      const onLayout = useCallback((e) => {
        setLayout(e.nativeEvent.layout)
      }, [])

      const onScroll = useCallback((e) => {
        if (e.nativeEvent.contentSize.width === 0) return
        onScrolling(e.nativeEvent.contentOffset)

        global.cancelAnimationFrame(self.raf)
        self.idle = false
        self.raf = global.requestAnimationFrame(() => {
          self.idle = true
        })
      }, [])

      const onMomentumScrollEnd = useCallback((e) => {
        onStopped(e.nativeEvent.contentOffset)
      }, [])

      const scrollToIndex = useCallback((index) => {
        if (self.idle && ref.current) {
          ref.current.scrollTo({
            x: index * shared.width,
            animated: false,
          })
        }
      }, [])

      return [
        ({ styles, children }) => {
          return (
            <ScrollView
              alwaysBounceHorizontal={false}
              automaticallyAdjustContentInsets={false}
              bounces={false}
              contentContainerStyle={shared.width ? null : styles.content}
              contentOffset={{ x: shared.index * shared.width, y: 0 }}
              directionalLockEnabled
              horizontal
              keyboardDismissMode="on-drag"
              keyboardShouldPersistTaps="always"
              onLayout={onLayout}
              onScroll={onScroll}
              onMomentumScrollEnd={onMomentumScrollEnd}
              overScrollMode="never"
              pagingEnabled
              ref={ref}
              scrollEventThrottle={16}
              scrollToOverflowEnabled
              scrollsToTop={false}
              showsHorizontalScrollIndicator={false}
              style={styles.container}
            >
              {children}
            </ScrollView>
          )
        },
        scrollToIndex,
      ]
    },
  })
}
