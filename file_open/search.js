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
import Toast from 'antd-mobile/lib/toast';
const search = require('../img/search.png')
const empty_page = require('../img/empty_page.png')
const pdf = require('../img/pdf.png')
const unknow = require('../img/unknow.png')
const dir = require('../img/dir.png')
var searchMap = new Map();

export default class IndexPage extends Component {
    static navigationOptions = ({ navigation, screenProps }) => ({
        headerTitle: 'PDF阅读',
        header:null,
        gesturesEnabled:true
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
        if (isEmpty&&this.state.value!='') {
            return <View style={{ flex:1, alignItems: 'center', justifyContent: 'flex-start' ,backgroundColor:'rgba(255,255,255,0.2)'}}>
                <Image source={empty_page} style={{height:35,width:35}}/>
                <Text>未检索到关于“<Text style={{color:'red'}}>{this.state.value}</Text>”的文件</Text>
                </View>
        }else if(isEmpty&&this.state.value==''){
            return <View style={{ flex:1, alignItems: 'center', justifyContent: 'flex-start' ,backgroundColor:'rgba(255,255,255,0.2)'}}>
            {/* <Image source={empty_page} style={{height:35,width:35}}/> */}
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
        // // console.log(rowdate)
        // return(
        //     <TouchableOpacity style={styles.renderrow} onPress={()=>this._toPdfView(rowdate) } >
        //         <Image source={pdf} style={{height:30,width:30}}/>
        //         <View style={styles.row_View}>
        //             <Text style={styles.row_text}>{rowdate}</Text>
        //         </View>
        //     </TouchableOpacity>
        // )
        let index = rowdate.lastIndexOf('.')
        var last_name = rowdate.substring(index + 1)
        if (index == -1) {
            return (
                <TouchableOpacity style={styles.renderrow} onPress={() => { this._toPdfView(rowdate) }}>
                    <Image source={dir} style={{height:30,width:30}}/>
                    <View style={styles.row_View}>
                        <Text style={styles.row_text}>{rowdate}</Text>
                    </View>
                </TouchableOpacity>
            )
        } else if (last_name == 'pdf') {
            return (
                <TouchableOpacity style={styles.renderrow} onPress={() => { this._toPdfView(rowdate) }}>
                    <Image source={pdf} style={{height:30,width:30}}/>
                    <View style={styles.row_View}>
                        <Text style={styles.row_text}>{rowdate}</Text>
                    </View>
                </TouchableOpacity>
            )
        } else {
            return (
                <TouchableOpacity style={styles.renderrow} onPress={() => { this._toPdfView(rowdate) }}>
                    <Image source={unknow} style={{height:30,width:30}}/>
                    <View style={styles.row_View}>
                        <Text style={styles.row_text}>{rowdate}</Text>
                    </View>
                </TouchableOpacity>
            )
        }
    }
    _toPdfView(rowdate){
        const { navigate } = this.props.navigation;
        // console.log(this.strMapToObj(searchMap))
        // console.log(rowdate)
        let pathPdf = searchMap.get(rowdate)
        // console.log(pathPdf)
        let index = rowdate.lastIndexOf('.')
        var last_name = rowdate.substring(index + 1)
        if (index == -1) {
            Toast.fail('不支持文件类型', 1.5)
            return
        }
        if (last_name == 'pdf') {
            navigate('Pdf_View', { filePath: pathPdf, fileName: rowdate })
        } else {
            Toast.fail('暂不支持文件类型', 1.5)
            return
        }
        
    }
    render() {
        // console.log(this.state.data_list)
        return (
            <View style={styles.container}>
                {/* <Image source={require('../img/back.png')} style={{resizeMode: Image.resizeMode.stretch ,width:Dimensions.get('window').width,height:Dimensions.get('window').height}}> */}
                    <View style={{backgroundColor:'#fff',height:50,flexDirection:'row',alignItems:'center',elevation: 4,}}>
                        <Image
                            source={search}
                            style={{height:30,width:30,margin:6}}
                        />
                        <TextInput
                            style={{flex:1,color:'#000',fontSize:16}}
                            underlineColorAndroid='transparent'
                            placeholder='输入搜索内容'
                            placeholderTextColor='#000'
                            autoFocus={true}
                            value={this.state.value}
                            onChangeText={this._changeText}
                        />
                        <TouchableOpacity onPress={()=>this.props.navigation.goBack()} style={{borderLeftWidth:1,padding:6,borderLeftColor:'#dcdcdc'}}>
                            <Text style={{fontSize:16}}>
                                取消
                            </Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{ flex: 1, width: Dimensions.get('window').width}}>
                    {this.renderContent(this.state.dataSource.cloneWithRows(this.state.data_list == null ? [] : this.state.data_list))}
                
                    </View>
                {/* </Image> */}
            </View>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        // justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
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
        color:'#000'
    },
    row_View:{
        flex:1,
        marginLeft: 10,
        borderBottomWidth:0.5,
        borderColor:'#f2f3f8',
        padding:10,
        paddingBottom:10
    },
})