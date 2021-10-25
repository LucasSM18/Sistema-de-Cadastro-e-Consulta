import styled from "styled-components/native";
import { FlatList, TouchableOpacity } from "react-native";
import { Ionicons, FontAwesome5, FontAwesome, Entypo } from "@expo/vector-icons";

export const BarComponent = styled.View`
    background: ${props => props.theme.barComponent};
`;

export const Flatlist = styled(FlatList)`
    background: ${props => props.theme.body};
`;

export const Title = styled.Text`
    color: ${props => props.theme.color};
    font-size: 18px;
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

export const Search = styled.TextInput`
    background: ${props => props.theme.body};
    color: ${props => props.theme.color};
`;

export const CustomButtom = styled(TouchableOpacity)`
    background: ${props => props.theme.barComponent};
`;

export const Icons_Ionicons = styled(Ionicons)`
    color: ${props => props.theme.subColor};
`;

export const Icons_FontAwesome5 = styled(FontAwesome5)`
    color: ${props => props.theme.subColor};
`;

export const Icons_FontAwesome = styled(FontAwesome)`
    color: ${props => props.theme.subColor};
`;

export const Icons_entypo = styled(Entypo)`
    color: ${props => props.theme.subColor};
`;
