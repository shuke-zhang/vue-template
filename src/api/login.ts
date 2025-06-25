import type { LoginParams, UserModel } from '@/model/user';

/** 请求验证码 */
export function getCodeImg(ignoreRepeatRequest?: boolean) {
  return request.get<{
    msg: string
    img: string
    code: string
    captchaEnabled: string
    uuid: string
  }>({
    url: '/captchaImage',
    withToken: false,
    ignoreRepeatRequest,
  });
}

export function loginApi(data: LoginParams) {
  return request.post<{
    msg: string
    accessToken: string
  }>({
    url: '/login',
    data,
    withToken: false,
  });
}
/** 获取用户详细信息 */
export function getUserInfo() {
  return request.get<ResponseData<UserModel>>({
    url: '/getInfo',
  });
}