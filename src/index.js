import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import RangePicker from './picker'
import DateRange from './range'

function noop() {}

class DatePickerRange extends Component {
  constructor(props) {
    super(props)
    this.state = {
      visible: false,
      containerClass: 'pf-range-picker-box',
      dateTimeRange: {
        start: '',
        end: ''
      }
    }
    this.container = null
  }

  setVisible = () => {
    const visible = this.state.visible

    this.setState(
      {
        visible: !visible
      },
      () => {
        if (this.state.visible) {
          setTimeout(() => {
            const rangePickerBoxClassName = classNames(
              'pf-range-picker-box',
              'is-range-picker-visible'
            )
            this.setState({
              containerClass: rangePickerBoxClassName
            })
          }, 0)
        }
      }
    )
  }

  handleCancel = (isCancel = true) => {
    this.setState(
      {
        visible: false
      },
      () => {
        isCancel && this.props.onRangeCancel()
        setTimeout(() => {
          this.removeContainer()
          this.setState({
            dateTimeRange: {
              start: '',
              end: ''
            }
          })
        }, 100)
      }
    )
  }

  handleSubmit = () => {
    const { dateTimeRange } = this.state
    this.props.onRangeConfirm(dateTimeRange)
    this.handleCancel(false)
  }

  removeContainer = () => {
    if (this.container) {
      ReactDOM.unmountComponentAtNode(this.container)
      this.container.parentNode.removeChild(this.container)
      this.container = null
      this.setState({
        containerClass: 'pf-range-picker-box'
      })
    }
  }

  getContainer = () => {
    if (!this.container) {
      const container = document.createElement('div')
      const containerId = `J_pfRangePickerContainer-${new Date().getTime()}`
      container.setAttribute('id', containerId)
      document.body.appendChild(container)
      this.container = container
    }
    return this.container
  }

  handleRangeChange = val => {
    this.setState({
      dateTimeRange: val
    })
  }

  getComponent = () => {
    const { containerClass, dateTimeRange } = this.state
    const { title, maxRange } = this.props

    return (
      <div className={containerClass}>
        <RangePicker
          title={title}
          content={
            <DateRange
              maxRange={maxRange}
              value={dateTimeRange}
              onRangeChange={this.handleRangeChange}
            />
          }
          value={dateTimeRange}
          onCancel={this.handleCancel}
          onConfirm={this.handleSubmit}
        />
      </div>
    )
  }

  render() {
    const { visible } = this.state
    const { children } = this.props

    return (
      <div>
        <div onClick={this.setVisible}>{children}</div>
        {visible &&
          ReactDOM.createPortal(this.getComponent(), this.getContainer())}
      </div>
    )
  }
}

DatePickerRange.propTypes = {
  title: PropTypes.string,
  maxRange: PropTypes.number,
  onRangeConfirm: PropTypes.func,
  onRangeCancel: PropTypes.func
}

DatePickerRange.defaultProps = {
  maxRange: 30,
  onRangeConfirm: noop,
  onRangeCancel: noop
}

export default DatePickerRange
