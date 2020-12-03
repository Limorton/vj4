import _ from 'lodash';

import { NamedPage } from 'vj/misc/PageLoader';
import Notification from 'vj/components/notification';

import request from 'vj/utils/request';
import delay from 'vj/utils/delay';
import i18n from 'vj/utils/i18n';

const page = new NamedPage('home_domain', () => {
  async function handleHighlight(ev) {
    var cur = event.srcElement;
    const uid = $(cur).closest("tr").attr("data-uid");
    const domain = $(cur).closest("tr").attr("data-domain-id");
    const highlight = $(cur).closest("tr").attr("data-highlight");
    const change = (highlight=='highlight' ? 1 : 0);
    try {
      await request.post('', {
        operation: 'highlight_unhighlight',
        domain_id: domain,
        uid:uid,
        highlight: change,
      });
      if (change)
        Notification.success(i18n('Domain {0} has been pinned.', domain));
      else
        Notification.success(i18n('Domain {0} has been unpinned.', domain));
      await delay(2000);
      window.location.reload();
    } catch (error) {
      Notification.error(error.message);
    }
  }
  $(document).on('click', '[name="highlight"]', ev => {
    handleHighlight(ev);
  });
});

export default page;
