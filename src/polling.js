import { PollTimeout } from './errors'

function poll(config) {
  const { requestFunc, conditionChecker, remainingTime, resolve, reject } = config
  const timeout = ((remainingTime || 0) - 25) < 0 ? remainingTime : 25

  if (remainingTime <= 0) {
    return reject(new PollTimeout('Polling timed out'))
  }

  requestFunc({ timeout })
    .then(result => {
      if (conditionChecker(result)) return resolve(result)
      
      const newRemainingTime = remainingTime - timeout

      const newConfig = { 
        requestFunc, 
        conditionChecker, 
        remainingTime: newRemainingTime, 
        resolve, 
        reject,
      }
      
      return setTimeout(() => poll.call(this, newConfig), timeout)
    })
    .catch(reject)
}

export default poll
