import { PollTimeout } from './errors'

function poll(config) {
  const { requestFunc, conditionChecker, remainingTime } = config
  const timeout = ((remainingTime || 0) - 25) < 0 ? remainingTime : 25

  return new Promise((resolve, reject) => {
    if (remainingTime <= 0) {
      return reject(new PollTimeout('Polling timed out'))
    }

    return requestFunc({ timeout })
      .then(result => {
        if (conditionChecker(result)) {
          return resolve(result)
        }

        const newRemainingTime = remainingTime - timeout

        const newConfig = {
          requestFunc,
          conditionChecker,
          remainingTime: newRemainingTime,
        }

        return resolve(poll.call(this, newConfig))
      })
  })
}

export default poll
