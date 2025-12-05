import qs from 'qs'

/** 获取用户详细信息 */
export function getSerialize(idList: number[]) {
  return request.get({
    url: '/getInfo',
    params: {
      idList,
    },
    paramsSerializer: {
      serialize: (params) => {
        return qs.stringify(params, { arrayFormat: 'repeat' })
      },
    },
  })
}
