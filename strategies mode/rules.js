const NOEMPTY = 'noEmpty'; // 非空
const MINLENGTH = 'minLength'; // 最小长度
const MAXLENGTH = 'maxLength'; // 最大长度

const strategies = {
  // 非空
  [NOEMPTY]: (value, errMsg) => {
    if (value === '') {
      return errMsg;
    }
  },
  // 最小长度
  [MINLENGTH]: (value, length, errMsg) => {
    if (!value || value.length < length) {
      return errMsg;
    }
  },
  // 最大长度
  [MAXLENGTH]: (value, length, errMsg) => {
    if (value.length > length) {
      return errMsg;
    }
  }
};

// 创建验证器
let Validator = function (strategies) {
  this.strategies = strategies;
  // 存储校验规则
  this.cache = [];
}

// 添加校验规则
Validator.prototype.add = function (dom, rules) {
  rules.forEach(item => {
    this.cache.push(() => {
      let value = dom.value;
      let arr = item.rule.split(',');
      let name = arr.shift();
      let params = [value, ...arr, item.errMsg];

      // apply保证上下文一致
      return this.strategies[name].apply(dom, params);
    });
  });
}

// 校验结果
Validator.prototype.validate = function (dom, rules, errMsg) {
  // 遍历cache中的校验函数
  for (let i = 0, validateFunc; validateFunc = this.cache[i++];) {
    const message = validateFunc();
    if (message) return message
  }
}
