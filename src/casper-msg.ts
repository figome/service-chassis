
export class CasperMsg<T> {
  public readonly url: string;
  public readonly req: any;
  public readonly res: any;
  public readonly payload?: T;

  public static create<T>(url: string, payload?: T): CasperMsg<T> {
    return new CasperMsg(url, null, null, payload);
  }

  public static from(req: any, res: any): CasperMsg<any> {
    let payload: any;
    try {
      if (req.postRaw) {
        console.log('>>>>', req.postRaw, '<<<<<');
        payload = JSON.parse(req.postRaw);
      }
    } catch (e) {
      console.error('CasperMsg:error', e, req);
      return null;
    }
    return new CasperMsg(req.url, req, res, payload);
  }

  constructor(url: string, req: any, res: any, payload?: T) {
    this.url = url;
    this.req = req;
    this.res = res;
    this.payload = payload;
  }

  public toObject(): any {
    return {
      url: this.url,
      payload: this.payload
    };
  }

}

export default CasperMsg;
