# babel-plugin-tntd-utils

## 安装
```
npm install babel-plugin-tntd-utils --save-dev
```
### 使用说明
```
// .babelrc
"plugins": [
    [
      "babel-plugin-tntd-utils",
      {
        "library": "yournpm"
      },
      "syntax-decorators"
    ],
  ]
  
// index.js
import { helloworld } from 'yournpm';

      ↓ ↓ ↓ ↓ ↓ ↓

var _helloworld = require('yournpm/lib/helloworld');
```


