# react-native-tabify
Easy to create multi-style tabs for React Native

## Installation
`$ npm install --save react-native-tabify`

## Usage

```js
import Tabify from 'react-native-tabify'

const NewTabify = Tabify.create({ ... })

function Component() {
  return (
    <NewTabify.Tabs>
      <NewTabify.Tab name="tab1" title="Tab 1">
        <View style={{ backgroundColor: '#f00', flex: 1 }} />
      </NewTabify.Tab>
      <NewTabify.Tab name="tab2" title="Tab 2">
        <View style={{ backgroundColor: '#0f0', flex: 1 }} />
      </NewTabify.Tab>
      <NewTabify.Tab name="tab3" title="Tab 3">
        <View style={{ backgroundColor: '#00f', flex: 1 }} />
      </NewTabify.Tab>
    </NewTabify.Tabs>
  )
}
```

## Properties

#### BarItem
| Prop | Description | Default |
|---|---|---|
|**`TouchableItem`**|A touchable component for bar item. |`TouchableOpacity`|
|**`styles`**|A styles object or function which return styles object, styles object has `container`、`content`、`title`、`subTitle`、`activeTitle`、`badgeWrapper`、`badge`、`badgeTxt` keys. ||
|**`isNeedContainerLayout`**|Whether need barItem container layout. |`isShowIndicator || isScrollable`|
|**`isNeedContentLayout`**|Whether need barItem content layout. |`isShowIndicator || (is contentLayout used in barIndicator option)`|
|**`isIgnoreLayoutChange`**|Whether ignore layout change. |`isScrollable`|

#### BarIndicator
| Prop | Description | Default |
|---|---|---|
|**`styles`**|A styles object or function which return styles object, styles object has `container` keys. ||
|**`getWidth`**|A function that is called when get interpolate outputRange of `indicator width`. The function is called with a `layouts` argument. |`layouts => layouts.map(d => d.container.width)`|
|**`getOffset`**|A function that is called when get interpolate outputRange of `indicator offset`. The function is called with a `layouts` argument. |`getOffset = layouts => layouts.map((d, i) => (d.container.x + (d.container.width - getWidth(layouts)[i]) / 2))`|
|**`render`**|The indicator render function. |`props => <Animated.View pointerEvents="none" {...props} />`|

#### Bar
| Prop | Description | Default |
|---|---|---|
|**`BarItem`**|The bar item component. |`Tabify.BarItem`|
|**`BarIndicator`**|The bar indicator component. |`Tabify.BarIndicator`|
|**`styles`**|A styles object or function which return styles object, styles object has `scroller`、`container` keys. ||
|**`isScrollable`**|Whether bar scrollable. ||
|**`isShowIndicator`**|Whether show bar indicator. ||
|**`wrapper`**|The wrapper function of bar. ||

#### Tab
| Prop | Description | Default |
|---|---|---|

#### Scene
| Prop | Description | Default |
|---|---|---|
|**`render`**|The scene render function. |`props => props.defaultRender()`|

#### Pager
| Prop | Description | Default |
|---|---|---|

#### Tabs
| Prop | Description | Default |
|---|---|---|
|**`Bar`**|The bar component. |`Tabify.Bar`|
|**`Scene`**|The scene component. |`Tabify.Scene`|
|**`Pager`**|The pager component. |`Tabify.Pager`|
|**`styles`**|A styles object or function which return styles object, styles object has `container` keys. ||

#### Container
| Prop | Description | Default |
|---|---|---|
|**`Tabs`**|The tabs component. |`Tabify.Tabs`|

