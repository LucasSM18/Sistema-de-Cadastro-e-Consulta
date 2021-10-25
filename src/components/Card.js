import * as React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Title, Font , Subfont, Icons_FontAwesome5, Icons_entypo, BarComponent } from './Styles';
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
                            <Title>{this.props.name}</Title>
                            <Subfont>{this.props.complement}</Subfont>
                        </View> 
                              
                        <TouchableOpacity>
                            <Icons_entypo size={25} name="controller-play"/>    
                        </TouchableOpacity>                               
                    </CollapseHeader>      

                    <CollapseBody 
                        style={{
                            flexDirection:'row',
                            paddingHorizontal:20
                        }}
                    >
                        <Font>{this.props.content}</Font>
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
                    <Icons_FontAwesome5 size={25} name={icon}/>
                </TouchableOpacity>       
            </BarComponent>            
               
        )
    }
}