import React from 'react'
import { Button, StyleSheet, View } from 'react-native'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
})

function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Button title="Normal" onPress={() => navigation.navigate('Normal')} />
      <Button title="Scrollable" onPress={() => navigation.navigate('Scrollable')} />
      <Button title="Container" onPress={() => navigation.navigate('Container')} />
    </View>
  )
}

HomeScreen.navigationOptions = {
  title: 'Homepage',
}

export default HomeScreen
