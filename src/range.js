import React, { Component } from 'react'
import PropTypes from 'prop-types'
import moment from 'moment-mini'
import classNames from 'classnames'
import config from './config'

function noop() {}

class DateRange extends Component {
  constructor(props) {
    super(props)
    this.state = {
      dateTimeRange: this.props.value,
      clickNum: 0,
      renderMonthNum: 3
    }
  }

  componentDidMount() {
    this.rangeBox.addEventListener('scroll', () => {
      const scrollTop = this.rangeBox.scrollTop
      const scrollHeight = this.rangeBox.scrollHeight
      const screenHeight = window.screen.availHeight

      if (
        scrollTop * window.devicePixelRatio +
          screenHeight * window.devicePixelRatio >=
        scrollHeight
      ) {
        this.setState({
          renderMonthNum: this.state.renderMonthNum + 3
        })
      }
    })
  }

  // get days of current month
  getMonthDays(year, month) {
    const monthDays = []
    const idx = moment([year, month - 1, 1])
    idx.subtract(idx.weekday(), 'days').calendar()

    for (var i = 0; i < 6; i++) {
      monthDays.push([])

      for (var j = 0; j < 7; j++) {
        monthDays[i].push({
          day: idx.date(),
          month: idx.month() + 1,
          year: idx.year(),
          active: idx.month() + 1 == month,
          weekday: config.weekLabels.zh[idx.weekday()]
        })
        idx.add(1, 'days')
      }
    }
    return monthDays
  }

  handleSelect(_year, _month, _day) {
    const { onRangeChange, onMaxRangeError } = this.props
    let currClickNum = this.state.clickNum + 1
    this.setState(
      {
        clickNum: currClickNum
      },
      () => {
        // 选中设置成开始
        if (this.state.clickNum === 1) {
          this.setState(
            {
              dateTimeRange: {
                start: `${_year}/${_month}/${_day}`,
                end: ''
              }
            },
            () => {
              onRangeChange(this.state.dateTimeRange)
            }
          )
          return
        }

        // 选中设置成结束
        if (this.state.clickNum === 2) {
          // 开始时间不能大于结束时间
          if (
            moment(`${_year}/${_month}/${_day}`).isBefore(
              moment(this.state.dateTimeRange.start)
            )
          ) {
            this.setState(
              {
                clickNum: 1,
                dateTimeRange: {
                  start: `${_year}/${_month}/${_day}`,
                  end: ''
                }
              },
              () => {
                onRangeChange(this.state.dateTimeRange)
              }
            )
            return
          }

          // 判断时间跨度是否大于最大天数
          if (
            Math.abs(
              moment(this.state.dateTimeRange.start).diff(
                moment(`${_year}/${_month}/${_day}`),
                'days'
              )
            ) >= this.props.maxRange
          ) {
            onMaxRangeError(this.props.maxRange)

            this.setState(
              {
                clickNum: this.state.clickNum - 1,
                dateTimeRange: {
                  start: this.state.dateTimeRange.start,
                  end: ''
                }
              },
              () => {
                onRangeChange(this.state.dateTimeRange)
              }
            )
            return
          }

          this.setState(
            {
              dateTimeRange: {
                start: this.state.dateTimeRange.start,
                end: `${_year}/${_month}/${_day}`
              }
            },
            () => {
              onRangeChange(this.state.dateTimeRange)
            }
          )
          return
        }

        // 没有选中的状态
        if (this.state.clickNum > 2) {
          this.setState(
            {
              clickNum: 0,
              dateTimeRange: {
                start: '',
                end: ''
              }
            },
            () => {
              onRangeChange(this.state.dateTimeRange)
            }
          )
        }
      }
    )
  }

  renderMonth(_year, _month, _key) {
    const { dateTimeRange } = this.state

    return (
      <div className="date-picker-month" key={`curr-month-${_key}`}>
        <div className="date-picker-range-current-month">{`${_year}年${_month}月`}</div>
        <div className="date-picker-range-weeks">
          {config.weekLabels.zh.map(week => (
            <div className="date-picker-range-week-item">{week}</div>
          ))}
        </div>
        <div className="date-picker-range-days-wrapper">
          {this.getMonthDays(_year, _month).map(week => {
            return (
              <div className="date-picker-range-days">
                {week.map(({ day, month, year, active, weekday }, index) => {
                  const dayItemClassName = classNames(
                    'date-picker-range-day-item',
                    {
                      [`date-picker-range-day-item-now-curr-month`]: !active,
                      [`is-today`]:
                        Number(moment().format('YYYY')) === year &&
                        Number(moment().format('M')) === month &&
                        Number(moment().format('D')) === day,
                      [`is-weekend`]:
                        (weekday === '日' || weekday === '六') && active,
                      [`start-day`]:
                        active &&
                        dateTimeRange.start &&
                        Number(dateTimeRange.start.split('/')[0]) === year &&
                        Number(dateTimeRange.start.split('/')[1]) === month &&
                        Number(dateTimeRange.start.split('/')[2]) === day,
                      [`end-day`]:
                        active &&
                        dateTimeRange.end &&
                        Number(dateTimeRange.end.split('/')[0]) === year &&
                        Number(dateTimeRange.end.split('/')[1]) === month &&
                        Number(dateTimeRange.end.split('/')[2]) === day,
                      [`between-day`]:
                        active &&
                        dateTimeRange.start &&
                        dateTimeRange.end &&
                        (moment(`${year}/${month}/${day}`).isBetween(
                          dateTimeRange.start,
                          dateTimeRange.end
                        ) ||
                          moment(`${year}/${month}/${day}`).isSame(
                            dateTimeRange.start
                          ) ||
                          moment(`${year}/${month}/${day}`).isSame(
                            dateTimeRange.end
                          ))
                    }
                  )

                  return (
                    <div
                      className={dayItemClassName}
                      onClick={() => {
                        this.handleSelect(year, month, day)
                      }}
                      key={`${month}${index}`}
                    >
                      {day}
                    </div>
                  )
                })}
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  renderMoreMonth = () => {
    const { renderMonthNum } = this.state
    return Array.apply(null, { length: renderMonthNum }).map((item, index) => {
      return this.renderMonth(
        moment()
          .add(index, 'month')
          .year(),
        moment()
          .add(index, 'month')
          .month() + 1,
        index
      )
    })
  }

  render() {
    return (
      <div
        className="pf-date-range-year"
        ref={rangeBox => (this.rangeBox = rangeBox)}
      >
        {this.renderMoreMonth()}
      </div>
    )
  }
}

DateRange.propTypes = {
  maxRange: PropTypes.number,
  onMaxRangeError: PropTypes.func,
  value: PropTypes.object,
  onRangeChange: PropTypes.func
}

DateRange.defaultProps = {
  onMaxRangeError: noop
}

export default DateRange
