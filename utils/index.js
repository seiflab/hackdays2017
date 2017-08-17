import cheerio from 'cheerio-without-node-native';
import _ from 'lodash/fp';

const compact = (arr) => {
  var a = [];
  for (var ay in arr) {
    if (arr[ay]) {
      a.push(arr[ay]);
    }
  }
  return a;
};


export const parseForm = ({ key, contextPath }) => {
    const EMBEDDED_KEY = 'embedded:'
    const APP_KEY = 'app:';

    let parsedKey = '';


    if (key.indexOf(EMBEDDED_KEY) === 0) {
      parsedKey = key.substring(EMBEDDED_KEY.length);
    }

    if (parsedKey.indexOf(APP_KEY) === 0) {
      if (contextPath) {
        parsedKey = compact([contextPath, parsedKey.substring(APP_KEY.length)])
          .join('/')
          .replace(/\/([\/]+)/, '/');
      }
    }

    return parsedKey;
  };

  export const getFormInputNames = (form) => {
    const $ = cheerio.load(form);
    return $('.form-control').get().map((tag) => tag.attribs.name).join(',');
  }

  export const getInjectedForm = (form, data) => {
    const $ = cheerio.load(form);

    return _.pipe(
      _.toPairs,
      _.each(([key, obj]) => $(`input[cam-variable-name="${key}"]`).attr('value', obj.value)),
      () => $(':root').html()
    )(data);

  }
