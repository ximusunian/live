import Vue from 'vue'
import axios from 'axios';
// 设置全局axios的默认值
axios.defaults.timeout = 10000;
axios.defaults.baseURL = 'https://weachat.htyvip.com/huitongyi/';


// 拦截器
axios.interceptors.request.use(
    config => {
        config.headers = {
            'Content-Type': 'application/json;charset=UTF-8'
        };
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);
axios.interceptors.response.use(
    response => {
        if (response.status === 200 && response.data.code === 401) {
            router.push('/login').catch(err => {})
            return response;
        } else {
            return response;
        }
    },
    error => {
        // 错误提醒
        const { status } = error.response
        if (status == 401) {
            Toast('token值无效，请重新登录')
            router.push('/login') // 页面跳转
        }
        return Promise.reject(error);
    }
);

// get请求
export const get = (url, params = {}) => {
    return new Promise((resolve, reject) => {
        axios.get(url, { params }).then(res => {
            resolve(res.data);
        }).catch(err => {
            reject(err);
        });
    });
}

// post请求
export const post = (url, params = {}) => {
    return new Promise((resolve, reject) => {
        axios.post(url, params).then(res => {
            resolve(res.data);
        }).catch(err => {
            reject(err);
        });
    });
}

// delete请求
export const deleteAxios = (url, params = {}) => {
    return new Promise((resolve, reject) => {
        axios.delete(url, { params }).then(res => {
            resolve(res.data);
        }).catch(err => {
            reject(err);
        });
    });
}

// put 请求
export const put = (url, params = {}) => {
    return new Promise((resolve, reject) => {
        axios.put(url, params).then(res => {
            resolve(res.data);
        }).catch(err => {
            reject(err);
        });
    });
}

export default axios