import React from 'react';
import { StyleSheet, View, Platform } from 'react-native';
import { BarComponent, Title } from './Styles';

export default class ToolBar extends React.Component {
    constructor(props){
        super(props);
    }
    
    render(){  
        return (
            <BarComponent style={[styles.navBar, Platform.OS!=='web'?{height:75, paddingTop:20}:{height:65}]}>  
                <View style={styles.leftContainer}>
                    {this.props.myLeftContainer}      
                </View>
                                  
                <Title style={styles.middleContainer}>
                    {this.props.title}
                </Title>
                
                <View style={styles.rightContainer}>
                    {this.props.myRightContainer}
                    {this.props.complement}
                </View>                
            </BarComponent>
        );
  }
}

const styles = StyleSheet.create({
  navBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomWidth: 0,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2},
        shadowOpacity: 0.8,
        shadowRadius: 4,
        elevation: 1
  },
  
  leftContainer: {
        justifyContent: 'flex-start',
        flexDirection: 'row'
  },
  middleContainer: {
        flex: 2,
        flexDirection: 'row',
        fontSize: 18,
        marginLeft: 10,
        marginRight: 10          
  },
  rightContainer: {
        flex:1,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center'        
  }
});
