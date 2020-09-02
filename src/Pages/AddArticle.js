import React, { useState, useEffect } from 'react'
import marked from 'marked'
import '../static/css/AddArticle.css'
import { Row, Col, Input, Select, Button, DatePicker, message, } from 'antd'
import axios from 'axios'
import servicePath from '../config/apiUrl'
const {Option} = Select
const {TextArea} = Input

function AddArticle(props){

    const [articleId,setArticleId] = useState(0)  // 文章的ID，如果是0说明是新增加，如果不是0，说明是修改
    const [articleTitle,setArticleTitle] = useState('')   //文章标题
    const [articleContent , setArticleContent] = useState('')  //markdown的编辑内容
    const [markdownContent, setMarkdownContent] = useState('预览内容') //html内容
    const [introducemd,setIntroducemd] = useState()            //简介的markdown内容
    const [introducehtml,setIntroducehtml] = useState('等待编辑') //简介的html内容
    const [showDate,setShowDate] = useState()   //发布日期
    const [updateDate,setUpdateDate] = useState() //修改日志的日期
    const [typeInfo ,setTypeInfo] = useState([]) // 文章类别信息
    const [selectedType,setSelectType] = useState('请选择文章类型') //选择的文章类别

    useEffect(() => {
        getTypeInfo()
        //获得文章ID
        let tmpId = props.match.params.id
        if(tmpId){
            setArticleId(tmpId)
            getArticleById(tmpId)
        } 
    },[])

    marked.setOptions({
        renderer: marked.Renderer(),
        gfm: true,
        pedantic: false,
        sanitize: false,
        tables: true,
        breaks: false,
        smartLists: true,
        smartypants: false,
    });

    const changeContent = (e) => {
        setArticleContent(e.target.value)
        let html = marked(e.target.value)
        setMarkdownContent(html)
    }

    const changeInyroduce = (e) => {
        setIntroducemd(e.target.value)
        let html = marked(e.target.value)
        setIntroducehtml(html)
    }

    const getTypeInfo = () => {
        axios({
            method: 'get',
            url: servicePath.getTypeInfo,
            header:{ 'Access-Control-Allow-Origin':'*' },
            withCredentials: true,
        }).then(
            res => {
                console.log(res.data.data)
                if(res.data.data == '没有登录'){
                    localStorage.removeItem('openId')
                    props.history.push('/')
                }else{
                    setTypeInfo(res.data.data)
                }
            }
        )
    }

    const getArticleById = (id)=>{
        axios(servicePath.getArticleById+id,{ 
            withCredentials: true,
            header:{ 'Access-Control-Allow-Origin':'*' }
        }).then(
            res=>{
                //let articleInfo= res.data.data[0]
                setArticleTitle(res.data.data[0].title)
                setArticleContent(res.data.data[0].article_content)
                let html=marked(res.data.data[0].article_content)
                setMarkdownContent(html)
                setIntroducemd(res.data.data[0].introduce)
                let tmpInt = marked(res.data.data[0].introduce)
                setIntroducehtml(tmpInt)
                setShowDate(res.data.data[0].addTime)
                setSelectType(res.data.data[0].typeId)
            }
        )
    }
    

    const selectTypeHandler = (value) => {
        setSelectType(value)
    }

    const saveArticle = () => {
        if(selectedType == '请选择文章类型'){
            message.error('必须选择文章类型')
            return false
        }else if(!articleTitle){
            message.error('文章名称不能为空')
            return false
        }else if(!articleContent){
            message.error('文章内容不能为空')
            return false
        }else if(!introducemd){
            message.error('文章简介不能为空')
            return false
        }else if(!showDate){
            message.error('发布日期不能为空')
            return false
        }
        let dataProps = {}
        dataProps.type_id = selectedType
        dataProps.title = articleTitle
        dataProps.article_content = articleContent
        dataProps.introduce = introducemd
        console.log(showDate)
        // let dateText = showDate.replace('-','/')
        let dateText = showDate
        console.log(dateText)
        dataProps.addTime = (new Date(dateText).getTime())/1000

        if(articleId == 0){ //新增加的文字
            dataProps.view_count = 0;
            axios({
                method:'post',
                url: servicePath.addArticle,
                data: dataProps,
                withCredentials: true,
            }).then(
                res => {
                    setArticleId(res.data.insertId)
                    if(res.data.isSuccess){
                        message.success('文章添加成功')
                    }else{
                        message.error('文章添加失败')
                    }
                }
            )
        }else{ //修改文章
            dataProps.id = articleId
            axios({
                method: 'post',
                url: servicePath.updateArticle,
                data: dataProps,
                withCredentials: true,
            }).then(
                res => {
                    if(res.data.isSuccess){
                        message.success('文章保存成功')
                    }else{
                        message.error('文章保存失败')
                    }
                }
            )
        }

        
    }

    return (
        <div>
            <Row gutter={5}>
                <Col span={18}>
                    <Row gutter={10}>
                        <Col span={20}>
                            <Input 
                                value={articleTitle} 
                                placeholder="博客标题" 
                                size="large" 
                                onChange={e => {setArticleTitle(e.target.value)}}
                            />
                        </Col>
                        <Col span={4}>
                            &nbsp;
                            <Select defaultValue={selectedType} size="large" onChange={selectTypeHandler}>
                                {
                                    typeInfo.map((item) => {
                                        return (<Option key={item.id} value={item.id}>{item.typeName}</Option>)
                                    })
                                }
                            </Select>
                        </Col>
                    </Row>
                    <br/>
                    <Row gutter={10}>
                        <Col span={12}>
                            <TextArea 
                                className="markdown-content" 
                                rows={35} 
                                placeholder="文章内容"
                                onChange={changeContent}
                                value={articleContent}
                            />
                        </Col>
                        <Col span={12}>
                            <div 
                                className="show-html"
                                dangerouslySetInnerHTML={{__html:markdownContent}} 
                            />
                        </Col>
                    </Row>
                </Col>
                <Col span={6}>
                    <Row>
                        <Col span={24}>
                            <Button size="large">暂存文章</Button>&nbsp;
                            <Button type="primary" size="large" onClick={saveArticle}>发布文章</Button>
                            <br/>
                        </Col>
                        <Col span={24}>
                            <br/>
                            <TextArea rows={4} placeholder="文章简介" value={introducemd} onChange={changeInyroduce}/>
                            <br/><br/>
                            <div 
                                className="introduce-html" 
                                dangerouslySetInnerHTML={{__html:introducehtml}}
                            />
                        </Col>
                        <Col span={12}>
                            <div className="date-select">
                                <DatePicker placeholder="发布日期" size="large" onChange={(date,dateString) => {setShowDate(dateString)}}/>
                            </div>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </div>
    )
}

export default AddArticle