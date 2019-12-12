import styled, { css } from 'styled-components';
import PropTypes from 'prop-types';


const gridAreaStyle = gridArea => `grid-area: ${gridArea};`;
const gridGapStyle = gridGap => `grid-gap: ${gridGap};`;
const gridRowGapStyle = gridRowGap => `grid-row-gap: ${gridRowGap};`;
const gridColumnGapStyle = gridColumnGap => `grid-column-gap: ${gridColumnGap};`;

const alignContentStyle = alignContent => `align-content: ${alignContent};`;
const alignItemsStyle = alignItems => `align-items: ${alignItems};`;
const alignSelfStyle = alignSelf => `align-self: ${alignSelf};`;

const justifyContentStyle = justifyContent => `justify-content: ${justifyContent};`;
const justifyItemsStyle = justifyItems => `justify-items: ${justifyItems};`;
const justifySelfStyle = justifySelf => `justify-self: ${justifySelf};`;

const getRepeatCount = count => typeof count === 'number' ? count : `auto-${count}`;
const getRepeatSize = size => Array.isArray(size) ? `minmax(${size[0]}, ${size[1]})` : `minmax(${size}, 1fr)`;

const columnsStyle = props => {
  if (Array.isArray(props.columnsProp)) {
    return css`
      grid-template-columns: ${props.columnsProp
        .map(column => {
          return Array.isArray(column) ? `minmax(${column[0]}, ${column[1]})` : column;
        })
        .join(' ')};
    `;
  }
  if (typeof props.columnsProp === 'object') {
    return css`
      grid-template-columns: repeat(
        ${getRepeatCount(props.columnsProp.count)},
        ${getRepeatSize(props.columnsProp.size)}
      );
    `;
  }
  return css`
    grid-template-columns: repeat(
      auto-fill,
      ${getRepeatSize(props.columnsProp)}
    );
  `;
};

const rowsStyle = props => {
  if (Array.isArray(props.rowsProp)) {
    return css`
      grid-template-rows: ${props.rowsProp
        .map(row => {
          return Array.isArray(row) ? `minmax(${row[0]}, ${row[1]})` : row;
        })
        .join(' ')};
    `;
  }
  return css`
    grid-auto-rows: ${props.rowsProp};
  `;
};

const areasStyle = props => {
  if (
    Array.isArray(props.areasProp) &&
    props.areasProp.every(area => Array.isArray(area))
  ) {
    return `grid-template-areas: ${props.areasProp
      .map(area => `"${area.join(' ')}"`)
      .join(' ')};`;
  }
  const cells = props.rowsProp.map(() => props.columnsProp.map(() => '.'));
  props.areasProp.forEach(area => {
    for (let row = area.start[1]; row <= area.end[1]; row += 1) {
      for (let column = area.start[0]; column <= area.end[0]; column += 1) {
        cells[row][column] = area.name;
      }
    }
  });
  return `grid-template-areas: ${cells
    .map(r => `"${r.join(' ')}"`)
    .join(' ')};`;
};

const heightStyle = heightProp => `height: ${heightProp};`;
const widthStyle = widthProp => `width: ${widthProp};`;
const marginStyle = marginProp => `margin: ${marginProp};`;
const paddingStyle = paddingProp => `padding: ${paddingProp};`;

const Grid = styled.div`
  display: grid;
  box-sizing: border-box;

  ${props => props.gridArea && gridAreaStyle(props.gridArea)}
  ${props => props.gridGap && gridGapStyle(props.gridGap)}
  ${props => props.gridRowGap && gridRowGapStyle(props)}
  ${props => props.gridColumnGap && gridColumnGapStyle(props)}

  ${props => props.rowsProp && rowsStyle(props)}
  ${props => props.columnsProp && columnsStyle(props)}
  ${props => props.areasProp && areasStyle(props)}

  ${props => props.alignContent && alignContentStyle(props.alignContent)}
  ${props => props.alignItems && alignItemsStyle(props.alignItems)}
  ${props => props.alignSelf && alignSelfStyle(props.alignSelf)}

  ${props => props.justifyContent && justifyContentStyle(props.justifyContent)}
  ${props => props.justifyItems && justifyItemsStyle(props.justifyItems)}
  ${props => props.justifySelf && justifySelfStyle(props.justifySelf)}

  ${props => props.heightProp && heightStyle(props.heightProp)}
  ${props => props.widthProp && widthStyle(props.widthProp)}
  ${props => props.marginProp && marginStyle(props.marginProp)}
  ${props => props.paddingProp && paddingStyle(props.paddingProp)}
`;

Grid.propTypes = {
  gridArea: PropTypes.string,
  gridGap: PropTypes.string,
  gridRowGap: PropTypes.string,
  gridColumnGap: PropTypes.string,
  
  rowsProp: PropTypes.array,
  columnsProp: PropTypes.array,
  areasProp: PropTypes.array,

  alignContent: PropTypes.string,
  alignItems: PropTypes.string,
  alignSelfStyle: PropTypes.string,
  
  justifyContent: PropTypes.string,
  justifyItems: PropTypes.string,
  justifySelf: PropTypes.string,

  heightProp: PropTypes.string,
  widthProp: PropTypes.string,
  marginProp: PropTypes.string,
  paddingProp: PropTypes.string,
}

Grid.defaultProps = {
  heightProp: '100%',
  widthProp: '100%'
};

export default Grid;