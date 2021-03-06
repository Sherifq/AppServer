import React from "react";
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';
import { Heading } from 'asc-web-components';

const fontSize = css`
      ${props =>
      (props.type === 'menu' && 27) ||
      (props.type === 'content' && 21)
   }
   `;

const StyledHeading = styled(Heading)`
   margin: 0;
   line-height: 56px;
   font-size: ${fontSize}px;
   font-weight: 700;
`;

const Headline = (props) => {
   //console.log("Headline render");
   return (
      <StyledHeading
         {...props} />
   );
};

Headline.propTypes = {
   level: PropTypes.oneOf([1, 2, 3, 4, 5, 6]),
   children: PropTypes.any,
   color: PropTypes.string,
   title: PropTypes.string,
   truncate: PropTypes.bool,
   isInline: PropTypes.bool,
   type: PropTypes.oneOf(['menu', 'content']),
};

Headline.defaultProps = {
   color: '#333333',
   title: '',
   truncate: false,
   isInline: false,
   level: 1
};

export default Headline;