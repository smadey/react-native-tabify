import React from 'react'
import {
  View,
} from 'react-native'

import { NormalTabify } from '../tabify'

function NormalScreen() {
  return (
    <NormalTabify.Tabs>
      <NormalTabify.Tab name="tab1" title="Tab 1" subTitle="subtitle" badge={8}>
        <View style={{ backgroundColor: '#f00', flex: 1 }} />
      </NormalTabify.Tab>
      <NormalTabify.Tab name="tab2" title="Tab 2" badge={8}>
        <View style={{ backgroundColor: '#0f0', flex: 1 }} />
      </NormalTabify.Tab>
      <NormalTabify.Tab name="tab3" title="Tab 3" subTitle="tab3 subtitle" badge={99}>
        <View style={{ backgroundColor: '#00f', flex: 1 }} />
      </NormalTabify.Tab>
    </NormalTabify.Tabs>
  )
}

NormalScreen.navigationOptions = {
  title: 'Normal Demo',
}

export default NormalScreen
