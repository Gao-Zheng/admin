let ipUrl = 'http://127.0.0.1:7001/admin/' 

let servicePath = {
    checkLogin:ipUrl + 'checkLogin',  //  后台登录
    getTypeInfo:ipUrl + 'getTypeInfo',  //  活动文章类别信息
    addArticle:ipUrl + 'addArticle',  //  添加文章信息
    updateArticle:ipUrl + 'updateArticle',  //  修改文章信息
    getArticleList:ipUrl + 'getArticleList' ,  //  文章列表
    delArticle:ipUrl + 'delArticle/' ,  //  删除文章
    getArticleById:ipUrl + 'getArticleById/' ,  //  根据ID获得文章详情
}

export default servicePath;