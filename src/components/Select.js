import React, { useState, useEffect, useCallback } from 'react';
import Themes from '../themes/Themes';
import { Icon } from 'react-native-elements';
import { useColorScheme } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';


export default function CustomSelect(props) {
    const deviceTheme = useColorScheme();
    const theme = Themes[deviceTheme]||Themes.light;
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(null);
    const [items, setItems] = useState(props.options);
    const defaultDropDownHeight = props.dropDownheight||190;   

    useEffect(() => {
        if(props.handler){ 
            setOpen(false);
            props.onPress(false)
        }
    },[props.handler])

    return(        
        <DropDownPicker
            style={{
                backgroundColor:'transparent',
                borderWidth:0,
                borderBottomWidth:1,
                borderRadius:0,
                borderBottomColor:theme.subColor,
                flexDirection:'row',
                padding:10,
                marginBottom:open?defaultDropDownHeight:30
            }}
            dropDownContainerStyle={{
                backgroundColor:theme.dropdown,
                borderWidth:0,
                borderRadius:20,
                padding:10,
                maxHeight: defaultDropDownHeight
            }}
            listItemContainerStyle={{
                padding:10,
                flexDirection:'row'
            }}
            searchTextInputStyle={{
                color:theme.color,
                borderWidth:0,
                borderBottomWidth:1,
                borderRadius:0,
                borderBottomColor:theme.subColor
            }}
            textStyle={{
                color:theme.subColor,
                fontSize:16
            }}
            listItemLabelStyle={{
                color:theme.color,
            }}
            searchTextInputProps={{
                autoFocus: true,
                selectionColor: theme.color,              
            }}
            addCustomItem={true}
            zIndex={props.zIndex}
            badgeDotColors={["red", "blue", "orange", "green"]}
            badgeColors={theme.dropdown}
            ArrowUpIconComponent={() => <Icon name='up' type='antdesign' color={theme.subColor} size={20}/>}
            ArrowDownIconComponent={() => <Icon name='down' type='antdesign' color={theme.subColor} size={20}/>}
            TickIconComponent={() => <Icon name='check' type='feather' color={theme.subColor} size={20}/>}
            searchPlaceholder='Pesquisar...'
            placeholder={props.placeholder}
            searchable={props.searchable}
            multiple={props.multi}
            max={5}
            onPress={() => props.onPress(!open)}
            mode='BADGE'
            open={open}
            value={value}
            items={items}
            setOpen={setOpen}
            setValue={setValue}
            setItems={setItems}        
        />        
    )
}
