import {css} from 'styled-components';

const commonTextStyles = css`
  /*font-family: 'Open Sans', sans-serif, Arial;*/
  font-family: ${props=> props.theme.fontFamily};
  /*text-align: left;*/
  text-align: ${props=> props.theme.textAlign};
  /*color: ${props => props.color};*/
  color: ${props => props.theme.color};
  ${props => (props.truncate === true && css`white-space: nowrap; overflow: hidden; text-overflow: ellipsis;`)}
`;

export default commonTextStyles;