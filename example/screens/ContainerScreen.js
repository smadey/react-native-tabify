import React from 'react'
import {
  FlatList,
  SectionList,
  Text,
  View,
} from 'react-native'

import { NormalTabify } from '../tabify'

function fetchData({ offset, limit }) {
  if (!offset) {
    offset = 0
  }
  if (!limit) {
    limit = 20
  }
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        code: 0,
        data: Array.from({ length: limit }).map((item, index) => ({
          id: offset + index,
          desc: `Row ${offset + index + 1}`,
          group: `Group ${offset / limit + 1}`,
        })),
      })
    }, 500)
  })
}

function useList() {
  const state = React.useMemo(() => ({ offset: 0 }), [])

  const [items, setItems] = React.useState(() => [])

  const renderItem = React.useCallback(({ item }) => {
    return (
      <View style={{ height: 50, justifyContent: 'center', paddingHorizontal: 16 }}>
        <Text>{item.desc}</Text>
      </View>
    )
  }, [])

  const keyExtractor = React.useCallback((item, index) => {
    return String(index == null ? item.title : item.id)
  }, [])

  const onEndReached = React.useCallback(() => {
    if (state.loading) return
    state.loading = true
    fetchData({ offset: state.offset }).then(({ data }) => {
      state.loading = false
      state.offset += data.length
      setItems(oldItems => oldItems.concat(data))
    })
  }, [])

  React.useEffect(() => {
    onEndReached()
  }, [])

  return {
    style: { backgroundColor: '#fff', flex: 1 },
    items,
    renderItem,
    keyExtractor,
    onEndReached,
    onEndReachedThreshold: 0.25,
  }
}

function FlatListExample({ renderScrollComponent }) {
  const { items, ...props } = useList()

  return (
    <FlatList
      {...props}
      renderScrollComponent={renderScrollComponent}
      data={items}
    />
  )
}
FlatListExample = React.memo(FlatListExample)

function SectionListExample({ renderScrollComponent }) {
  const { items, ...props } = useList()

  const sections = React.useMemo(() => {
    const arr = []
    let section

    items.forEach((item) => {
      if (!section || item.group !== section.title) {
        section = {
          title: item.group,
          data: [],
        }
        arr.push(section)
      }

      section.data.push(item)
    })

    return arr
  }, [items])

  const renderSectionHeader = React.useCallback(({ section }) => {
    return (
      <View style={{ backgroundColor: '#eee', padding: 16, paddingBottom: 6 }}>
        <Text>{section.title}</Text>
      </View>
    )
  }, [])

  return (
    <SectionList
      {...props}
      renderScrollComponent={renderScrollComponent}
      sections={sections}
      renderSectionHeader={renderSectionHeader}
    />
  )
}
SectionListExample = React.memo(SectionListExample)

function Header() {
  return <View style={{ borderWidth: 5, height: 160 }} />
}
Header = React.memo(Header)

function ScrollerDemo() {
  return (
    <NormalTabify.Container HeaderComponent={Header}>
      <NormalTabify.Tab title="Flat List" component={FlatListExample} />
      <NormalTabify.Tab title="Section List" lazy>
        {
          ({ renderScrollComponent }) => <SectionListExample renderScrollComponent={renderScrollComponent} />
        }
      </NormalTabify.Tab>
    </NormalTabify.Container>
  )
}
ScrollerDemo = React.memo(ScrollerDemo)

export default ScrollerDemo
