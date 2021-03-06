# DropDown

Is a dropdown with any number of action

### Usage

```js
import { DropDown } from "asc-web-components";
```

```jsx
<DropDown opened={false}></DropDown>
```

By default, it is used with DropDownItem elements in role of children.

If you want to display something custom, you can put it in children, but take into account that all stylization is assigned to the implemented component.

When using component, it should be noted that parent must have CSS property _position: relative_. Otherwise, DropDown will appear outside parent's border.

### Properties

| Props         |      Type      | Required |     Values      | Default  | Description                                                                            |
| ------------- | :------------: | :------: | :-------------: | :------: | -------------------------------------------------------------------------------------- |
| `className`   |    `string`    |    -     |        -        |    -     | Accepts class                                                                          |
| `directionX`  |    `oneOf`     |    -     | `left`, `right` |  `left`  | Sets the opening direction relative to the parent                                      |
| `directionY`  |    `oneOf`     |    -     | `top`, `bottom` | `bottom` | Sets the opening direction relative to the parent                                      |
| `id`          |    `string`    |    -     |        -        |    -     | Accepts id                                                                             |
| `manualWidth` |    `string`    |    -     |        -        |    -     | Required if you need to specify the exact width of the component, for example 100%     |
| `manualX`     |    `string`    |    -     |        -        |    -     | Required if you need to specify the exact distance from the parent component           |
| `manualY`     |    `string`    |    -     |        -        |    -     | Required if you need to specify the exact distance from the parent component           |
| `maxHeight`   |    `number`    |    -     |        -        |    -     | Required if the scrollbar is displayed                                                 |
| `opened`      |     `bool`     |    -     |        -        | `false`  | Tells when the dropdown should be opened                                               |
| `style`       | `obj`, `array` |    -     |        -        |    -     | Accepts css style                                                                      |
| `withArrow`   |     `bool`     |    -     |        -        | `false`  | It is used if it is necessary to display blue protruding angle as when viewing profile |
