import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {config} from '../../constants';

axios.defaults.baseURL = config.API_BASE_URL;

// 요청 인터셉터: 모든 요청에 대해 처리
axios.interceptors.request.use(async config => {
  const token = await AsyncStorage.getItem('accessToken');
  // const parseToken = token
  //   ?.split('')
  //   ?.filter(v => v !== '"')
  //   ?.join('');

  // const userAgent = await DeviceInfo.getUserAgent();

  // config.headers['User-Agent'] = `${userAgent} ;appName=spolive`;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  } else {
  }

  return config;
});

// 응답 인터셉터: 모든 응답에 대해 처리
axios.interceptors.response.use(onFulfil);
// axios.interceptors.response.use(onFulfil, async (error) => {
//   if (error.response?.status === 401) {
//

//     // removeStorage("user");
//     // removeStorage("token");
//     // // setUser({});
//     // OneSignal.logout();
//     // NavigationContainerRef.reset({
//     //   routes: [
//     //     {
//     //       name: "login",
//     //     },
//     //   ],
//     // });
//   }
// });

const onFulfil = async response => {
  return response;
};

const onReject = async error => {};

// axios.interceptors.response.use(async (error) => {
//
// });

const responseBody = response => response?.data;

const request = {
  get: async url => {
    const response = await axios.get(url);
    return responseBody(response);
  },
  post: (url, body) => axios.post(url, body).then(responseBody),

  postXf: (url, body) =>
    axios
      .post(url, body, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        },
      })
      .then(responseBody),
  registPost: (url, body) =>
    axios
      .post(url, body, {
        headers: {'Content-Type': 'multipart/form-data'},
      })
      .then(responseBody),
  joinPost: (url, body) =>
    axios
      .post(url, body, {
        headers: {'Content-Type': 'multipart/form-data'},
      })
      .then(responseBody),
  editPost: (url, body) =>
    axios
      .post(url, body, {
        headers: {'Content-Type': 'multipart/form-data'},
      })
      .then(responseBody),
};

export default request;
