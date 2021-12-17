import React, { useState, useEffect } from 'react';
import moment from 'moment';
import Themes from '../themes/Themes';
import { Font } from '../components/Styles';
import { Collapse, CollapseHeader, CollapseBody } from 'accordion-collapse-react-native';
import { StyleSheet, View, Text, FlatList, useColorScheme } from 'react-native';

const Escala = {
  mti: [
    {
      id: "18/12",
      MTI: "Lucas",
      Iluminação: "Otávio",
      Câmera_Principal: "Calebe",
      Câmera_2: "pessoa4",
      Corte: "pessoa 5",
      Som: "pessoa 6"
    },
    {
      id: "25/12",
      MTI: " - ",
      Iluminação: " - ",
      Câmera_Principal: " - ",
      Câmera_2: " - ",
      Corte: " - ",
      Som: " - "
    }
  ],

  louvor: [
    {
      id: "18/12",
      Ministro: "Rodrigo",
      Vocal_1: "Keller",
      Vocal_2: "Vitor",
      Vocal_3: "Gustavo",
    },
    {
      id: "25/12",
      Ministro: "Daphine",
      Vocal_1: "Raphaelen",
      Vocal_2: "Vitor",
      Vocal_3: " - ",
    },
  ]  
}

const filtroData = () => {
  moment.locale('pt-br');
  const today = moment();
  const dateEvent = moment().day(6);
  //
  if(today > dateEvent) return dateEvent.add(1, 'week').format('DD/MM');
  return dateEvent.format('DD/MM');  
}


const Cells = (props) => {
  return (
    Object.keys(props.item).map((key, index) => (
      key!=='id' &&
      <View key={index} style={[styles.tableRow, {backgroundColor: props.theme , paddingHorizontal:25}]}>
        <Font style={styles.columnRowTxt}>
          {key.replace('_',' ')}
        </Font>  
        <Font style={styles.columnRowTxt}>
          {props.item[key]}
        </Font>
      </View>
    ))
  )
}

const tableHeader = (theme, props) => (
  <View style={[styles.tableHeader, {backgroundColor: theme}]}>
    <Text style={styles.columnHeaderTxt}>{"CONEXÃO - " + props.ministerio.toUpperCase()}</Text>
  </View>
)

const List = (props) => (
  <Collapse isExpanded={true}>
    <CollapseHeader style={{backgroundColor:props.theme.cell}}>
      <View style={[styles.tableRow, {paddingHorizontal:20}]}>
        <Font style={{fontWeight:"bold"}}>{props.item.id}</Font>
      </View>
    </CollapseHeader>
    <CollapseBody>
      <Cells item={props.item} theme={props.theme.body}/>
        </CollapseBody>
  </Collapse>
)

export default function Lista(props) { 
  const deviceTheme = useColorScheme();
  const theme = Themes[deviceTheme]||Themes.light;
  const [escala, setEscala] = useState(Escala['louvor'].filter(item => item.id === filtroData()));

  useEffect(() => {
    let ministerio = props.ministerio; 
    if(!props.multi) setEscala(Escala[ministerio].filter(item => item.id === filtroData()));
    else setEscala(Escala[ministerio]);
  },[props.multi, props.ministerio]);

  return (
    <View style={styles.container}>
      <FlatList
        data={escala}
        keyExtractor={item => item.id.toString()}
        ListHeaderComponent={tableHeader(theme.barComponent, props)}
        style={{width: "100%"}}                 
        stickyHeaderIndices={[0]}    
        renderItem={({item,index}) => (
          <List key={index} item={item} theme={theme}/>
        )} 
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center'
  },
  tableHeader: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    paddingHorizontal:10,
    borderTopEndRadius: 10,
    borderTopStartRadius: 10,
    height: 50
  },
  tableRow: {
    flexDirection: "row",
    position:"relative",
    height: 40,
    width:"65%",
    alignItems:"center",
  },
  columnHeaderTxt: {
    color: "white",
    fontWeight: "bold"
  },
  columnRowTxt: {
    width:"100%",
    padding:10,
    textAlign:"justify"
  }
});
