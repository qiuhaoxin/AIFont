import 'babel-polyfill'

import dva from 'dva';

import './index.less';

const app=dva({

});


app.model(require('./models/global'))


app.router(require('./router'));


app.start("#root")

