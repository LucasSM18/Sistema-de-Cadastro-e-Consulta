import React, { useState, useEffect } from 'react';
import Themes from '../themes/Themes';
import { Icon } from 'react-native-elements';
import { useColorScheme } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';

export default function CustomSelect(props) {
    const deviceTheme = useColorScheme();
    const theme = Themes[deviceTheme]||Themes.light;
    const defaultDropDownHeight = props.dropDownheight||100; 
    const defaultValue = props.multi ? [] : props.default;
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(defaultValue);
    const [items, setItems] = useState(props.options);  

    useEffect(() => {
        if(props.handler){ 
            setOpen(false);
        }
    },[props.handler])

    return(        
        <DropDownPicker
            style={{
                backgroundColor:'transparent',
                borderBottomColor:theme.subColor,
                borderBottomWidth:1,
                flexDirection:'row',
                padding:10,
                maxWidth:props.width,
                marginBottom:open?defaultDropDownHeight:30
            }}
            containerStyle={{
                maxWidth:props.width,
                alignSelf:'center'
            }}
            dropDownContainerStyle={{
                backgroundColor:theme.dropdown,
                borderWidth:0,
                borderRadius:20,
                padding:5,
                maxWidth:props.width,
                maxHeight:defaultDropDownHeight,
            }}
            listItemContainerStyle={{
                padding:10,
                borderWidth:0,
                flexDirection:'row',
            }}
            customItemLabelStyle={{
                fontStyle:"normal"
            }}
            searchTextInputStyle={{
                color:theme.color,
                borderWidth:0,
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
            flatListProps={{
                keyboardShouldPersistTaps:"always"
            }}
            listMode='FLATLIST'
            theme={deviceTheme.toUpperCase()}
            addCustomItem={true}            
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
            onChangeValue={value => props.selectedValue(value)}
            onPress={() => props.onPress()}
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
