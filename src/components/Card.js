import * as React from 'react';
import { BarComponent } from './Styles';
import { Icon } from 'react-native-elements';
import { StyleSheet, Alert, View, Text, Linking, TouchableOpacity } from 'react-native';
import { Collapse, CollapseHeader, CollapseBody } from 'accordion-collapse-react-native';


export default class CardFactory extends React.Component {
    constructor(props){
        super(props);
        this.icon = {'up': 'caret-up', 'down': 'caret-down'};
        this.state = { expanded: false };          
        this.url = "https://www.youtube.com/results?search_query="+props.name+"+"+props.complement
        
    }  

    youtubeHandler = async () => {         
            const supported = await Linking.canOpenURL(this.url);
            //
            if(supported) await Linking.openURL(this.url);
            else Alert.alert('Link inácessivel! Por favor entre em contato com o administrador');       
    }


    render(){          
        let icon = this.icon['down'];
        if(this.state.expanded) icon = this.icon['up'];
        return(           
            <BarComponent 
                style={{
                    borderRadius:10, 
                    margin:15, 
                    marginBottom:1
                }}
            >     
                <Collapse 
                    isExpanded={this.state.expanded} 
                    onToggle={(isExpanded) => this.setState({expanded: isExpanded})}
                    style={{ 
                        backgroundColor: 'transparent'
                    }}
                >
                    <CollapseHeader 
                        style={{
                            flexDirection:'row', 
                            justifyContent:'space-between',
                            alignItems:'center',
                            padding:10
                        }}
                    >
                        <View style={{flex:1}}>
                            <Text style={{ color:'#fff', fontSize:18 }}>{this.props.name}</Text>
                            <Text style={{ color:'#a6a6a6' }}>{this.props.complement}</Text>
                        </View> 
                              
                        <TouchableOpacity>
                            <Icon
                                name='controller-play'
                                type='entypo'
                                color='#a6a6a6'
                                size={25}
                            />  
                        </TouchableOpacity>                               
                    </CollapseHeader>      

                    <CollapseBody 
                        style={{
                            paddingHorizontal:30
                        }}
                    >
                        <View style={{flexDirection:'row', marginVertical:20}}>
                            <Text style={styles.linkContainer}>(
                                <TouchableOpacity onPress={this.youtubeHandler}>                                    
                                    <Text style={styles.link}>Youtube</Text>
                                </TouchableOpacity>
                            )</Text>
                               

                            {this.props.editableRoute&&this.props.keyID?
                               <Text style={styles.linkContainer}> 
                                    (<TouchableOpacity 
                                        onPress={() => 
                                            this.props.editableRoute.navigate('Editar', 
                                            {
                                                id:this.props.keyID,
                                                title:this.props.name,
                                                group:this.props.complement,
                                                lyrics:this.props.content,
                                                link:this.props.link,
                                                updateLouvor: this.props.updateLouvor
                                            })
                                        }
                                    >                                    
                                        <Text style={styles.link}>Editar</Text>                                    
                                    </TouchableOpacity>)

                                    (<TouchableOpacity 
                                    onPress={()=> {
                                        this.props.deleteLouvor(this.props.keyID, this.props.name)
                                    }
                                    }>                                    
                                        <Text style={styles.link}>Remover</Text>
                                    </TouchableOpacity>)
                                </Text>
                                :
                                null
                            }
                            
                           
                        </View>
                        
                        <Text style={{ color:'#fff' }}>{this.props.content}</Text>
                    </CollapseBody>                          
                </Collapse>

                <TouchableOpacity 
                    onPress={() => this.setState({expanded: !this.state.expanded})}
                    style={{
                        alignItems:'center',
                        justifyContent:'center',
                        flexDirection:'row'
                    }}
                >
                    <Icon
                        name={icon} 
                        type='font-awesome-5'
                        color='#a6a6a6'
                        size={25}
                    />
                </TouchableOpacity>       
            </BarComponent>            
               
        )
    }
}

const styles = StyleSheet.create({
    link: {
        color:'#00ffff', 
        fontWeight:'bold', 
        textDecorationLine: 'underline'
    },

    linkContainer:{
        color:'#fff', 
        fontSize:17,
        marginRight:5
    }
})