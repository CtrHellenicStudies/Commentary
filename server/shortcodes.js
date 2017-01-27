
import { shortcode } from 'shortcode-parser';

shortcode.add('keyword', (buf) => {
  return `<span data-keyword='${buf}'>${buf}</span>`;
});

shortcode.add('keyidea', (buf) => {
  return `<span data-keyidea='${buf}'>${buf}</span>`;
});
