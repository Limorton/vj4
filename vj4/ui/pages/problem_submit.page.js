import { NamedPage } from 'vj/misc/PageLoader';
import i18n from 'vj/utils/i18n';
import Notification from 'vj/components/notification';

const page = new NamedPage('problem_submit', async () => {
  $(document).on('click', '[name="problem-sidebar__show-category"]', ev => {
    $(ev.currentTarget).hide();
    $('[name="problem-sidebar__categories"]').show();
  });
  document.getElementsByName('code')[0].setAttribute('maxlength', '10005');
  document.querySelector('.form_submit').addEventListener('click', ev => {
    const len = document.getElementsByName('code')[0].value.length;
    if (len > 10000 || len < 10) {
      Notification.error(i18n('Code is longer than 10000 or shorter than 10, submit failed.'));
      ev.preventDefault();
    }
  });
});

export default page;
