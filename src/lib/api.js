import request from './axios';

export const moimApi = {
  getCategory: () => {
    return request.get('/moim/category');
  },
  getMoreMessage: ({meetings_id, length}) =>
    request.post('/moim/getMoreMessage', {meetings_id, length}),
};
