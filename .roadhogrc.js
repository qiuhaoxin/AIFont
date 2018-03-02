const path=require('path');
const merge=require('webpack-merge');

const ROOT_PATH = path.resolve(__dirname, '../')
//const SRC_PATH = path.resolve(ROOT_PATH, 'src')
const IS_DEV = process.env.NODE_ENV === 'development'
const BUILD_PATH = IS_DEV ? path.resolve(ROOT_PATH, 'dev') : path.resolve(ROOT_PATH, 'dist')
export default{
	//"entry":"src/login.js",
	entry:['src/login.js','src/index.js'],
	outputPath:path.resolve(BUILD_PATH),
	publicPath:'./',
	"extraBabelPlugins":[
       "transform-runtime",
       "transform-decorators-legacy",
       "transform-class-properties",
       ["import",{"libraryName":"antd","libraryDirectory":"lib","style":"css"}]
	],
	"env":{
	  "development":{
	     "extraBabelPlugins":[
	        "dva-hmr"
	     ]
	  }
	},
	"externals":{
        "g2":"G2"
	},
	"hash":true,
	"proxy":{
	    "/api":{
	        "target":"http://172.20.71.91:8888/rest",
	        "changeOrigin":true
	 
	    }
	}
} 