const chalk = require('chalk')

let orginalLog = console.log

console.log = (...args) => {
    orginalLog.apply(this, args)
}

console.warn = (...args) => {
    args.unshift(chalk.yellow('[WARN]'))
    orginalLog.apply(this, args)
}

console.error = (...args) => {
    args.unshift(chalk.red('[ERROR]'))
    orginalLog.apply(this, args)
}

console.info = (...args) => {
    args.unshift(chalk.blue('[INFO]'))
    orginalLog.apply(this, args)
}

module.exports.log = console.log
module.exports.warn = console.warn
module.exports.error = console.error
module.exports.info = console.info