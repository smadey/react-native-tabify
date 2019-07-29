import React, {
  memo,
  useState,
  useMemo,
  useRef,
  useCallback,
  useEffect,
} from 'react'
import {
  Animated,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'

import { shallowEqual, createUseStyles, combineAnimatedStyle, isSameLayout } from './utils'

const noop = () => null

export function createBarItem({ TouchableItem, styles: stylesOptions, isNeedContainerLayout, isNeedContentLayout, isIgnoreLayoutChange }) {
  if (!TouchableItem) {
    TouchableItem = TouchableOpacity
  }

  const isNeedLayouts = isNeedContainerLayout || isNeedContentLayout

  const useStyles = createUseStyles(stylesOptions)

  const useLayouts = !isNeedLayouts ? noop : () => useMemo(() => ({}), [])

  const useContainerLayout = !isNeedLayouts ? noop : (index, layouts, onLayouts) => {
    return useCallback((e) => {
      if (isIgnoreLayoutChange && layouts.container) return
      const layout = e.nativeEvent.layout
      if (!isSameLayout(layouts.container, layout, ['width', 'x'])) {
        layouts.container = layout
        onLayouts && (layouts.content || !isNeedContentLayout) && onLayouts(index, layouts)
      }
    }, [index, onLayouts])
  }

  const useContentLayout = !isNeedContentLayout ? noop : (index, layouts, onLayouts) => {
    return useCallback((e) => {
      if (isIgnoreLayoutChange && layouts.content) return
      const layout = e.nativeEvent.layout
      if (!isSameLayout(layouts.content, layout, ['width'])) {
        layouts.content = layout
        onLayouts && layouts.container && onLayouts(index, layouts)
      }
    }, [index, onLayouts])
  }

  function BarItem({ index, route, interpolate, jumpTo, onLayouts }) {
    const { key, title, subTitle, badge } = route

    const styles = useStyles()
    const [titleStyle, subTitleStyle] = useMemo(() => {
      const getAnimatedValue = (value, activeValue) => interpolate(input => input.map(i => (i === index ? activeValue : value)))

      return [
        combineAnimatedStyle(styles.title, styles.activeTitle, getAnimatedValue),
        combineAnimatedStyle(styles.subTitle, styles.activeTitle, getAnimatedValue),
      ]
    }, [styles, interpolate, index])

    const layouts = useLayouts()
    const onContainerLayout = useContainerLayout(index, layouts, onLayouts)
    const onContentLayout = useContentLayout(index, layouts, onLayouts)

    const onPress = useCallback(() => {
      jumpTo(key)
    }, [key])

    return (
      <TouchableItem style={styles.container} onLayout={onContainerLayout} onPress={onPress}>
        <View style={styles.content} onLayout={onContentLayout}>
          {
            typeof title === 'function'
              ? title(route)
              : title != null && title !== ''
                ? <Animated.Text style={titleStyle}>{title}</Animated.Text>
                : null
          }
          {
            subTitle != null && subTitle !== ''
              ? <Animated.Text style={subTitleStyle}>{subTitle}</Animated.Text>
              : null
          }
          {
            badge
              ? (
                <View style={styles.badgeWrapper}>
                  <View style={styles.badge}>
                    <Text style={styles.badgeTxt}>{badge}</Text>
                  </View>
                </View>
              )
              : null
          }
        </View>
      </TouchableItem>
    )
  }

  const equalHandler = ({ route: r1, ...p1 }, { route: r2, ...p2 }) => shallowEqual(r1, r2) && shallowEqual(p1, p2)
  return memo(BarItem, equalHandler)
}

export function createBarIndicator({ styles: stylesOptions, getWidth, getOffset, render }) {
  if (!getWidth) {
    getWidth = layouts => layouts.map(d => d.container.width)
  }

  if (!getOffset) {
    getOffset = (layouts, widths) => layouts.map((d, i) => (d.container.x + (d.container.width - widths[i]) / 2))
  }

  if (!render) {
    render = ({ style }) => <Animated.View pointerEvents="none" style={style} />
  }

  const useStyles = createUseStyles(stylesOptions)

  function BarIndicator({ interpolate }) {
    const styles = useStyles()

    const style = useMemo(() => {
      const width = interpolate(getWidth)
      const translateX = interpolate(layouts => getOffset(layouts, getWidth(layouts)))
      return [styles.container, { transform: [{ translateX }], width }]
    }, [styles.container, interpolate])

    return render({ style })
  }

  return memo(BarIndicator)
}

export function createBar({ BarItem, BarIndicator, styles: stylesOptions, isScrollable, isShowIndicator }) {
  const useStyles = createUseStyles(stylesOptions)

  const isNeedItemsLayouts = isScrollable || isShowIndicator

  const useItemsLayouts = !isNeedItemsLayouts ? () => [] : (itemsLength) => {
    const [layouts, setLayouts] = useState([])
    const layoutsMap = useMemo(() => ({}), [])

    const onItemLayouts = useCallback((index, itemLayouts) => {
      layoutsMap[index] = itemLayouts

      const keys = Object.keys(layoutsMap)
      if (keys.length === itemsLength) {
        const newLayouts = keys.reduce((arr, i) => {
          arr[i] = layoutsMap[i]
          return arr
        }, [])
        setLayouts(newLayouts)
      }
    }, [itemsLength])

    return [layouts, onItemLayouts]
  }

  const useScrollable = !isScrollable ? noop : (itemLayout) => {
    const ref = useRef()

    const layouts = useMemo(() => {
      let raf
      let animated = false // enable animate first time
      return {
        sync() {
          const { container, content, item } = layouts
          if (container && content && item) {
            global.cancelAnimationFrame(raf)
            raf = global.requestAnimationFrame(() => {
              const x = item.x + item.width / 2 - container.width / 2
              const max = content.width - container.width
              ref.current && ref.current.scrollTo({
                x: Math.max(Math.min(x, max), 0),
                animated,
              })
              animated = true
            })
          }
        },
      }
    }, [])

    const onLayout = useCallback((e) => {
      const layout = e.nativeEvent.layout
      if (!isSameLayout(layouts.container, layout, ['width'])) {
        layouts.container = { width: layout.width }
        layouts.sync()
      }
    }, [])

    const onContentSizeChange = useCallback((width) => {
      const layout = { width }
      if (!isSameLayout(layouts.content, layout, ['width'])) {
        layouts.content = layout
        layouts.sync()
      }
    }, [])

    useEffect(() => {
      layouts.item = itemLayout
      layouts.sync()
    }, [itemLayout])

    return { ref, onLayout, onContentSizeChange }
  }

  const useIndicator = !isShowIndicator ? noop : (position, itemsLayouts) => {
    const interpolate = useCallback((getOutput) => {
      const inputRange = itemsLayouts.map((d, i) => i)
      return position.interpolate({ inputRange, outputRange: getOutput(itemsLayouts), extrapolate: 'clamp' })
    }, [position, itemsLayouts])

    return itemsLayouts.length > 1 ? <BarIndicator interpolate={interpolate} /> : null
  }

  function Bar({ navigationState, position, jumpTo }) {
    const { index, routes } = navigationState

    const styles = useStyles()

    const routesLength = routes.length
    const itemInterpolate = useCallback((getOutput) => {
      const inputRange = []
      let i = 0
      while (i < routesLength) {
        inputRange.push(i++)
      }

      return position.interpolate({ inputRange, outputRange: getOutput(inputRange), extrapolate: 'clamp' })
    }, [routesLength, position])

    const [itemsLayouts, onItemLayouts] = useItemsLayouts(routesLength)
    const scrollerProps = useScrollable(itemsLayouts && itemsLayouts[index] && itemsLayouts[index].container)
    const indicator = useIndicator(position, itemsLayouts)

    let Container
    let containerProps
    if (isScrollable) {
      Container = ScrollView
      containerProps = {
        alwaysBounceHorizontal: false,
        automaticallyAdjustContentInsets: false,
        contentContainerStyle: styles.container,
        horizontal: true,
        keyboardShouldPersistTaps: 'handled',
        overScrollMode: 'never',
        scrollsToTop: false,
        showsHorizontalScrollIndicator: false,
        style: styles.scroller,
        ...scrollerProps,
      }
    } else {
      Container = View
      containerProps = {
        style: styles.container,
      }
    }

    return (
      <Container {...containerProps}>
        {
          routes.map((route, routeIndex) => (
            <BarItem
              key={route.key}
              index={routeIndex}
              route={route}
              interpolate={itemInterpolate}
              onLayouts={onItemLayouts}
              jumpTo={jumpTo}
            />
          ))
        }
        {indicator}
      </Container>
    )
  }

  return memo(Bar)
}
