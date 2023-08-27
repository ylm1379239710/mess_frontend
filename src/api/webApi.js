import request from "@/utils/request";

export function getUserInfo() {
    return request({
        method: "get",
        url: "/user/getUserInfo"
    })
}

export function getHomeData(data) {
    return request({
        method: "get",
        url: "/home?orderMode=" + data
    })
}

export function checkKaptcha(checkCode) {
    return request({
        method: "get",
        url: "/checkKaptchaCode",
        params: {
            "checkCode": checkCode
        }
    })
}

export function login(username, password, rememberMe) {
    return request({
        method: "post",
        url: "/login",
        params: {
            "username": username,
            "password": password,
            "rememberMe": rememberMe
        }
    })
}

export function register(username, password, email, phone, province, city, area, birthData,nickname) {
    return request({
        method: "post",
        url: "/register",
        data: {
            "username": username,
            "password": password,
            "email": email,
            "phone": phone,
            "province": province,
            "city": city,
            "area": area,
            "birthData": birthData,
            "nickname":nickname
        }
    })
}

export function loginOut() {
    return request({
        method: "get",
        url: "/logout",
    })
}



export function findTranInfoByCondition(currentPage, pageSize, queryStrings) {
    return request({
        method: "post",
        url: "/discussPost/findDiscussPostByCondition",
        headers: {
            'Content-Type': 'application/json; charset=utf-8'
        },
        data: {
            "currentPage": currentPage,
            "pageSize": pageSize,
            "queryStrings": queryStrings
        }
    })
}

export function addTranInfo(title, content, type) {
    return request({
        method: "post",
        url: "/discussPost/add",
        headers: {
            'Content-Type': 'application/json; charset=utf-8'
        },
        data: {
            "title": title,
            "content": content,
            "type": type,
        }
    })
}

export function getTranInfoDetail(id, currentPage, pageSize) {
    return request({
        method: "post",
        url: "/discussPost/detail/" + id,
        headers: {
            'Content-Type': 'application/json; charset=utf-8'
        },
        data: {
            "currentPage": currentPage,
            "pageSize": pageSize,
            "queryStrings": null,
        }
    })
}

export function addComment(postId, entityType, entityId, targetId, content) {
    return request({
        method: "post",
        url: "/comment/add/" + postId,
        headers: {
            'Content-Type': 'application/json; charset=utf-8'
        },
        data: {
            "content": content,
            "entityType": entityType,
            "entityId": entityId,
            "targetId": targetId,
        }
    })
}

export function like(entityType, entityId, entityUserId, postId) {
    return request({
        method: "post",
        url: "/like",
        headers: {
            'Content-Type': 'application/json; charset=utf-8'
        },
        params: {
            "entityType": entityType,
            "entityId": entityId,
            "entityUserId": entityUserId,
            "postId": postId,
        }
    })
}

export function findBlackListByCondition(currentPage, pageSize, queryStrings) {
    return request({
        method: "post",
        url: "/blackList/findBlackListByCondition",
        headers: {
            'Content-Type': 'application/json; charset=utf-8'
        },
        data: {
            "currentPage": currentPage,
            "pageSize": pageSize,
            "queryStrings": queryStrings
        }
    })
}

export function uploadPic(file) {
    return request({
        method: "post",
        url: "/discussPost/uploadPic",
        headers: {
            'Content-Type': 'application/json; charset=utf-8'
        },
        data: {
            "imageFile": file,
        }
    })
}
export function noticeList() {
    return request({
        method: "get",
        url: "/notice/list",
        headers: {
            'Content-Type': 'application/json; charset=utf-8'
        },
    })
}

export function addBlackList(personInvolved, accountId, behaviorDescription, wyAccount, reportUser) {
    return request({
        method: "post",
        url: "/blackList/addBlackList",
        headers: {
            'Content-Type': 'application/json; charset=utf-8'
        },
        data: {
            "personInvolved": personInvolved,
            "accountId": accountId,
            "behaviorDescription": behaviorDescription,
            "wyAccount": wyAccount,
            "reportUser": reportUser
        }
    })
}
export function getAllBanner() {
    return request({
        method: "get",
        url: "/banner/findAllBanner",
        headers: {
            'Content-Type': 'application/json; charset=utf-8'
        },
    })
}


export function getAllCommentByTargetId(currentPage, pageSize, queryStrings) {
    return request({
        method: "post",
        url: "/comment/getAllCommentByTargetId",
        headers: {
            'Content-Type': 'application/json; charset=utf-8'
        },
        data: {
            "currentPage": currentPage,
            "pageSize": pageSize,
            "queryStrings": queryStrings
        }
    })
}

export function read() {
    return request({
        method: "get",
        url: "/notice/read",
    })
}

export function deleteTranInfoById(id) {
    return request({
        method: "post",
        url: "/discussPost/delete?id="+id,
        headers: {
            'Content-Type': 'application/json; charset=utf-8'
        }
    })
}