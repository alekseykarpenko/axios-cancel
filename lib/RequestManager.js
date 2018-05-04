export default class RequestManager {

  constructor(options = {}) {
    this.options = options;
    this.pendingRequests = {};
  }

  addRequest(requestId, cancelFn) {

    this.log(`adding request \`${requestId}\``);

    if (this.has(requestId)) {
      this.pendingRequests[requestId].push(cancelFn);
    } else {
      this.pendingRequests[requestId] = [cancelFn];
    }
  }

  removeRequest(requestId) {
    this.log(`removing request \`${requestId}\``);

    delete this.pendingRequests[requestId];
  }

  cancelRequest(requestId, reason = `\`cancelRequest(${requestId})\` from \`RequestManager.cancelRequest\``) {
    this.log(`cancelling request \`${requestId}\``);

    if (this.has(requestId) && this.pendingRequests[requestId].length > 0) {
      for(let fn of this.pendingRequests[requestId]) {
          fn(reason);
      }
      this.removeRequest(requestId);

      this.log(`request \`${requestId}\` cancelled`);
    }
  }

  cancelAllRequests(reason) {
    for (let requestId in this.pendingRequests) {
      let _reason = reason || `\`cancelRequest(${requestId})\` from \`RequestManager.cancelAllRequests\``;
      this.cancelRequest(requestId, _reason);
    }
  }

  has(requestId) {
    return !!this.pendingRequests[requestId];
  }

  log(message) {
    if (this.options.debug === true) {
      console.log(message);
    }
  }
}
