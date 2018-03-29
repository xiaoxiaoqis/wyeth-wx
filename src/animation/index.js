console.log('directive init..........')

const animation = weex.requireModule('animation')

Vue.directive('animation', function (el, binding, vnode) {
  console.log('start animation in animation.js')
  const v = binding.value
  if (v) {
    if (process.env.COMPILE_ENV === 'vue') {
      animation.transition({
        $el: el
      }, v)
    } else {
      console.log(el)
      console.log(v)
      animation.transition(el, v)
    }
  }
})

Vue.directive('color-swatch', function (el, binding) {
  console.log('color-swatch')
  el.style.backgroundColor = binding.value
})

Vue.directive('demo', {
  bind: function (el, binding, vnode) {
    var s = JSON.stringify
    el.innerHTML =
      'name: ' + s(binding.name) + '<br>' +
      'value: ' + s(binding.value) + '<br>' +
      'expression: ' + s(binding.expression) + '<br>' +
      'argument: ' + s(binding.arg) + '<br>' +
      'modifiers: ' + s(binding.modifiers) + '<br>' +
      'vnode keys: ' + Object.keys(vnode).join(', ')
  }
})
