import React, { Component } from 'react';
import {
    AppRegistry,
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
} from 'react-native';
// const DocumentPicker = require('react-native').NativeModules.RNDocumentPicker;
import { DocumentPicker, DocumentPickerUtil } from 'react-native-document-picker';
import PDFView from 'react-native-pdf-view';
import OpenFile from 'react-native-doc-viewer';
import RNFetchBlob from 'react-native-fetch-blob';
import Icon from 'antd-mobile/lib/icon';
import Toast from 'antd-mobile/lib/toast';

var RNFS = require('react-native-fs');
const FileOpener = require('react-native-file-opener');
var SavePath = Platform.OS === 'ios' ? RNFS.MainBundlePath : RNFS.DocumentDirectoryPath;
const dirs = RNFetchBlob.fs.dirs;
var local_path = '';
const toTop = require('../img/toTop.png')
const unknow = require('../img/unknow.png')
const dir = require('../img/dir.png')
const pdf = require('../img/pdf.png')


export default class IndexPage extends Component {
    static navigationOptions = ({ navigation, screenProps }) => ({
        headerTitle: '阅读·目录',
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
                            // console.log(files)
                        })
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
    componentDidMount() {
        // console.log('组件加载完成')
    }
    renderContent(dataSource) {
        const isEmpty = this.state.sdcard_fileList === null
        if (isEmpty) {
            return <View style={{ height: 20, alignItems: 'center', justifyContent: 'flex-end' }}><Text>加载中...</Text></View>
        } else {
            return (
                <ListView
                    dataSource={this.state.dataSource.cloneWithRows(this.state.sdcard_fileList)}
                    renderRow={this.renderRow}
                    enableEmptySections={true}
                    renderHeader={this.renderHeader}
                    style={{flex:1,backgroundColor:'#fff'}}
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
                    // } else if (last_name == 'rar') {
                    //     fileType = 'application/rar'
                    // } else if (last_name == 'zip') {
                    //     fileType = 'application/zip'
                    // } else if (last_name == 'apk') {
                    //     fileType = 'application/vnd.android.package-archive'
                    // } else if (last_name == 'doc' || last_name == 'dot') {
                    //     fileType = 'application/msword'
                    // } else if (last_name == 'docx') {
                    //     fileType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
                    // } else if (last_name == 'dotx') {
                    //     fileType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.template'
                    // } else if (last_name == 'xls' || last_name == 'xlt') {
                    //     fileType = 'application/vnd.ms-excel'
                    // } else if (last_name == 'xlsx') {
                    //     fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                    // } else if (last_name == 'xltx') {
                    //     fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.template'
                    // } else if (last_name == 'ppt' || last_name == 'pot' || last_name == 'pps') {
                    //     fileType = 'application/vnd.ms-powerpoint'
                    // } else if (last_name == 'pptx') {
                    //     fileType = 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
                    // } else if (last_name == 'potx') {
                    //     fileType = 'application/vnd.openxmlformats-officedocument.presentationml.template'
                    // } else if (last_name == 'ppsx') {
                    //     fileType = 'application/vnd.openxmlformats-officedocument.presentationml.slideshow'
                    // } else if (last_name == 'frm' || last_name == 'maker' || last_name == 'frame' || last_name == 'fb' || last_name == 'book' || last_name == 'fbdoc') {
                    //     fileType = 'application/x-maker'
                    // } else if (last_name == 'mp3') {
                    //     fileType = 'audio/mpeg'
                    // } else if (last_name == 'jpeg' || last_name == 'jpg' || last_name == 'jpe') {
                    //     fileType = 'image/jpeg'
                    // } else if (last_name == 'png') {
                    //     fileType = 'image/png'
                    // } else if (last_name == 'gif') {
                    //     fileType = 'image/gif'

                    // } else if (last_name == 'mp4') {
                    //     fileType = 'video/mp4'
                    // } else if (last_name == 'avi') {
                    //     fileType = 'video/x-msvideo'
                    // } else if (last_name == 'txt') {
                    //     fileType = 'text/plain'
                    // } else if (last_name == 'apk') {
                    //     fileType = 'application/vnd.android.package-archive'
                    // } else if (last_name == 'wmv') {
                    //     fileType = 'video/x-ms-wmv'
                    // } else if (last_name == 'htm' || last_name == 'html' || last_name == 'hts' || last_name == 'xml') {
                    //     fileType = 'text/html'
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
                    <Image source={dir} style={{height:30,width:30}}/>
                    <Text style={styles.row_text}>{rowdate}</Text>
                </TouchableOpacity>
            )
        } else if (last_name == 'pdf') {
            return (
                <TouchableOpacity style={styles.renderrow} onPress={() => { this.touch_row(rowdate) }}>
                    <Image source={pdf} style={{height:30,width:30}}/>
                    <Text style={styles.row_text}>{rowdate}</Text>
                </TouchableOpacity>
            )
        } else {
            return (
                <TouchableOpacity style={styles.renderrow} onPress={() => { this.touch_row(rowdate) }}>
                    <Image source={unknow} style={{height:30,width:30}}/>
                    <Text style={styles.row_text}>{rowdate}</Text>
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
        console.log(array)
        var head_title = ''
        array.forEach(function (element) {
            head_title+=(element+'>')
        }, this)
        console.log(head_title)
        head_title=head_title.substr(1)
        return (
            <View >
                <Text style={styles.head_nav}>{head_title}</Text>
                <TouchableOpacity style={styles.headStyle} onPress={() => { this.return_before() }}>
                    <Image source={toTop} style={{height:25,width:25}}/>
                    <Text style={{fontSize:16,}}>  返回上一层</Text>
                </TouchableOpacity>
                {this.state.sdcard_fileList.length == 0 ? <Text style={{ paddingLeft: 10, }}>文件夹为空</Text> : <Text></Text>}
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
                <View style={{ flex: 1, width: Dimensions.get('window').width}}>
                    {this.renderContent(this.state.dataSource.cloneWithRows(this.setState.sdcard_fileList == null ? [] : this.setState.sdcard_fileList))}
                </View>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        // justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    renderrow: {
        padding:10,
        width: Dimensions.get('window').width, 
        justifyContent: 'flex-start',
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor:'#fff'
    },
    row_text: {
        fontSize: 17,
        paddingBottom:10,
        fontWeight: 'normal',
        marginLeft: 15,
        borderBottomWidth:0.5,
        borderColor:'#f2f3f8',
        flex:1
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
        backgroundColor:'#F6AD3C',
        color:'#fff',fontSize:14
    }
});