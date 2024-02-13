src/
├── components/               # 通用组件
│   ├── Button/
│   │   ├── Button.jsx
│   │   └── button.css
│   ├── NavBar/
│   │   ├── NavBar.jsx
│   │   └── navbar.css
│   └── ...
├── containers/               # 容器组件，负责处理逻辑和状态管理
│   ├── Home/
│   │   ├── Home.jsx
│   │   └── home.css
│   ├── About/
│   │   ├── About.jsx
│   │   └── about.css
│   └── ...
├── assets/                   # 静态资源，如图片、样式表和字体
│   ├── images/
│   │   ├── logo.svg
│   │   └── ...
│   └── styles/
│       ├── index.css
│       ├── reset.css
│       └── ...
├── utils/                    # 实用程序和帮助函数
│   ├── api.js                # API调用相关
│   └── utils.js              # 通用工具函数
├── redux/                    # Redux相关的actions、reducers
│   ├── store.js
│   ├── actions/
│   └── reducers/
├── App.js                    # 应用的根组件
├── index.js                  # 应用的入口文件
├── reportWebVitals.js
└── setupTests.js
