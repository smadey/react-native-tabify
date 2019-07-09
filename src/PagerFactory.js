import React, {
  memo,
  useState,
  useMemo,
  useEffect,
} from 'react'
import {
  Dimensions,
  View,
} from 'react-native'

const SCREEN_WIDTH = Dimensions.get('window').width

const round = Math.round

export default ({ usePager }) => {
  function Pager({ navigationState, position, offsetX, panX, jumpTo, children }) {
    const { index, routes } = navigationState

    const [width, setWidth] = useState(SCREEN_WIDTH)

    const self = useMemo(() => ({ index, routes, width, loaded: [] }), [])

    const [render, scrollToIndex] = usePager({
      shared: self,
      setLayout(layout) {
        const w = round(layout.width)
        if (self.width !== w) {
          self.width = w
          setWidth(w)
        }
      },
      onScrolling(scrollOffset) {
        const x = scrollOffset.x
        if (position.setValue) {
          position.setValue(x / self.width)
        } else if (offsetX && panX) {
          const offset = self.index * self.width
          offsetX.setValue(-offset)
          panX.setValue(offset - x)
        }
      },
      onStopped(scrollOffset) {
        const x = scrollOffset.x
        const stoppedIndex = round(x / self.width)
        const route = self.routes[stoppedIndex]

        if (self.index !== stoppedIndex && route) {
          self.index = stoppedIndex
          jumpTo(route.key)
        }
      },
    })

    useEffect(() => {
      if (self.index !== index) {
        self.index = index
        scrollToIndex(index)
      }
      if (self.routes !== routes) {
        self.routes = routes
      }

      const loaded = self.loaded
      if (!loaded.includes(index)) {
        loaded.splice(0, loaded.length - 2) // 只保留最近的 3 个，防止太多了 crash
        loaded.push(index)
      }
    }, [index, routes])

    children = React.Children.toArray(children)

    return render({
      /* eslint-disable indent */
      children: width > 0
        ? routes.map((route, i) => {
            const focused = i === index
            return (
              <View
                key={route.key}
                accessibilityElementsHidden={!focused}
                importantForAccessibility={focused ? 'auto' : 'no-hide-descendants'}
                style={{ overflow: 'hidden', width }}
              >
                {
                  focused || self.loaded.includes(i)
                    ? children[i]
                    : null
                }
              </View>
            )
          })
        : null,
    })
  }
  return memo(Pager)
}