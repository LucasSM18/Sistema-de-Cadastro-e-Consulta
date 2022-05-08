import styled from "styled-components/native";
import { FlatList, TouchableOpacity } from "react-native";

export const BarComponent = styled.View`
    background: ${props => props.theme.barComponent};
`;

export const Flatlist = styled(FlatList)`
    background: ${props => props.theme.body};
`;

export const Font = styled.Text`
    color: ${props => props.theme.subColor};    
`;

export const Title = styled.Text`
    color: ${props => props.theme.color};    
    font-weight: bold;
    font-size: 30px;
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

export const CustomButtom = styled(TouchableOpacity)`
    background: ${props => props.theme.barComponent};
    height: 50px;
    width: 160px;
    border-radius: 5px;
    justify-content: center;
    align-items: center;
    align-self: flex-end;
`;