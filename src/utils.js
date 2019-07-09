import { useMemo } from 'react'
import { StyleSheet } from 'react-native'

function is(x, y) {
  // eslint-disable-next-line no-self-compare
  return (x === y && (x !== 0 || 1 / x === 1 / y)) || (x !== x && y !== y)
}
export function shallowEqual(objA, objB) {
  if (is(objA, objB)) {
    return true
  }

  if (typeof objA !== 'object' || objA === null || typeof objB !== 'object' || objB === null) {
    return false
  }

  const keysA = Object.keys(objA)
  const keysB = Object.keys(objB)

  if (keysA.length !== keysB.length) {
    return false
  }

  let i
  for (i = 0; i < keysA.length; i++) {
    if (!Object.prototype.hasOwnProperty.call(objB, keysA[i]) || !is(objA[keysA[i]], objB[keysA[i]])) {
      return false
    }
  }

  return true
}

export function createUseStyles(styles) {
  if (Array.isArray(styles)) {
    const [styles1Options, styles2Options] = styles
    const useStyles1 = createUseStyles(styles1Options)
    const useStyles2 = createUseStyles(styles2Options)
    return () => {
      const styles1 = useStyles1()
      const styles2 = useStyles2()
      return useMemo(() => {
        const mergedStyles = { ...styles1 }
        Object.keys(styles2).forEach((key) => {
          const style1 = styles1[key]
          const style2 = styles2[key]
          mergedStyles[key] = style1 ? [style1, style2] : style2
        })
        return mergedStyles
      }, [styles1, styles2])
    }
  }
  if (typeof styles === 'function') {
    return styles
  }
  styles = (styles && StyleSheet.create(styles)) || {}
  return () => styles
}

export function combineAnimatedStyle(style, activeStyle, getAnimatedValue) {
  if (!style) return null
  if (!activeStyle) return style

  const styleObj = StyleSheet.flatten(style)
  const activeStyleObj = StyleSheet.flatten(activeStyle)
  const animatedStyle = {}
  Object.keys(activeStyleObj).forEach((key) => {
    const value = styleObj[key]
    if (styleObj[key]) {
      animatedStyle[key] = getAnimatedValue(value, activeStyleObj[key])
    }
  })
  return [style, animatedStyle]
}

export function isSameLayout(layout1, layout2, keys) {
  if (!layout1 || !layout2) {
    return false
  }
  let key
  // eslint-disable-next-line no-cond-assign
  while (key = keys.pop()) {
    if (Math.round(layout1[key]) !== Math.round(layout2[key])) {
      return false
    }
  }
  return true
}
