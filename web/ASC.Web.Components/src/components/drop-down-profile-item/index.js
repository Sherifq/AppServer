import React, { memo } from 'react'
import styled, { css } from 'styled-components'
import PropTypes from 'prop-types'
import Avatar from '../avatar'
import DropDownItem from '../drop-down-item'

const StyledDropDownItem = styled(DropDownItem)``

const StyledDropdownProfileItem = styled.div`
    ${StyledDropDownItem}
    padding: 0px;
    cursor: pointer;
    display: inline-block;
`;

const commonStyle = css`
    font-family: 'Open Sans',sans-serif,Arial;
    font-style: normal;
    color: #FFFFFF;
    margin-left: 60px;
    max-width:300px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
`;

const UserPreview = styled.div`
    position: relative;
    height: 76px;
    background: linear-gradient(200.71deg, #2274AA 0%, #0F4071 100%);
    border-radius: 6px 6px 0px 0px;
    padding: 15px;
    cursor: default;
    box-sizing: border-box;
`;

const AvatarWrapper = styled.div`
    display: inline-block;
    float: left;
`;

const UserNameWrapper = styled.div`
    font-size: 16px;
    line-height: 28px;

    ${commonStyle}
`;

const UserEmailWrapper = styled.div`
    font-weight: normal;
    font-size: 11px;
    line-height: 16px;

    ${commonStyle}
`;

// eslint-disable-next-line react/display-name
const DropDownProfileItem = memo(props => {
  //console.log("DropDownItem render");
  const { displayName, email, avatarRole, avatarSource } = props;

  return (
    <StyledDropdownProfileItem {...props}>
      <UserPreview {...props}>
        <AvatarWrapper>
          <Avatar size='medium'
            role={avatarRole}
            source={avatarSource}
            userName={displayName}
          />
        </AvatarWrapper>
        <UserNameWrapper>{displayName}</UserNameWrapper>
        <UserEmailWrapper>{email}</UserEmailWrapper>
      </UserPreview>
    </StyledDropdownProfileItem>
  );
});

DropDownProfileItem.propTypes = {
  displayName: PropTypes.string,
  email: PropTypes.string,
  avatarRole: PropTypes.oneOf(['owner', 'admin', 'guest', 'user']),
  avatarSource: PropTypes.string,
  className: PropTypes.string,
  id: PropTypes.string,
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array])
};

export default DropDownProfileItem