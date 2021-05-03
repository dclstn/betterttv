import React, {useEffect, useState} from 'react';
import EditTable from './editTable.jsx';
import settings from '../../../settings.js';
import debug from '../../../utils/debug.js';

import Toggle from 'rsuite/lib/Toggle/index.js';
import Dropdown from 'rsuite/lib/Dropdown/index.js';
import Button from 'rsuite/lib/Button/index.js';
import Icon from 'rsuite/lib/Icon/index.js';
import Checkbox from 'rsuite/lib/Checkbox/index.js';
import CheckboxGroup from 'rsuite/lib/CheckboxGroup/index.js';
import Slider from 'rsuite/lib/Slider/index.js';
import Radio from 'rsuite/lib/Radio/index.js';
import RadioGroup from 'rsuite/lib/RadioGroup/index.js';
import FormGroup from 'rsuite/lib/FormGroup/index.js';

function Setting({setting}) {
  const {description} = setting;
  return (
    <div className="bttv-setting">
      <p className="bttv-muted-text">{description}</p>
      <br />
      {getSetting(setting)}
    </div>
  );
}

function getSetting({id, type, options, _defaultValue}) {
  const [value, setValue] = useState(_defaultValue || settings.get(id));

  useEffect(() => {
    if (settings.get(id) === value) return;
    settings.set(id, value);
  }, [value]);

  switch (type) {
    case 0:
      return <Toggle defaultChecked={value} onChange={(state) => setValue(state)} />;
    case 1:
      const items = options.map((option, index) => (
        <Dropdown.Item key={index} onSelect={() => setValue(index)}>
          {option}
        </Dropdown.Item>
      ));
      return (
        <Dropdown
          className="bttv-setting-dropdown"
          title={options[selected]}
          trigger={['click', 'hover']}
          renderTitle={(children) => {
            return <Button appearance="primary">{children}</Button>;
          }}>
          {items}
        </Dropdown>
      );
    case 2: {
      return (
        <CheckboxGroup
          value={value}
          onChange={(value) => {
            setValue(value);
          }}>
          {options.choices.map((option, index) => (
            <Checkbox key={index} value={index}>
              {option}
            </Checkbox>
          ))}
        </CheckboxGroup>
      );
    }
    case 3:
      return <EditTable options={options} setData={setValue} data={value} />;
    case 4:
      return (
        <Slider
          min={options.min}
          max={options.max}
          defaultValue={options.current}
          progress
          onChange={(value) => setValue(value)}
        />
      );
    case 5:
      return (
        <FormGroup controlId="radioList">
          <RadioGroup
            name="radioList"
            defaultValue={value}
            onChange={(value) => {
              setValue(value);
            }}>
            {options.choices.map((option, index) => (
              <Radio key={index} value={index}>
                {option}
              </Radio>
            ))}
          </RadioGroup>
        </FormGroup>
      );
    default:
      debug.log(`${type} is an unknown setting type.`);
  }
}

export default Setting;
