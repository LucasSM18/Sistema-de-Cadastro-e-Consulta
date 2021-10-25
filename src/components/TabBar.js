import * as React from 'react';
import Themes from '../themes/Themes';
import { Icon } from 'react-native-elements';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { View, TouchableOpacity } from 'react-native';

const Tab = createMaterialTopTabNavigator();

const CustomAddButtom = function(props) {
    return(
        <TouchableOpacity
            style={{
                bottom:'3%',
                alignSelf:'center',
                position:'absolute',
                backgroundColor:props.backColor,
                borderRadius:30,
                width:60,
                height:60,
                display:'flex'
            }}
            onPress={() => {props.navigation.navigate(props.route)}}
        >              
           <Icon size={60} name="pluscircle" type="antdesign" color={props.badgeColor}/> 
        </TouchableOpacity>
    )
}

export default class TabBar extends React.Component { 
    constructor(props){
        super(props);
        let tab = [];
        if(this.props.name.length === this.props.route.length){
            let i = this.props.name.length;
            while(i--){
                tab.push({ 
                    name: this.props.name[i], 
                    route: this.props.route[i],
                    type: this.props.type, 
                    icon: this.props.icon[i],
                    iconOnFocus: this.props.iconOnFocus!==undefined?this.props.iconOnFocus[i]:this.props.icon[i]
                });
            }
        }
        this.state = { tab }
    }    

    render() {         
        const Theme = Themes[this.props.theme]  
        return (       
            <View style={{flex: 1, backgroundColor: Theme.barComponent}}>
                <Tab.Navigator 
                    initialRouteName={this.props.name[-1]}
                    tabBarPosition="bottom"
                    screenOptions={{
                        tabBarStyle: {backgroundColor: 'transparent'},
                        tabBarPressColor: Theme.color,
                        tabBarActiveTintColor: Theme.color,   
                        tabBarInactiveTintColor: Theme.subColor                                                
                    }}
                >{      
                    this.state.tab.map((elements, index) =>(
                        <Tab.Screen
                            key={index} 
                            name={elements.name} 
                            options={{
                                tabBarIcon: ({focused}) => (
                                    <Icon
                                        type={elements.type}
                                        name={focused === true ? elements.iconOnFocus : elements.icon} 
                                        size={25} 
                                        color={focused === true ? Theme.color : Theme.subColor}
                                        active={focused} 
                                    />
                                ),
                            }}
                        >
                            {() => 
                                this.props.filter? (
                                    <elements.route filter={this.props.filter}/>
                                ):(
                                    <elements.route/>
                                )
                            }
                        </Tab.Screen>                      
                    ))                     
                }</Tab.Navigator>

                {this.props.customButtomRoute?(
                    <CustomAddButtom 
                        badgeColor={Theme.badge} 
                        backColor={Theme.badgeItem} 
                        navigation={this.props.navigation}
                        route={this.props.customButtomRoute}
                    />
                ):null}
            </View>            
        );
    }
}

