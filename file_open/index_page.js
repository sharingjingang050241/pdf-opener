import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Linking,
    Image,
    Platform,
    Dimensions,
    ListView,
    Alert
} from 'react-native';
// const DocumentPicker = require('react-native').NativeModules.RNDocumentPicker;
import { DocumentPicker, DocumentPickerUtil } from 'react-native-document-picker';
import PDFView from 'react-native-pdf-view';
import OpenFile from 'react-native-doc-viewer';
import RNFetchBlob from 'react-native-fetch-blob';
import Icon from 'antd-mobile/lib/icon';
import Toast from 'antd-mobile/lib/toast';
import Button from 'antd-mobile/lib/button';
import SplashScreen from 'react-native-splash-screen'

var RNFS = require('react-native-fs');
const FileOpener = require('react-native-file-opener');
var SavePath = Platform.OS === 'ios' ? RNFS.MainBundlePath : RNFS.DocumentDirectoryPath;
const dirs = RNFetchBlob.fs.dirs;
var local_path = '';
const toTop = require('../img/toTop.png')
const unknow = require('../img/unknow.png')
const dir = require('../img/dir.png')
const pdf = require('../img/pdf.png')
const search = require('../img/search.png')
const empty_page = require('../img/empty_page.png')
var allFiles = new Map();

export default class IndexPage extends Component {
    static navigationOptions = ({ navigation, screenProps }) => ({
        headerTitle: '汉中工务段',
        headerRight:(<Button
            size='small'
            style={{marginRight:10,backgroundColor:'transparent',borderWidth:0}}
            onClick={()=>{navigation.navigate('Search',{ allFiles: allFiles})}}
        ><Image source={search} style={{height:78,width:78}}/></Button>),
        headerTintColor:'#000',
        headerStyle:{backgroundColor:'#fff'},
        headerTitleStyle:{color:'#000',alignSelf:'center'}
    });

    constructor(props) {
        super(props);
        this.state = {
            dataSource: new ListView.DataSource({ rowHasChanged: (row1, row2) => row1 !== row2 }),
            sdcard_fileList: null,
            can_open_uri: null,
            fileName: ''
        }
        this.touch_row = this.touch_row.bind(this)
        this.renderRow = this.renderRow.bind(this)
        this.renderHeader = this.renderHeader.bind(this)
        this._findAll = this._findAll.bind(this)
    }
    componentWillMount() {
        RNFetchBlob.fs.exists('/sdcard/AboutWorks')
            .then((exist) => {
                // console.log(`file ${exist ? '' : 'not'} exists`)
                if (exist) {
                    RNFetchBlob.fs.ls('/sdcard/AboutWorks')
                        // files will an array contains filenames
                        .then((files) => {
                            this.setState({ sdcard_fileList: files })
                            
                        })
                    this._findAll('/sdcard/AboutWorks')
                } else {
                    RNFetchBlob.fs.mkdir('/sdcard/AboutWorks')
                        .then(() => {
                            // console.log('init dir success')
                            RNFetchBlob.fs.ls('/sdcard/AboutWorks')
                                // files will an array contains filenames
                                .then((files) => {
                                    this.setState({ sdcard_fileList: files })
                                    // console.log(files)
                                })
                        })
                        .catch((err) => { console.log(err) })
                }
                local_path = '/sdcard/AboutWorks'
            })
            .catch((err) => { console.log(err) })
    }
    _findAll(filePaths) {
        RNFetchBlob.fs.ls(filePaths)
            .then((files) => {
                files.forEach(function(element) {
                    // console.log(element)
                    RNFetchBlob.fs.isDir(filePaths+'/'+element)
                    .then((isDir) => {
                        // console.log(`file is ${isDir ? '' : 'not'} a directory`)
                        if (isDir) {
                             this._findAll(filePaths+'/'+element)
                            // console.log(filePaths+'/'+element)
                        } else {
                            // console.log(filePaths+'/'+element)
                             allFiles.set(element, filePaths+'/'+element)
                        }
                    })
                }, this);
            })
    }
    componentDidMount() {
        setTimeout(()=>{
            SplashScreen.hide();
        },2000)
        // console.log(allFiles)
    }
    renderContent(dataSource) {
        const isEmpty = this.state.sdcard_fileList === null || this.state.sdcard_fileList.length === 0
        if (isEmpty) {
            return <View style={{ flex:1, alignItems: 'center', justifyContent: 'flex-start' ,backgroundColor:'rgba(255,255,255,0.2)'}}><View>{this.renderHeader()}</View><View style={{alignItems:'center',justifyContent:'center',flex:1}}>
                <Image source={empty_page} style={{height:35,width:35}}/>
                <Text style={{color:'#fff'}}>文件夹为空</Text>
                </View></View>
        } else {
            return (
                <ListView
                    dataSource={this.state.dataSource.cloneWithRows(this.state.sdcard_fileList)}
                    renderRow={this.renderRow}
                    enableEmptySections={true}
                    renderHeader={this.renderHeader}
                    style={{flex:1,backgroundColor:'rgba(255,255,255,0.2)'}}
                />
            )
        }
    }
    touch_row(rowdate) {
        const { navigate } = this.props.navigation;
        var filePath = ''
        var index = local_path.lastIndexOf("\/");
        if (local_path.substring(index) == ('/' + rowdate)) {
            return
        }
        filePath += local_path + '/' + rowdate
        // console.log(filePath)
        RNFetchBlob.fs.isDir(filePath)
            .then((isDir) => {
                // console.log(`file is ${isDir ? '' : 'not'} a directory`)
                if (isDir) {
                    // console.log(filePath)
                    local_path += '/' + rowdate
                    RNFetchBlob.fs.ls(filePath)
                        // files will an array contains filenames
                        .then((files) => {
                            // console.log(files)
                            this.setState({ sdcard_fileList: files })
                        })
                } else {
                    // console.log(filePath)
                    // console.log(rowdate)
                    this.setState({ can_open_uri: filePath })
                    this.setState({ fileName: rowdate })
                    // this.closeDrawer()
                    let index = rowdate.lastIndexOf('.')
                    var last_name = rowdate.substring(index + 1)
                    var fileType = ''
                    if (index == -1) {
                        Toast.fail('不支持文件类型', 1.5)
                        return
                    }
                    if (last_name == 'pdf') {
                        fileType = 'application/pdf'
                    } else {
                        Toast.fail('暂不支持文件类型', 1.5)
                        return
                    }
                    if (fileType == 'application/pdf') {
                        navigate('Pdf_View', { filePath: filePath, fileName: rowdate })
                    } else {
                        FileOpener.open(
                            filePath,
                            fileType
                        ).then(() => {
                            console.log('success!!');
                        }, (e) => {
                            console.log('error!!');
                            Toast.fail('打开文件失败', 1.5)
                        });
                    }

                }
            })
    }
    renderRow(rowdate) {
        let index = rowdate.lastIndexOf('.')
        var last_name = rowdate.substring(index + 1)
        if (index == -1) {
            return (
                <TouchableOpacity style={styles.renderrow} onPress={() => { this.touch_row(rowdate) }}>
                    <Image source={dir} style={{height:35,width:35}}/>
                    <View style={styles.row_View}>
                        <Text style={styles.row_text}>{rowdate}</Text>
                    </View>
                </TouchableOpacity>
            )
        } else if (last_name == 'pdf') {
            return (
                <TouchableOpacity style={styles.renderrow} onPress={() => { this.touch_row(rowdate) }}>
                    <Image source={pdf} style={{height:35,width:35}}/>
                    <View style={styles.row_View}>
                        <Text style={styles.row_text}>{rowdate}</Text>
                    </View>
                </TouchableOpacity>
            )
        } else {
            return (
                <TouchableOpacity style={styles.renderrow} onPress={() => { this.touch_row(rowdate) }}>
                    <Image source={unknow} style={{height:35,width:35}}/>
                    <View style={styles.row_View}>
                        <Text style={styles.row_text}>{rowdate}</Text>
                    </View>
                </TouchableOpacity>
            )
        }
    }
    renderHeader() {
        if (local_path == '/sdcard/AboutWorks') {
            return
        }
        var array = new Array();
        var nav_path = local_path.replace('/sdcard/AboutWorks/', '');
        array = nav_path.split('\/')
        // console.log(array)
        var head_title = ''
        array.forEach(function (element) {
            head_title+=(element+' > ')
        }, this)
        // console.log(head_title)
        // head_title=head_title.substr(1)
        return (
            <View >
                <Text style={styles.head_nav}>{head_title}</Text>
                <TouchableOpacity style={styles.renderrow} onPress={() => { this.return_before() }}>
                    <Image source={toTop} style={{height:35,width:35}}/>
                    <View style={styles.row_View}>
                        <Text style={styles.row_text}>返回上一层</Text>
                    </View>
                </TouchableOpacity>
                {/* {this.state.sdcard_fileList.length == 0 ? <Text style={{ paddingLeft: 10, }}>文件夹为空</Text> : <Text></Text>} */}
            </View>

        )
    }
    return_before() {
        // console.log(local_path)
        var index = local_path.lastIndexOf("\/");
        local_path = local_path.substring(0, index)
        RNFetchBlob.fs.ls(local_path)
            // files will an array contains filenames
            .then((files) => {
                // console.log(files)
                this.setState({ sdcard_fileList: files })
            })
            .catch((err) => {
                console.log(err)
            })
    }

    render() {
        return (
            <View style={styles.container}>
                {/* <Image source={require('../img/back.png')} style={{alignItems:'center',resizeMode: Image.resizeMode.stretch ,width:Dimensions.get('window').width,height:Dimensions.get('window').height-50}}> */}
                <View style={{ flex: 1, width: Dimensions.get('window').width}}>
                    {this.renderContent(this.state.dataSource.cloneWithRows(this.state.sdcard_fileList == null ? [] : this.state.sdcard_fileList))}
                
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
        padding:5,
        paddingBottom:10,
        flexDirection:'row',
        alignItems:'center'
    },
    headStyle: {
        flexDirection:'row',
        height: 40,
        marginBottom: 3,
        width: Dimensions.get('window').width,
        paddingLeft: 10,
        justifyContent: 'flex-start',
        borderBottomWidth: 0.5,
        alignItems: 'center',
        borderColor: '#BFBFBF'
    },
    head_nav:{
        backgroundColor:'rgba(255,255,255,0.2)',
        color:'#000',fontSize:14,padding:5,
        width:Dimensions.get('window').width,
        flexWrap:'wrap'
    }
});