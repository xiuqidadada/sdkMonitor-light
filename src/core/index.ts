import { DefaultOptons, Options, Trackerversion } from "./../type/index";
export default class Tracker {
  private data: Options;
  private histroryType: Partial<keyof History>[];
  private eventList: string[] = [
    "click",
    "dblclick",
    "contextmenu",
    "mousedown",
    "mouseup",
    "mouseenter",
    "mouseout",
    "mouseover",
  ];
  public constructor(options: Options) {
    this.histroryType = ["pushState", "replaceState"];
    this.data = Object.assign(this.initConfig(), options); //初始化配置对象
    this.installExtra();
  }
  private domTracker() {
    this.eventList.forEach((item) => {
      window.addEventListener(item, (e) => {
        let element = e.target as HTMLElement;
        let isTarget = element.getAttribute("target-key");
        if (isTarget) {
          const outerHTML = element.outerHTML || "";
          this.sendData({ type: "dom", data: outerHTML ,target:isTarget});
        }
      });
    });
  }

  //数据上报
  private sendData<T>(data: T) {
    const params = Object.assign({}, data, { time: new Date().toLocaleString() });
    let headers = {
      type: "application/x-www-form-urlencoded",
    };
    let blob = new Blob([JSON.stringify(params)], headers);
    console.log("blob", blob);
    console.log(this.data.requestUrl);

    navigator.sendBeacon(this.data.requestUrl, blob);
  }

  private jsError() {
    //1.脚本错误，资源错误
    window.addEventListener(
      "error",
      (e) => {
        e.preventDefault();
        const isErrorEvent: boolean = e instanceof ErrorEvent;
        if (!isErrorEvent) {
          //资源错误
          this.sendData({ type: "resource", msg: e.message });
          return;
        }
        this.sendData({ type: "js", msg: e.message });
      },
      true
    );
    //2.promise错误
    window.addEventListener(
      "unhandledrejection",
      (e: PromiseRejectionEvent) => {
        e.preventDefault();
        e.promise.catch((error) => {
          let msg = error?.message || error;
          this.sendData({ type: "promise", msg });
        });
      }
    );
  }
  //定制功能
  public installExtra() {
    //history
    if (this.data.historyTracker) {
      this.histroryType.forEach((item: keyof History) => {
        let origin = history[item];
        let eventHistory = new Event(item);
        (window.history[item] as any) = function (this: any) {
          origin.apply(this, arguments);
          window.dispatchEvent(eventHistory); 
        };
        window.addEventListener(item, () => {
          this.sendData({ type: "history", msg: item });
        });
      });
    }
    //hash
    if (this.data.hashTracker) {
      window.addEventListener("hashchange", (e) => {
        this.sendData({ type: "hash", msg: e });
      });
    }
    //dom手动上报
    if (this.data.domTracker) {
      this.domTracker();
    }
    //jsError
    if (this.data.jsError) {
      this.jsError();
    }
  }

  //初始化配置项
  private initConfig(): DefaultOptons {
    return <DefaultOptons>{
      sdkVersion: Trackerversion.version,
      historyTracker: false,
      hashTracker: false,
      domTracker: false,
      jsError: false,
    };
  }
}
