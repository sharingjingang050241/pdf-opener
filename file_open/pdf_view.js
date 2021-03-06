import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Image,
    Dimensions,
    Button,
    TouchableHighlight,
    TextInput
} from 'react-native';
import Pdf from 'react-native-pdf';
import Toast from 'antd-mobile/lib/toast';

export default class PdfView extends Component {
    static navigationOptions = ({ navigation }) => ({
    headerTitle: `${navigation.state.params.fileName.replace('.pdf','')}`,
    headerTintColor:'#000',
    headerStyle:{backgroundColor:'#fff'},
    headerTitleStyle:{color:'#000',alignSelf:'center'},
    gesturesEnabled:true
  })
    constructor(props) {
        super(props)
        this.state = {
            page: 1,
            pageCount: 1,
            text:1
        }
        this.pdf = null;
    }
     prePage() {
        if (this.pdf) {
            let prePage = this.state.page > 1 ? this.state.page - 1 : 1;
            this.pdf.setNativeProps({ page: prePage });
            this.setState({ page: prePage });
            // console.log(`prePage: ${prePage}`);
        }
    }

    nextPage() {
        if (this.pdf) {
            let nextPage = this.state.page + 1 > this.state.pageCount ? this.state.pageCount : this.state.page + 1;
            this.pdf.setNativeProps({ page: nextPage });
            this.setState({ page: nextPage });
            // console.log(`nextPage: ${nextPage}`);
        }

    }
    to_page(){
        // console.log('ssxx|'+this.state.pageCount)
        // console.log(this.state.text)
        if (this.pdf) {
            if(parseInt(this.state.text) + 1 > this.state.pageCount){
                Toast.info('输入页数过大',1) 
                return
            }
            this.pdf.setNativeProps({ page: parseInt(this.state.text) });
            this.setState({ page: parseInt(this.state.text) });
            // console.log(`?: ${this.state.text}`);
        }
    }
    render() {
        const { goBack } = this.props.navigation;
        const { params } = this.props.navigation.state;
        return (
            <View style={styles.container}>
                
                <Pdf ref={(pdf) => { this.pdf = pdf; }}
                        source={{ uri: 'file://' + params.filePath }}
                        page={1}
                        horizontal={false}
                        onLoadComplete={(pageCount) => {
                            this.setState({ pageCount: pageCount });
                            console.log(`total page count: ${pageCount}`);
                        }}
                        onPageChanged={(page, pageCount) => {
                            this.setState({ page: page });
                            console.log(`current page: ${page}`);
                        }}
                        onError={(error) => {
                            console.log(error);
                        }}
                        style={styles.pdf} />
                <View style={{height:5,backgroundColor:'gray',alignItems:'flex-start'}}>
                        <View style={{backgroundColor:'#f84',height:5,width:(Number(this.state.page)/Number(this.state.pageCount))*Dimensions.get('window').width}}></View>
                </View>
                <View style={{flexDirection:'row',justifyContent:'space-around',alignItems:'center',width:Dimensions.get('window').width,backgroundColor:"#fff"}}>
                    <TouchableHighlight  disabled={this.state.page==1} style={this.state.page==1?styles.btnDisable:styles.btn} onPress={()=>this.prePage()}>
                        <Text style={this.state.page==1?styles.btnTextDis:styles.btnText}>{'上一页'}</Text>
                    </TouchableHighlight>
                    <View style={{flexDirection:'row',justifyContent:'space-around',alignItems:'center',}}>
                    <TextInput
                        onChangeText={(text) => this.setState({text})}
                        value={this.state.text+''}
                        keyboardType='numeric'
                        onSubmitEditing={()=>this.to_page()}
                        style={styles.input_style}
                        underlineColorAndroid='transparent'
                    />
                    <TouchableHighlight    onPress={()=>this.to_page()}>
                        <Text style={styles.turn}>{'跳转'}</Text>
                    </TouchableHighlight>
                    </View>
                    <TouchableHighlight  disabled={this.state.page==this.state.pageCount} style={this.state.page==this.state.pageCount?styles.btnDisable:styles.btn}  onPress={()=>this.nextPage()}>
                        <Text style={this.state.page==this.state.pageCount?styles.btnTextDis:styles.btnText}>{'下一页'}</Text>
                    </TouchableHighlight>
                </View>
                <View style={styles.pagect}>
                    <Text style={{color:'#fff',fontWeight:'bold'}}>{this.state.page}/{this.state.pageCount}</Text>
                </View>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        // justifyContent: 'center',
        // alignItems: 'center',
        backgroundColor: '#EeEeEe',
    },
    pdf: {
        flex: 1,
        width: Dimensions.get('window').width,
    },
    btn: {
        margin: 5,
        padding:5,
        backgroundColor: "gray",
        borderRadius:15,
        borderWidth:1,
        borderColor:"gray",
        paddingRight:9,
        paddingLeft:9,
    },
    btnDisable: {
        margin: 5,
        padding:5,
        backgroundColor: "#fff",
        borderRadius:15,
        borderWidth:1,
        borderColor:"gray",
        paddingRight:9,
        paddingLeft:9,
    },
    btnText: {
        color: "#fff",
    },
    btnTextDis:{
        color: "#989898",
    },
    input_style:{
        borderWidth:0.5,
        borderColor:'#aeaeae',
        height:30,
        padding:0,margin:0,textAlign:'center',
        width:50,
        borderRadius:15,
        color:"#f84"
    },
    pagect:{
        position:'absolute',
        left:20,
        bottom:56,
        backgroundColor:"rgba(0,0,0,0.5)",
        padding:5,
        paddingRight:9,
        paddingLeft:9,
        borderRadius:15
    },
    
    turn:{
        color:"gray",
        marginLeft:5,
        textDecorationLine:'underline'
    }
})