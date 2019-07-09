import React from 'react'
import {
  View,
} from 'react-native'

import { ScrollableTabify } from '../tabify'

function ScrollableScreen() {
  return (
    <ScrollableTabify.Tabs>
      <ScrollableTabify.Tab name="tab1" title="Tab 1">
        <View style={{ backgroundColor: '#000', flex: 1 }} />
      </ScrollableTabify.Tab>
      <ScrollableTabify.Tab name="tab2" title="Tab 2">
        <View style={{ backgroundColor: '#f00', flex: 1 }} />
      </ScrollableTabify.Tab>
      <ScrollableTabify.Tab name="tab3" title="Tab 3">
        <View style={{ backgroundColor: '#0f0', flex: 1 }} />
      </ScrollableTabify.Tab>
      <ScrollableTabify.Tab name="tab4" title="Tab 4">
        <View style={{ backgroundColor: '#00f', flex: 1 }} />
      </ScrollableTabify.Tab>
      <ScrollableTabify.Tab name="tab5" title="Tab 5">
        <View style={{ backgroundColor: '#ff0', flex: 1 }} />
      </ScrollableTabify.Tab>
      <ScrollableTabify.Tab name="tab6" title="Tab 6">
        <View style={{ backgroundColor: '#f0f', flex: 1 }} />
      </ScrollableTabify.Tab>
      <ScrollableTabify.Tab name="tab7" title="Tab 7">
        <View style={{ backgroundColor: '#0ff', flex: 1 }} />
      </ScrollableTabify.Tab>
      <ScrollableTabify.Tab name="tab8" title="Tab 8">
        <View style={{ backgroundColor: '#fff', flex: 1 }} />
      </ScrollableTabify.Tab>
    </ScrollableTabify.Tabs>
  )
}

ScrollableScreen.navigationOptions = {
  title: 'Scrollable Demo',
}

export default ScrollableScreen
