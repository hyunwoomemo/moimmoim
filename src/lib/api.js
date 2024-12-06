import request from './axios';

export const moimApi = {
  getCategory: () => {
    return request.get('/moim/category');
  },
  getMoreMessage: ({meetings_id, length}) =>
    request.post('/moim/getMoreMessage', {meetings_id, length}),
  likeMoim: ({meetings_id, users_id}) =>
    request.post('/moim/likeMoim', {meetings_id, users_id}),
};

export const authApi = {
  login: ({email, password}) => {
    return request.post('/auth/login', {email, password});
  },
  getUserInfo: () => {
    return request.get('/user/myInfo');
  },
};
