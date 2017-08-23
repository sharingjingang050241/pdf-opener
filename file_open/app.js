import React, { Component } from 'react';
import { StackNavigator, TabNavigator, TabBarBottom } from 'react-navigation';
import Pdf_View from './pdf_view';
import IndexPage from './index_page';

const Tab = TabNavigator(
    {
        Index: {
            screen: IndexPage,
            navigationOptions: ({ navigation }) => ({
                tabBarLabel: 'IndexPage',
            }),
        },
    },
    {
        tabBarComponent: TabBarBottom,
        tabBarPosition: 'bottom',
        swipeEnabled: false,
        animationEnabled: false,
        lazy: true,
        tabBarOptions: {
            activeTintColor: '#06c1ae',
            inactiveTintColor: '#979797',
            style: { backgroundColor: '#ffffff', },
            labelStyle: {
                fontSize: 15, // 文字大小  
            },
        }
    }
);
const Navigator = StackNavigator(  
    
  {  
    IndexPage:{screen:IndexPage},  
    Pdf_View:{screen:Pdf_View},
  },  
  {  
    navigationOptions:{  
      headerTintColor:'#FF8247',  
      showIcon:true,  
        headerMode:'screen',
        mode:'card',  
    }
  })
export default class App extends Component {
    render() {
        return (
            <Navigator/>
        )
    }
}
