# GroupButtonsMenu

## Usage

```js
import { GroupButtonsMenu } from 'asc-web-components';
```

#### Description

Menu for group actions on a page.

#### Usage

```js
 const menuItems = [
      {
        label: 'Select',
        isDropdown: true,
        isSeparator: true,
        isSelect: true,
        fontWeight: 'bold',
        children: [
          <DropDownItem key='aaa' label='aaa' />,
          <DropDownItem key='bbb' label='bbb' />,
          <DropDownItem key='ccc' label='ccc' />,
        ],
        onSelect: (a) => console.log(a)
      },
      {
        label: 'Menu item 1',
        disabled: false,
        onClick: () => console.log('Menu item 1 action')
      },
      {
        label: 'Menu item 2',
        disabled: true,
        onClick: () => console.log('Menu item 2 action')
      }
    ];

<GroupButtonsMenu checked={false} menuItems={menuItems} visible={true} />
```

#### Properties

| Props              | Type     | Required | Values                      | Default   | Description                                               |
| ------------------ | -------- | :------: | --------------------------- | --------- | --------------------------------------------------------- |
| `checked`          | `bool`   | -        | -                           | `false`   | Sets initial value of checkbox                            |
| `menuItems`        | `array`  | -        | -                           | -         | Button collection                                         |
| `visible`          | `bool`   | -        | -                           | -         | Sets menu visibility                                      |
| `moreLabel`        | `string` | -        | -                           | `More`    | Label for more button                                     |
| `closeTitle`       | `string` | -        | -                           | `Close`   | Title for close menu button                               |
| `onClick`          | `function` | -      | -                           | -         | onClick action on GroupButton`s                           |
| `onClose`          | `function` | -      | -                           | -         | onClose action if menu closing                            |
| `onChange`         | `function` | -      | -                           | -         | onChange action on use selecting                          |