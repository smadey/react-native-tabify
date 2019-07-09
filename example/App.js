import { createStackNavigator, createAppContainer } from 'react-navigation'

import HomeScreen from './screens/HomeScreen'
import NormalScreen from './screens/NormalScreen'
import ScrollableScreen from './screens/ScrollableScreen'
import ContainerScreen from './screens/ContainerScreen'

const MainNavigator = createStackNavigator({
  Home: { screen: HomeScreen },
  Normal: { screen: NormalScreen },
  Scrollable: { screen: ScrollableScreen },
  Container: { screen: ContainerScreen },
})

const App = createAppContainer(MainNavigator)

export default App
