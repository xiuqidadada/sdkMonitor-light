/**
 * @requestUrl 接口地址
 * @historyTracker history上报
 * @hashTracker hash上报
 * @domTracker 携带Tracker-key 点击事件上报
 * @sdkVersionsdk版本
 * @extra透传字段
 * @jsError js 和 promise 报错异常上报
*/
export interface DefaultOptons {
    uuid: string | undefined,
    requestUrl: string | undefined,
    historyTracker: boolean,
    hashTracker: boolean,
    domTracker: boolean,
    sdkVersion: string | number,
    extra: Record<string, any> | undefined,
    jsError:boolean,
    whiteScreen:boolean
  }
  
  //用户必传参数
  export interface Options extends Partial<DefaultOptons> {
    requestUrl: string
  }
  
  //版本号
  export enum Trackerversion {
    version = "1.0.0"
  }
  