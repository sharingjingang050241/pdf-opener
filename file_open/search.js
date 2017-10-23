import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Button,
    TouchableOpacity,
    Linking,
    Image,
    Platform,
    Dimensions,
    ListView,
    TextInput
} from 'react-native';
const search = require('../img/search.png')
const empty_page = require('../img/empty_page.png')
const pdf = require('../img/pdf.png')
var searchMap = new Map();

export default class IndexPage extends Component {
    static navigationOptions = ({ navigation, screenProps }) => ({
        headerTitle: '汉中工务段',
        header:null
    });
    constructor(props) {
        super(props);
        this.state = {
            value:'',
            dataSource: new ListView.DataSource({ rowHasChanged: (row1, row2) => row1 !== row2 }),
            data_list:null
        }
        this._changeText=this._changeText.bind(this)
        this.renderRow=this.renderRow.bind(this)
    }
    componentDidMount(){
        const { params } = this.props.navigation.state;
        // console.log(eval("(" +JSON.stringify(this.strMapToObj(params.allFiles))+ ")"))
        // console.log(this.strMapToObj(params.allFiles))
    }
    strMapToObj(strMap) {//map转对象
        let obj = Object.create(null);
        for (let [k,v] of strMap) {
          obj[k] = v;
        }
        return obj;
      }

    _changeText(text){
        searchMap.clear()
        const { params } = this.props.navigation.state;
        this.setState({value:text})
        if(text == ''){
            searchMap.clear()
            this.setState({data_list:null})
        }else{
            var regtext = new RegExp(text);
            params.allFiles.forEach((value,key)=>{
                if(regtext.test(key)){
                    searchMap.set(key,value)
                }
            }, this);
            // console.log(searchMap)
            let keylist=new Array();
            for (let keys of searchMap.keys()) {
                keylist.push(keys)
                // console.log(keys);
              }
            //   console.log(keylist)
            this.setState({data_list:keylist})
        }
        
    }
    renderContent(dataSource) {
        const isEmpty = this.state.data_list === null || this.state.data_list.length === 0
        if (isEmpty) {
            return <View style={{ flex:1, alignItems: 'center', justifyContent: 'flex-start' ,backgroundColor:'rgba(255,255,255,0.2)'}}>
                <Image source={empty_page} style={{height:35,width:35}}/>
                </View>
        } else {
            return (
                <ListView
                    dataSource={this.state.dataSource.cloneWithRows(this.state.data_list)}
                    renderRow={this.renderRow}
                    enableEmptySections={true}
                    style={{flex:1,backgroundColor:'rgba(255,255,255,0.2)'}}
                />
            )
        }
    }
    renderRow(rowdate) {
        // console.log(rowdate)
        return(
            <TouchableOpacity style={styles.renderrow} onPress={()=>this._toPdfView(rowdate) } >
                <Image source={pdf} style={{height:30,width:30}}/>
                <View style={styles.row_View}>
                    <Text style={styles.row_text}>{rowdate}</Text>
                </View>
            </TouchableOpacity>
        )
    }
    _toPdfView(rowdate){
        const { navigate } = this.props.navigation;
        // console.log(this.strMapToObj(searchMap))
        // console.log(rowdate)
        let pathPdf = searchMap.get(rowdate)
        // console.log(pathPdf)
        navigate('Pdf_View', { filePath: pathPdf, fileName: rowdate })
    }
    render() {
        // console.log(this.state.data_list)
        return (
            <View style={styles.container}>
                <Image source={require('../img/back.png')} style={{resizeMode: Image.resizeMode.stretch ,width:Dimensions.get('window').width,height:Dimensions.get('window').height}}>
                    <View style={{backgroundColor:'#ccdd',height:50,flexDirection:'row',alignItems:'center'}}>
                        <Image
                            source={search}
                            style={{height:30,width:30,margin:6}}
                        />
                        <TextInput
                            style={{flex:1,color:'#fff',fontSize:16}}
                            underlineColorAndroid='transparent'
                            placeholder='输入搜索内容'
                            placeholderTextColor='#fff'
                            autoFocus={true}
                            value={this.state.value}
                            onChangeText={this._changeText}
                        />
                    </View>
                    <View style={{ flex: 1, width: Dimensions.get('window').width}}>
                    {this.renderContent(this.state.dataSource.cloneWithRows(this.state.data_list == null ? [] : this.state.data_list))}
                
                    </View>
                </Image>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        // justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#000',
    },
    renderrow: {
        padding:10,
        width: Dimensions.get('window').width, 
        justifyContent: 'flex-start',
        flexDirection: 'row',
        alignItems: 'center',
        // backgroundColor:'rgba(255,255,255,0.5)'
    },
    row_text: {
        fontSize: 17,
        fontWeight: 'normal',
        color:'#fff'
    },
    row_View:{
        flex:1,
        marginLeft: 15,
        borderBottomWidth:0.5,
        borderColor:'#f2f3f8',
        padding:10,
        paddingBottom:15
    },
})