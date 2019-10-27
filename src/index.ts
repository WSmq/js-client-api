interface CallBackObject {
    channelId: string,
    subscriptionId: string,
    fn: (data: any) => void,
}

interface SubscriptionsMap {
    [key: string]: {
        ws: WebSocket,
        cb: CallBackObject[]
    },
}

interface CallBackMap {
    [key: string]: CallBackObject,
}

class CloudWSAPI {
    private cloudWSUrl = 'wss://cloudws.io';
    private subscriptionsMap: SubscriptionsMap = {};
    private callBackMap: CallBackMap = {};

    sub(channelId: string, cb: (data: any) => void): string {
        if (!this.subscriptionsMap[channelId]) {
            this.subscriptionsMap[channelId] = {
                ws: new WebSocket(`${this.cloudWSUrl}/event/${channelId}`),
                cb: [],
            };

            this.subscriptionsMap[channelId].ws.onmessage = event => {
                const parsedData = JSON.parse(event.data.toString());
                this.subscriptionsMap[channelId].cb.forEach(cbObject => cbObject.fn(parsedData));
            };
        }
        const subId = (Math.random() * 100000).toFixed();
        this.callBackMap[subId] = {
            channelId,
            subscriptionId: subId,
            fn: cb
        };
        this.subscriptionsMap[channelId].cb.push(this.callBackMap[subId]);
        return subId;
    }

    unsub(subId: string) {
        if (this.callBackMap[subId] == null) {
            return;
        }

        const cbObject = this.callBackMap[subId];
        const subscription = this.subscriptionsMap[cbObject.channelId];
        subscription.cb = subscription.cb.filter(cbFromSub => cbFromSub.subscriptionId != subId);
        if ( this.subscriptionsMap[cbObject.channelId].cb.length === 0) {
            this.subscriptionsMap[cbObject.channelId].ws.close();
            delete this.subscriptionsMap[cbObject.channelId];
        }

        delete  this.callBackMap[subId];
    }
}

const cloudWSSingletone =  new CloudWSAPI();

export default cloudWSSingletone;
