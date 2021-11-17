import ReactSelect from 'react-select';
import styled from "styled-components/native";
import { FlatList, TouchableOpacity } from "react-native";

export const BarComponent = styled.View`
    background: ${props => props.theme.barComponent};
`;

export const Flatlist = styled(FlatList)`
    background: ${props => props.theme.body};
`;

export const Font = styled.Text`
    color: ${props => props.theme.color};
    line-height: 22px;
`;

export const Subfont = styled.Text`
    color: ${props => props.theme.subColor};    
`;

export const CustomView = styled.View`
    background: ${props => props.theme.body};
`;

export const SearchContainer = styled.View`
    background: ${props => props.theme.search};
`;

export const Search = styled.TextInput`
    background: ${props => props.theme.body};
    color: ${props => props.theme.color};
`;

export const Searchbar = styled.TextInput`
    background: ${props => props.theme.search};
    color: #fff;
`;

export const CustomSelect = styled(ReactSelect)`
    
`;

export const CustomButtom = styled(TouchableOpacity)`
    background: ${props => props.theme.barComponent};
`;