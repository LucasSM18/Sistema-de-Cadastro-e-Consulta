import React, { useState, useEffect } from 'react';
import Themes from '../themes/Themes';
import { Icon } from 'react-native-elements';
import { useColorScheme } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';

export default function CustomSelect(props) {
    const deviceTheme = useColorScheme();
    const { dropDownheight, multi, searchable, placeholder, startValue, options, handler, width, onPress, selectedValue } = props
    const theme = Themes[deviceTheme]||Themes.light;
    const defaultDropDownHeight = dropDownheight||100; 
    const defaultValue = multi ? [] : (startValue||startValue===false?startValue:null);
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(defaultValue);
    const [items, setItems] = useState(options);  

    useEffect(() => {
        if(handler){ 
            setOpen(false);
        }
    },[handler])

    return(        
        <DropDownPicker
            style={{
                backgroundColor:'transparent',
                borderBottomColor:theme.subColor,
                borderBottomWidth:1,
                flexDirection:'row',
                padding:10,
                maxWidth:width,
                marginBottom:open?defaultDropDownHeight:30
            }}
            containerStyle={{
                maxWidth:width,
                alignSelf:'center'
            }}
            dropDownContainerStyle={{
                backgroundColor:theme.dropdown,
                borderWidth:0,
                borderRadius:20,
                padding:5,
                maxWidth:width,
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
            placeholder={placeholder}
            searchable={searchable}
            multiple={multi}
            max={5}
            onChangeValue={value => selectedValue(value)}
            onPress={() => onPress()}
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
