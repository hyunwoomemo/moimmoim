import moment from 'moment';

export const parseMessages = data => {
  const groupedData = data.reduce((result, cur, i, arr) => {
    try {
      // 시간 별 그룹화

      const time = moment(cur.created_at).format('YY-MM-DD HH:mm');
      const users_id = cur.users_id;
      const key = time + '-' + users_id;
      // const key = time;
      const itemKey = time + '-' + users_id + '-' + cur.id;

      if (!result[key]) {
        console.log('dsmfksmdfkm');
        result[key] = [[cur]];
      }

      console.log('zxczxc', result[key]);
      if (i > 0) {
        if (arr[i - 1].users_id != cur.users_id) {
          result[key].push([cur]);
        } else {
          result[key][result[key].length - 1].push(cur);
        }
      }
      console.log('resultresultresultresult', result);

      return result;
    } catch (err) {
      console.error('err', err);
    }
  }, {});

  const arr = [];

  for (const key in groupedData) {
    const data = groupedData[key].map((v, i, arr) => {
      return v.map((v1, i1, arr1) => {
        if (arr1.length === 1) {
          return {...v1, end: true, first: true};
        } else {
          if (i1 === 0) {
            delete v1.end;
            delete v1.first;

            return {...v1, end: true};
          } else if (i === arr1.length - 1) {
            delete v1.end;
            delete v1.first;

            return {...v1, first: true};
          } else {
            delete v1.end;
            delete v1.first;

            return v1;
          }
        }
      });
    });

    arr.push(...data);
  }

  console.log('zxcasdasd', arr);

  return arr;
};

export const nextParseMessages = data => {
  const formatData = data.reverse().map(item => ({
    ...item,
    formattedDate: moment(item.created_at).format('YY-MM-DD HH:mm'),
  }));

  const result = formatData.map((v, i, arr) => {
    const prev = arr[i - 1];
    const next = arr[i + 1];

    const isSameUser = (a, b) => a?.users_id === b?.users_id;
    const isSameDate = (a, b) => a?.formattedDate === b?.formattedDate;

    const first = !isSameUser(v, prev) || !isSameDate(v, prev);
    const end = !isSameUser(v, next) || !isSameDate(v, next);

    return {...v, first, end};
  });

  return result.reverse();
};
