import * as React from 'react';
import { BarComponent } from './Styles';
import { Icon } from 'react-native-elements';
import { WebView } from 'react-native-webview';
import { StyleSheet, Alert, View, Modal, Text, Linking, TouchableOpacity, Keyboard } from 'react-native';
import { Collapse, CollapseHeader, CollapseBody } from 'accordion-collapse-react-native';


export default class CardFactory extends React.Component {
    constructor(props){
        super(props);
        this.icon = {'up': 'caret-up', 'down': 'caret-down'};
        this.state = { expanded: false, showWebView: false };          
        this.url = `https://www.youtube.com/results?search_query=${props.name}+${props.complement}`
        
    }  

    stringFormat = (string) => {
        if(string==='GL Adolescentes') return `drops-gl-adolescentes`
        return string.toLowerCase().replace(/\'|\?/g, '').replace(/ /g, '-').replace(/í/g,'i').replace(/é/g,'e');
    }

    renderWebView() {
        return (
            this.state.showWebView&&
            <Modal
                animationType={'slide'}
                visible={this.state.showWebView}
                onRequestClose={() => this.setState({showWebView: false})}
                transparent
            >
                <WebView
                    source={{
                    uri: this.props.cifraUrl,
                    }}
                    style={{ flex:1 }}
                />
            </Modal>
        );
    }

    youtubeHandler = async () => {         
            const supported = await Linking.canOpenURL(this.url);
            //
            if(supported) await Linking.openURL(this.url);
            else Alert.alert('Link inácessivel! Por favor entre em contato com o administrador');       
    }

    onToggleHandler = async (expanded) => {
        this.setState({expanded: expanded})
        Keyboard.dismiss()
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
                {this.renderWebView()}
                <Collapse 
                    isExpanded={this.state.expanded} 
                    onToggle={(isExpanded) => this.onToggleHandler(isExpanded)}
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
                              
                        {this.props.caretFunction &&
                            <TouchableOpacity onPress={() => this.props.caretFunction(this.props)&&Keyboard.dismiss()}>
    
                                <Icon
                                    name={this.props?.add ? 'add' : 'playlist-music-outline'}
                                    type={this.props?.add ? 'material' : 'material-community'}
                                    color='#a6a6a6'
                                    size={25}
                                />  
                            </TouchableOpacity>
                        }                               
                    </CollapseHeader>      

                    <CollapseBody 
                        style={{
                            paddingHorizontal:30
                        }}
                    >
                        <View style={{flexDirection:'row', marginVertical:20}}>
                            <Text style={styles.linkContainer}>
                                (
                                    <TouchableOpacity onPress={this.youtubeHandler}>                                    
                                        <Text style={styles.link}>Youtube</Text>
                                    </TouchableOpacity>
                                )
                            </Text>

                            <Text style={styles.linkContainer}>
                                (
                                    <TouchableOpacity onPress={() => this.setState({showWebView: true})}>                                    
                                        <Text style={styles.link}>Cifras</Text>
                                    </TouchableOpacity>
                                )
                            </Text>
                                    
                            {this.props.keyID&&this.props.editableRoute&&
                                <Text style={styles.linkContainer}>
                                    (
                                        <TouchableOpacity 
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
                                        </TouchableOpacity>
                                    )
                                </Text>  
                            }

                            {this.props.keyID&&this.props.deleteLouvor&&
                                <Text style={styles.linkContainer}>
                                    (
                                        <TouchableOpacity 
                                            onPress={()=> {
                                                this.props.deleteLouvor(this.props.keyID, this.props.name)
                                            }}
                                        >                                    
                                            <Text style={styles.link}>Remover</Text>
                                        </TouchableOpacity>
                                    )
                                </Text>                                      
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