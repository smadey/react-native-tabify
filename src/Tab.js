import React, {
  memo,
  useState,
  useCallback,
  useEffect,
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

export function createScene({ render }) {
  if (!render) {
    render = props => props.defaultRender()
  }

  function Scene({ tab, route, focused, jumpTo, renderTabScroller }) {
    const key = route.key
    const renderScrollComponent = useCallback(props => renderTabScroller({ ...props, tabKey: key }), [key])

    return render({
      focused,
      defaultRender() {
        return React.cloneElement(tab, {
          // 需要什么这里添加一下，不要把 props 全部传过去，不然会导致 rerender
          jumpTo,
          renderScrollComponent,
        })
      },
    })
  }

  function LazyableScene(props) {
    const willVisible = props.focused || !props.route.lazy
    const [visible, setVisible] = useState(willVisible)
    useEffect(() => {
      if (willVisible && !visible) {
        setVisible(true)
      }
    }, [willVisible || visible])
    return visible ? <Scene {...props} /> : null
  }

  return memo(LazyableScene)
}
