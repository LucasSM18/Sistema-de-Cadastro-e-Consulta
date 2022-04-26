import React from 'react';
import { Icon } from 'react-native-elements';
import { StyleSheet, ActivityIndicator, TouchableOpacity, View, Platform } from 'react-native';
import { BarComponent, SearchContainer, Searchbar } from './Styles';


export default class SearchBar extends React.Component {
    constructor(props){
        super(props);
        this.input = null;
        this.state = { result: '' };           
    }  

    eraseAll = async () => {
        this.setState({result:''});
        this.input.focus();
        this.props.onChange('');
    }

    render(){
        return(
            <BarComponent style={[styles.navBar, Platform.OS!=='web'?{height:75, paddingTop:20}:{height:65}]}> 
                {
                    this.props.leftComponent &&(
                        <View style={styles.leftContainer}>               
                            {this.props.leftComponent}
                        </View>
                    )
                }
                 
                <SearchContainer style={styles.rightContainer}>               
                    <Searchbar
                        style={styles.searchStyle}
                        placeholderTextColor='#a6a6a6'     
                        placeholder="Pesquisar..." 
                        selectionColor='#fff'
                        autoFocus={true} 
                        ref={(input) => {this.input = input}}
                        onChangeText={text => this.setState({result: text}, () => {
                            if(this.props.onChange) this.props.onChange(this.state.result)
                        })}
                        value={this.state.result}
                    />

                    {this.props.search ?
                        <TouchableOpacity style={{ display:this.state.result?'flex':'none' }} onPress={this.eraseAll}>
                            <Icon
                                name='cross' 
                                type='entypo'
                                color='#a6a6a6'
                                size={25}
                            />
                        </TouchableOpacity>     
                    :
                        <ActivityIndicator style={{ display:this.state.result?'flex':'none' }} size={25} color="#a6a6a6"/>                   
                    }
                </SearchContainer>
            </BarComponent>
        )
    }
}

const styles = StyleSheet.create({
    navBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomWidth: 0,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 4,
        height:75,
        elevation: 1,
        paddingHorizontal:5,
        paddingRight:15,
    },
    
    leftContainer: {
        flex:-1,
        resizeMode: 'contain',
        padding: 15,
        alignItems: 'center',
    },

    rightContainer: {
        flex:1,
        flexDirection: 'row',
        justifyContent:'space-between',
        alignItems:'center',
        height:40,
        borderRadius:20,
        paddingHorizontal:15
    },
    
    searchStyle: {
        flex:3,
        height:33
    }
});
