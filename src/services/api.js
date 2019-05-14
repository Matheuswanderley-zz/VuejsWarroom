import Vue from 'vue'
import axios from 'axios'

const baseUrl = 'http://localhost:3000/api/v1/dashboards/prev-1/'
const baseResource = 'deputados'

const buildQS = (obj) => {
  if (typeof obj !== 'object') {
    return obj
  }
  const qs = []
  for (const i in obj) {
    qs.push(`${i}=${obj[i]}`)
  }
  return encodeURI(qs.join('&'))
}

const request = (endpoint, params) => {
  let url = baseUrl
  if (endpoint !== baseResource) {
    url += baseResource
  }
  if (!params) {
    url += `/${endpoint}`
  } else if (typeof params !== 'object') {
    url += `/${params}/${endpoint}`
  } else {
    url += `/${endpoint}?${buildQS(params)}`  
  }
  return axios.get(url)
  
}

Vue.mixin( {
  beforeCreate() {
    const options = this.$options
    if (options.api )
      this.$api = options.api
    else {
      this.$api = request
    }
  },
})