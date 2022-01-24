import * as React from 'react';
import { BarComponent, CustomView } from './Styles';
import { Icon } from 'react-native-elements';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { TouchableOpacity, ActivityIndicator } from 'react-native';

import { collection,  getDocs } from 'firebase/firestore'
import firebaseConnection from '../services/firebaseConnection'


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
        this.favdb = []
        this.updateFunc = this.props.updateFunc
        const tab = [];
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
      
        this.state = { tab, loaded: false, favs: []}
    }    

    getFavoritosFromDB = async()=> {
        this.setState({...this.state, loaded: false})
        const favoritos = await this.props.getFavoritosList()   
        const listOfFavoritos = favoritos.map(favorito=>favorito.id)
        const favoritosFromDB = []
        const louvoresSnap = await getDocs(collection(firebaseConnection.db, 'louvores'))
        const louvoresFromDb = []
        louvoresSnap.forEach(louvor=> {
            louvoresFromDb.push({id:louvor.id, ...louvor.data()})
        })    
        

        listOfFavoritos.forEach(id=> {

            const data = louvoresFromDb.filter(louvor=> 
                louvor.id == id
            )

            if (data.length) favoritosFromDB.push(...data)

        })
       
        this.setState({...this.state, loaded: true, favs: favoritosFromDB })
        
    }
    

    componentDidMount() {
        console.log('mounted')        
        const load = async( )=> {
        try {
            await this.getFavoritosFromDB()
            await this.updateFunc()
        }
        catch(err) {
            console.log(err)
            }
        }                
       load()
    }

    

    render() {         
        return this.state.loaded ? (
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
                                    <elements.route louvores={this.props.louvores} setLouvores={this.props.setLouvores} filter={this.props.filter} favoritos={this.state.favs}/>
                                ):(
                                    <elements.route louvores={this.props.louvores} favoritos={this.state.favs}/>
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
        ) : ( 
            <CustomView style={{flex:1, justifyContent: "center"}}>
                <ActivityIndicator size={100} color="#191919" />        
            </CustomView>
        )
    }
}

