import React, { Component } from 'react'
import PropTypes from 'prop-types'
// import Button from '../Button'

function noop() {}

export default class RangePicker extends Component {
  render() {
    const { title, content, onCancel, onConfirm, value } = this.props

    return (
      <div className="pf-range-picker">
        <div className="pf-range-picker-top">
          {/* <Button
            className="pf-range-picker-button"
            type="primary"
            mode="text"
            size="md"
            onClick={onCancel}
          >
            取消
          </Button>
          <h3 className="pf-range-picker-title">{title}</h3>
          <Button
            className="pf-range-picker-button"
            type="primary"
            mode="text"
            size="md"
            onClick={onConfirm}
            disabled={!value.start || !value.end}
          >
            确定
          </Button> */}
        </div>
        {content}
      </div>
    )
  }
}

RangePicker.propTypes = {
  title: PropTypes.string,
  content: PropTypes.element,
  value: PropTypes.object,
  onCancel: PropTypes.func,
  onConfirm: PropTypes.func
}

RangePicker.defaultProps = {
  onCancel: noop,
  onConfirm: noop
}
