import * as React from 'react';
import { BarComponent } from './Styles';
import { Icon } from 'react-native-elements';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { TouchableOpacity } from 'react-native';

const Tab = createMaterialTopTabNavigator();

const CustomAddButtom = function(props) {
    return(
        <TouchableOpacity
            style={{
                bottom:20,
                alignSelf:'center',
                position:'absolute',
                borderRadius:30,
                width:60,
                height:60,
                display:'flex'
            }}
            onPress={() => {props.navigation.navigate(props.route, {addLouvor: props.addLouvor})}}
        >              
           <Icon size={60} name="pluscircle" type="antdesign" color='#cccccc'/> 
        </TouchableOpacity>
    )
}

export default class TabBar extends React.Component { 
    constructor(props){
        super(props);
        this.props.updateFavoritos()
        let tab = [];
        if(this.props.name.length === this.props.route.length){
            let i = this.props.name.length;
            while(i--){
                tab.push({ 
                    name: this.props.name[i], 
                    route: this.props.route[i],
                    icon: this.props.icon[i],
                    iconOnFocus: this.props.iconOnFocus!==undefined?this.props.iconOnFocus[i]:this.props.icon[i]
                });
            }
        }
        this.state = { tab }
    }    

    render() {         
        return (       
            <BarComponent style={{flex: 1}}>
                <Tab.Navigator 
                    initialRouteName={this.props.name[-1]}
                    tabBarPosition="bottom"
                    screenOptions={{
                        tabBarStyle: {backgroundColor: 'transparent'},
                        tabBarPressColor: '#fff',
                        tabBarActiveTintColor: '#fff',   
                        tabBarInactiveTintColor: '#a6a6a6',  
                        swipeEnabled: !this.props.disable                                      
                    }}
                    screenListeners={
                        this.props.disable?{
                            tabPress: e => {
                                // Prevent default action
                                e.preventDefault();
                            },
                        }:null
                    }
                >{      
                    this.state.tab.map((elements, index) =>(
                        <Tab.Screen
                            key={index} 
                            name={elements.name}
                            options={{  
                                tabBarIcon: ({focused}) => (
                                    <Icon
                                        type={this.props.type}
                                        name={focused === true ? elements.iconOnFocus : elements.icon} 
                                        size={25} 
                                        color={focused === true ? '#fff' : '#a6a6a6'}
                                        active={focused} 
                                    />
                                ),
                                
                            }}
                        >
                            {() => 
                                this.props.filter? (
                                    <elements.route louvores={this.props.louvores} setLouvores={this.props.setLouvores} filter={this.props.filter} favoritos={this.props.favoritos}/>
                                ):(
                                    <elements.route louvores={this.props.louvores} favoritos={this.props.favoritos}/>
                                )
                            }
                        </Tab.Screen>                      
                    ))                     
                }</Tab.Navigator>

                {this.props.customButtomRoute&&
                    <CustomAddButtom 
                        addLouvor={this.props.addLouvor}
                        navigation={this.props.navigation}
                        route={this.props.customButtomRoute}
                    />
                }
            </BarComponent>            
        );
    }
}

