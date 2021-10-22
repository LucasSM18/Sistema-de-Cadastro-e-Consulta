import React from 'react';
import { StyleSheet, TouchableOpacity, View, Platform } from 'react-native';
import { BarComponent, SearchView, Search, Icons_FontAwesome, Icons_entypo } from './Styles';


export default class SearchBar extends React.Component {
    constructor(props){
        super(props);
        this.state = { result: '', hasSupport: true };           
    }  

    eraseAll = () => {
        this.setState({result:''});
    }

    render(){
        return (
        <BarComponent style={[styles.navBar, Platform.OS!=='web'?{height:75, paddingTop:20}:{height:54}]}> 
            <View style={styles.leftContainer}>               
                {this.props.leftComponent}
            </View>                 
            <SearchView style={styles.rightContainer}>               
                <Search
                    style={[styles.searchStyle, Platform.OS==='web'?{ outline:'none' }:null]}
                    placeholderTextColor={this.props.placeholderTextColor}     
                    placeholder="Pesquisar..." 
                    autoFocus={true}
                    onChangeText={text => this.setState({result: text}, () => {
                        if(this.props.onChange) this.props.onChange(this.state.result)
                    })}
                    value={this.state.result}
                />

                <TouchableOpacity onPress={this.eraseAll} style={{ display:this.state.result?'flex':'none' }}>
                    <Icons_entypo size={25} name="cross"/>
                </TouchableOpacity>
                
                <TouchableOpacity style={[{ paddingLeft:16 },{ display:this.state.hasSupport?'flex':'none' }]}>   
                    <Icons_FontAwesome size={25} name="microphone"/>
                </TouchableOpacity>
            </SearchView>
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
        elevation: 1,
        paddingHorizontal:5,
        paddingRight:15,
    },
    
    leftContainer: {
        flex:Platform.OS==='web'?0.3:1.5,
        resizeMode: 'contain',
        padding: 15,
        alignItems: 'center',
    },

    rightContainer: {
        flex:15,
        padding: 15,
        flexDirection: 'row',
        justifyContent:'space-between',
        alignItems:'center',
        height:40,
        borderRadius:20,
        paddingHorizontal:15
    },
    
    searchStyle: {
        flex:3,
        height:33, 
    }
});
