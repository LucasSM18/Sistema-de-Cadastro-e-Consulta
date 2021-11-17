import * as React from 'react';
import { BarComponent } from './Styles';
import { Icon } from 'react-native-elements';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Collapse, CollapseHeader, CollapseBody } from 'accordion-collapse-react-native';


export default class CardFactory extends React.Component {
    constructor(props){
        super(props);
        this.icon = {'up': 'caret-up', 'down': 'caret-down'};
        this.state = { expanded: false };           
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
                        <View style={{flexDirection:'row', marginVertical:10, justifyContent:'space-between', width:120}}>
                            {this.props.editableRoute?
                                <TouchableOpacity 
                                    onPress={() => 
                                        this.props.editableRoute.navigate('Editar', 
                                        {
                                            title:this.props.name,
                                            group:this.props.complement,
                                            lyrics:this.props.content,
                                            link:this.props.link
                                        })
                                    }
                                >
                                    
                                    <Text style={styles.link}>Editar</Text>
                                </TouchableOpacity>
                                :
                                null
                            }
                            {this.props.link?
                                <TouchableOpacity>                                    
                                    <Text style={styles.link}>Youtube</Text>
                                </TouchableOpacity>
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
        fontSize:17, 
        fontWeight:'bold', 
        textDecorationLine: 'underline'
    }
})