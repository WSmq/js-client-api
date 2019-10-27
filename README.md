# CloudWS javacsript client

#### Installation
```
npm install @cloudws/js-client-api
```
or
```
yarn add @cloudws/js-client-api
```

#### Getting started
```javascript
import cloudWS from '@cloudws/js-client-api';
```

#### Subscription
```javascript
const subscriptionId = cloudWS.sub(CHANNEL_ID)
```

#### Unsubscription
```javascript
cloudWS.un(subscriptionId)
```

#### Example
```javascript
import cloudWS from '@cloudws/js-client-api';

let subId;
subId = cloudWS.sub('h1b0DJmmV6mwWTzvbi91nlkbdVQRux2RNDU4TgdGk4U', (data) => {
    console.info(data);
    cloudWS.unsub(subId);
});
```

