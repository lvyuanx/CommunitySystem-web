import { IORequest, postRequest, getRequest, uploadFileRequest } from './request'

// 用户登录
export const loginReq = (params, data) => {
	return postRequest('/author/user/login', params, data)
}
// 验证码
export const captchaReq = (params, data) => {
	return IORequest('/commons/captcha/default', params, data)
}
// 重复性请求
export const isRepeatReq = (params, data) => {
	return postRequest('/author/user/nameIsRepeat', params, data)
}

// 用户注册
export const registerReq = (params, data) => {
	return postRequest('/author/user/insertUser', params, data)
}

// 用户退出登录
export const logoutReq = (params, data) => {
	return getRequest('/author/user/logout', params, data)
}

// 查询用户登录信息
export const loginInfoReq = (params, data) => {
	return getRequest('/author/user/loginInfo', params, data)
}

// 用户密码修改
export const updatePasswordReq = (params, data) => {
	return postRequest('/author/user/updatePassword', params, data)
}

// 用户信息修改
export const updateUserInfoReq = (params, data) => {
	return postRequest('/author/user/updateUserInfo', params, data)
}

// 获取图片
export const getImageReq = (params, data) => {
	return IORequest('/commons/file/getImageForPath', params, data)
}

// 文件上传
export const uploadFileReq = data => {
	return uploadFileRequest('/commons/file/fileUpload', data)
}

// ====== 期，栋，单元，层，户统一接口=====start
// 添加
export const addReq = (url, params, data) => {
	return postRequest('/community/' + url + '/add', params, data)
}

// 查询
export const findReq = (url, params, data) => {
	return getRequest('/community/' + url + '/find', params, data)
}

// 查询所有
export const findAllReq = (url, params, data) => {
	return getRequest('/community/' + url + '/findAll', params, data)
}
// ====== 期，栋，单元，层，户统一接口=====end

// 查询社区详情
export const findCommunityInfoReq = (params, data) => {
	return getRequest('/community/period/findCommunityInfo', params, data)
}

// 查询社区栋详情
export const findByPerionIdReq = (params, data) => {
	return getRequest('/community/building/findByPerionId', params, data)
}

// 查询单元详情
export const findUnitInfoByBuindingReq = (params, data) => {
	return getRequest('/community/unit/findUnitInfoByBuilding', params, data)
}

// 查询社区级联详情
export const findAllCommunityInfoReq = (params, data) => {
	return getRequest('/community/period/findAllCommunityInfo', params, data)
}

// 绑定角色房间信息信息
export const bindRoleAndHouseholdReq = (params, data) => {
	return postRequest('/author/user/bindRoleAndHousehold', params, data)
}

// 查询用户住址信息
export const findInfoByUserReq = (params, data) => {
	return getRequest('/community/period/findInfoByUser', params, data)
}

// 体温打卡
export const CTRAddReq = (params, data) => {
	return postRequest('/community/temperatureRegistration/add', params, data)
}

// 查询连续打卡天数
export const continuousDayReq = params => {
	return getRequest('/community/temperatureRegistration/continuousDay', params)
}

// 查询连续打卡天数
export const qrCodeGetByUserReq = params => {
	return IORequest('/community/QrCode/getByUser', params)
}

// 添加出入登记信息
export const inAndOutAddReq = (params, data) => {
	return postRequest('/community/InAndOut/add', params, data)
}

// 查询用户二维码详情
export const qrCodeGetInfoByUserReq = params => {
	return getRequest('/community/QrCode/getInfoByUser', params)
}

// 添加出入登记信息
export const findUserHouseholdReq = (params, data) => {
	return postRequest('/community/householdUser/findUserHousehold', params, data)
}

// 添加出入登记信息
export const updateHouseholdUserReq = params => {
	return getRequest('/community/householdUser/updateHouseholdUser', params)
}
// 用户审批
export const householdExaminationReq = params => {
	return getRequest('/author/user/householdExamination', params)
}

// 添加异常信息
export const addExceptionReq = (params, data) => {
	return postRequest('/community/exception/add', params, data)
}

// 查询异常信息
export const findExceptionReq = (params, data) => {
	return postRequest('/community/exception/findListByQuery', params, data)
}

// 查询异常信息
export const updateStatusReq = params => {
	return getRequest('/community/exception/updateStatus', params)
}

// 查询用户列表
export const findUserListReq = (params, data) => {
	return postRequest('/author/user/findUserList', params, data)
}

// 查询异常信息
export const changeCodeReq = params => {
	return getRequest('/community/QrCode/changeCode', params)
}

// 重置密码
export const resetPasswordReq = params => {
	return getRequest('/author/user/resetPassword', params)
}

// 删除用户
export const deleteUserReq = params => {
	return getRequest('/author/user/deleteUser', params)
}

// 查询用户功能
export const findUserFunctionReq = params => {
	return getRequest('/author/Role/findUserFunction', params)
}

// 添加社区角色
export const addCommunityRoleReq = (params, data) => {
	return postRequest('/author/Role/addCommunityRole', params, data)
}

// 查询社区角色
export const findCommunityRoleReq = params => {
	return getRequest('/author/Role/findCommunityRole', params)
}

// 删除角色
export const deleteRoleReq = params => {
	return getRequest('/author/Role/deleteRole', params)
}

// 删除角色
export const editUserRoleReq = params => {
	return getRequest('/author/Role/editUserRole', params)
}

// 删除角色
export const findAllUserReq = params => {
	return getRequest('/author/user/findAllUser', params)
}

// 发送邮件提醒
export const sendSimpleMessageReq = (params, data) => {
	return postRequest('/mail/message/sendSimpleMessage', params, data)
}

// 查询邮件信息
export const findMessageReq = params => {
	return getRequest('/mail/message/findMessage', params)
}

// 修改邮件信息
export const readMessageReq = params => {
	return getRequest('/mail/message/readMessage', params)
}

// 查询用户提交记录
export const trFindListReq = params => {
	return getRequest('/community/temperatureRegistration/findList', params)
}

// 查询登录用户是否含有住址信息
export const checkUserHasAddressReq = params => {
	return getRequest('/community/period/checkUserHasAddress', params)
}
