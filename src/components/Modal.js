import * as React from 'react';
import { CustomView } from '../components/Styles';
import { StyleSheet, ActivityIndicator, Modal } from 'react-native';

export default function ModalScreen() {
    return (
        <Modal
            animationType={'fade'}
            style={styles.modal}
            transparent
        >
            <CustomView style={styles.modalBackground}>
                <ActivityIndicator size={100} color="#a6a6a6"/>
            </CustomView>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modal: {
        flex:1, 
        justifyContent: "center", 
        alignContent: "center"
    },

    modalBackground: {
        backgroundColor: "rgba(0, 0, 0, 0.6)",
        justifyContent: "center",
        height:'100%'
    }
})

