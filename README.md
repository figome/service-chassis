# communimon
Communication interface for different endpoints.

## install

```shell
npm install communimon
```

## usage

```javascript
// with import
import communimon from 'communimon'

// or with require
const communimon = require('communimon').default
```

You can also require endpoints individually (primary focus is casperJs interoperability).

```javascript
const CasperJsProcessEndpoint = require('communimon/casperjsProcessEndpoint')

```