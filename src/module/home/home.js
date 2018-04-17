import util from 'src/util/index';
import './home.html';
import './home.css';

const app = {
  init() {
    this.initData()
      .then(json => {
        console.log(json);
        this.initUI();
      })
      .catch(err => {
        console.log(err);
        util.call('showToast', {
          content: 'err'
        });
      });
  },

  initData() {
    return util.ajax({
      operationType: 'alipay.mobile.foo',
      url: '/foo.json',
      method: 'post',
      trim: true,
      params: {
        timetag: +new Date(),
        trim: ' foo '
      },
      data: {
        timetag: +new Date(),
        trim: ' foo '
      }
    });
  },

  initUI() {
    // 初始化节点并监听事件
    document.querySelector('.foo-action').addEventListener('click', () => {
      this.clickBtn();
    });
  },

  clickBtn() {
    console.log('click btn');
  }
};

app.init();
window.app = app;
