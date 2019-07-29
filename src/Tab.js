import React, {
  memo,
  useCallback,
} from 'react'

export function createTab() {
  function Tab({ component, render, children, ...props }) {
    return component
      ? React.createElement(component, props)
      : render
        ? render(props)
        : children
          ? typeof children === 'function'
            ? children(props)
            : React.Children.only(children)
          : null
  }
  return memo(Tab)
}

export function createScene() {
  function Scene({ tab, route, renderTabScroller }) {
    const key = route.key

    return React.cloneElement(tab, {
      renderScrollComponent: useCallback(props => renderTabScroller({ ...props, tabKey: key }), [key]),
    })
  }

  return memo(Scene)
}
