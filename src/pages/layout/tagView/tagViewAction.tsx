import type { FC } from 'react';

import { SettingOutlined } from '@ant-design/icons';
import { Dropdown } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { LocaleFormatter } from '@/locales';
import { removeAllTag, removeOtherTag, removeTag } from '@/stores/tags-view.store';

const TagsViewAction: FC = () => {
  const { activeTagId, tags } = useSelector(state => state.tagsView);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const closeCurrent = () => {
    const indexTargetKey = tags.findIndex(tag => tag.path === activeTagId);

    if (indexTargetKey === tags.length - 1) {
      navigate(tags[indexTargetKey - 1].path);
    }

    dispatch(removeTag(activeTagId));
  };

  const closeOther = () => {
    dispatch(removeAllTag());
    navigate('/dashboard');
  };

  return (
    <Dropdown
      menu={{
        items: [
          {
            key: '0',
            onClick: () => closeCurrent(),
            // label: <LocaleFormatter id="tagsView.operation.closeCurrent" />,
            label: 'Đóng tab hiện tại',
          },
          {
            key: '1',
            onClick: () => dispatch(removeOtherTag()),
            // label: <LocaleFormatter id="tagsView.operation.closeOther" />,
            label: 'Đóng các tab còn lại',
          },
          {
            key: '2',
            onClick: () => closeOther(),
            // label: <LocaleFormatter id="tagsView.operation.closeAll" />,
            label: 'Đóng hết',
          },
          {
            key: '3',
            type: 'divider',
          },
          {
            key: '4',
            onClick: () => navigate('/dashboard'),
            label: <LocaleFormatter id="tagsView.operation.dashboard" />,
          },
        ],
      }}
    >
      <span id="pageTabs-actions">
        <SettingOutlined className="tagsView-extra" />
      </span>
    </Dropdown>
  );
};

export default TagsViewAction;
