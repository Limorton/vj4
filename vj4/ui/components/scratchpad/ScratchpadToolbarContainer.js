import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import i18n from 'vj/utils/i18n';
import request from 'vj/utils/request';
import Notification from 'vj/components/notification';
import * as languageEnum from 'vj/constant/language';
import Icon from 'vj/components/react/IconComponent';
import Toolbar, {
  ToolbarItemComponent as ToolbarItem,
  ToolbarButtonComponent as ToolbarButton,
  ToolbarSplitComponent as ToolbarSplit,
} from './ToolbarComponent';

function isTestCaseDataValid(data) {
  return data.input.trim().length > 0 && data.output.trim().length > 0;
}

function isPretestValid(state) {
  return _.some(state.tabs, id => isTestCaseDataValid(state.data[id]));
}

const mapStateToProps = state => ({
  pretestVisible: state.ui.pretest.visible,
  recordsVisible: state.ui.records.visible,
  isPosting: state.ui.isPosting,
  editorLang: state.editor.lang,
  editorCode: state.editor.code,
  pretest: state.pretest,
  pretestValid: isPretestValid(state.pretest),
});

const mapDispatchToProps = dispatch => ({
  loadSubmissions() {
    dispatch({
      type: 'SCRATCHPAD_RECORDS_LOAD_SUBMISSIONS',
      payload: request.get(Context.getSubmissionsUrl),
    });
  },
  togglePanel(uiElement) {
    dispatch({
      type: 'SCRATCHPAD_UI_TOGGLE_VISIBILITY',
      payload: { uiElement },
    });
  },
  setEditorLanguage(lang) {
    dispatch({
      type: 'SCRATCHPAD_EDITOR_SET_LANG',
      payload: lang,
    });
  },
  postPretest(props) {
    if ($('.scratchpad__toolbar__pretest').hasClass('disabled') === true) {
      Notification.error(i18n('Code submition failed, please retry after 10s.'));
      return;
    }
    const testCases = props.pretest.tabs
      .filter(tabId => isTestCaseDataValid(props.pretest.data[tabId]));
    // const titles = testCases.map(tabId => pretest.meta[tabId].title);
    const inputs = testCases.map(tabId => props.pretest.data[tabId].input);
    const outputs = testCases.map(tabId => props.pretest.data[tabId].output);
    if (props.editorCode.length > 10000) {
      Notification.error(i18n('Code is longer than 10000, submit failed.'));
      return;
    }
    if (Object.keys(inputs).length === 0 || Object.keys(outputs).length === 0) {
      Notification.error(i18n('Test data is invalid, please check.'));
      return;
    }
    const req = request.post(Context.postPretestUrl, {
      lang: props.editorLang,
      code: props.editorCode,
      data_input: inputs,
      data_output: outputs,
    });
    dispatch({
      type: 'SCRATCHPAD_POST_PRETEST',
      payload: req,
    });
    $('.scratchpad__toolbar__pretest').trigger('reSubmitCountDown');
  },
  postSubmit(props) {
    if ($('.scratchpad__toolbar__submit').hasClass('disabled') === true) {
      Notification.error(i18n('Code submition failed, please retry after 10s.'));
      return;
    }
    if (props.editorCode.length > 10000) {
      Notification.error(i18n('Code is longer than 10000, submit failed.'));
      return;
    }
    const req = request.post(Context.postSubmitUrl, {
      lang: props.editorLang,
      code: props.editorCode,
    });
    dispatch({
      type: 'SCRATCHPAD_POST_SUBMIT',
      payload: req,
    });
    $('.scratchpad__toolbar__submit').trigger('reSubmitCountDown');
  },
  handleClickRefresh() {
    this.loadSubmissions();
  },
  changeUiSize: _.debounce((uiElement, size) => {
    dispatch({
      type: 'SCRATCHPAD_UI_CHANGE_SIZE',
      payload: {
        uiElement,
        size,
      },
    });
  }, 500),
});

@connect(mapStateToProps, mapDispatchToProps)
export default class ScratchpadToolbarContainer extends React.PureComponent {
  static contextTypes = {
    store: PropTypes.object,
  };

  componentDidMount() {
    this.props.loadSubmissions();
  }

  handleChangeSize(uiElement, size) {
    this.props.changeUiSize(uiElement, size);
    // $('#scratchpad').trigger('vjScratchpadRelayout');
  }

  handleQuitScratchpad() {
    $('.scratchpad__toolbar__quitscratchpad').trigger('quitScratchpad');
  }

  render() {
    return (
      <Toolbar>
        <ToolbarButton
          className="scratchpad__toolbar__halfscreen"
          onClick={() => this.handleChangeSize('main', '65%')}
          data-global-hotkey="esc"
          data-tooltip={`${i18n('Quit Full Screen')} (ESC)`}
        >
          <Icon name="zminus" />
        </ToolbarButton>
        <ToolbarButton
          className="scratchpad__toolbar__fullscreen"
          onClick={() => this.handleChangeSize('main', '100%')}
          data-global-hotkey="f11"
          data-tooltip={`${i18n('Enter Full Screen')} (F11)`}
        >
          <Icon name="zsquare" />
        </ToolbarButton>
        <ToolbarButton
          className="scratchpad__toolbar__quitscratchpad"
          onClick={() => this.handleQuitScratchpad()}
          data-global-hotkey="alt+q"
          data-tooltip={`${i18n('Quit Scratchpad')} (ALT+Q)`}
        >
          <Icon name="close" />
        </ToolbarButton>
        <ToolbarSplit />
        <ToolbarButton
          // disabled={this.props.isPosting || !this.props.pretestValid}
          className="scratchpad__toolbar__pretest"
          onClick={() => this.props.postPretest(this.props)}
          data-global-hotkey="f9"
          data-tooltip={`${i18n('Pretest Your Code')} (F9)`}
        >
          <Icon name="debug" />
          {' '}
          {i18n('Run Pretest')}
          {' '}
          (F9)
        </ToolbarButton>
        <ToolbarButton
          // disabled={this.props.isPosting}
          className="scratchpad__toolbar__submit"
          onClick={() => this.props.postSubmit(this.props)}
          data-global-hotkey="f10"
          data-tooltip={`${i18n('Submit Your Code')} (F10)`}
        >
          <Icon name="play" />
          {' '}
          {i18n('Submit Solution')}
          {' '}
          (F10)
        </ToolbarButton>
        <ToolbarItem>
          <select
            className="select"
            disabled={this.props.isPosting}
            value={this.props.editorLang}
            onChange={ev => this.props.setEditorLanguage(ev.target.value)}
          >
            {_.map(languageEnum.LANG_TEXTS, (val, key) => (
              <option value={key} key={key}>{val}</option>
            ))}
          </select>
        </ToolbarItem>
        <ToolbarSplit />
        <ToolbarButton
          activated={this.props.pretestVisible}
          onClick={() => this.props.togglePanel('pretest')}
          data-global-hotkey="alt+p"
          data-tooltip={`${i18n('Toggle Pretest Panel')} (Alt+P)`}
        >
          <Icon name="edit" />
          {' '}
          {i18n('Pretest')}
        </ToolbarButton>
        <ToolbarButton
          activated={this.props.recordsVisible}
          onClick={() => this.props.togglePanel('records')}
          data-global-hotkey="alt+r"
          data-tooltip={`${i18n('Toggle Records Panel')} (Alt+R)`}
        >
          <Icon name="flag" />
          {' '}
          {i18n('Records')}
        </ToolbarButton>
        <ToolbarButton
          disabled={this.props.isPosting}
          className="scratchpad__toolbar__refresh"
          onClick={() => this.props.handleClickRefresh()}
          data-global-hotkey="f8"
          data-tooltip={`${i18n('Refresh Records')} (F8)`}
        >
          <Icon name="refresh" />
          {' '}
          {i18n('Refresh Results')}
          {' '}
          (F8)
        </ToolbarButton>
      </Toolbar>
    );
  }
}
