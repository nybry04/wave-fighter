const mysql = require('mysql2')
const express = require('express')
const cors = require('cors')
const app = express()
app.use(express.json())
app.use(cors())

const SERVER_PORT = process.env['SERVER_PORT'] === undefined ? 8081 : parseInt(process.env['SERVER_PORT'])
const SERVER_HOST = process.env['SERVER_HOST'] === undefined ? '0.0.0.0' : process.env['SERVER_HOST']

const MYSQL_PORT = process.env['MYSQL_PORT'] === undefined ? 3306 : parseInt(process.env['MYSQL_PORT'])
const MYSQL_HOST = process.env['MYSQL_HOST'] === undefined ? '0.0.0.0' : process.env['MYSQL_HOST']
const MYSQL_USER = process.env['MYSQL_USER'] === undefined ? 'wave-fighter' : process.env['MYSQL_USER']
const MYSQL_PASSWORD = process.env['MYSQL_PASSWORD'] === undefined ? 'wave-fighter-password' : process.env['MYSQL_PASSWORD']
const MYSQL_DATABASE = process.env['MYSQL_DATABASE'] === undefined ? 'wave-fighter' : process.env['MYSQL_DATABASE']

const mysqlConnection = mysql.createConnection({
    port: MYSQL_PORT,
    host: MYSQL_HOST,
    user: MYSQL_USER,
    database: MYSQL_DATABASE,
    password: MYSQL_PASSWORD
})

let server = undefined

mysqlConnection.connect((err) => {
    if(err) {
        console.error('Ошибка', err.message)
        process.exit(-1000)
        return
    }

    console.log('База данных подключена')

    mysqlConnection.execute('CREATE TABLE IF NOT EXISTS `rating` (`id` INT NOT NULL AUTO_INCREMENT, `login` VARCHAR(50) NOT NULL, `wavelevel` INT NOT NULL, `level` INT NOT NULL, `time` INT NOT NULL, PRIMARY KEY (`id`), UNIQUE INDEX `login` (`login`));')

    app.post('/get', (req, res) => {
        let sql = 'SELECT * FROM `rating`'

        mysqlConnection.execute(sql, (err, result, fields) => {
            if(err) {
                console.error('Ошибка', err.message)
                return res.json({
                    success: false,
                    message: 'Ошибка ' + err.message
                })
            }

            return res.json({
                success: true,
                result: result
            })
        })
    })

    app.post('/publish', (req, res) => {
        let login = req.body['login']
        let wavelevel = req.body['wavelevel']
        let level = req.body['level']
        let time = req.body['time']

        console.log('new publish', req.body)

        try {
            if(login === undefined || wavelevel === undefined || level === undefined || time === undefined) {
                throw new Error('Ошибка аргументы отсутствуют')
            }
            if(typeof login !== 'string' || login.length < 3 || login.length > 10) throw new Error('Ошибка login')
            if(typeof wavelevel !== 'number' || wavelevel < 1) throw new Error('Ошибка wavelevel')
            if(typeof time !== 'number') throw new Error('Ошибка time')
        }catch (e) {
            return res.json({
                success: false,
                message: e.message
            })
        }

        let sql = 'INSERT INTO `rating` (login, wavelevel, level, time) VALUES(?, ?, ?, ?) ON DUPLICATE KEY UPDATE wavelevel=VALUES(wavelevel), level=VALUES(level), time=VALUES(time)'

        mysqlConnection.query(sql, [login, wavelevel, level, time], (err) => {
            if(err) {
                console.error('Ошибка', err.message)
                return res.json({
                    success: false,
                    message: 'Ошибка ' + err.message
                })
            }
        })

        return res.json({
            success: true,
            message: 'Результат опубликован'
        })
    })

    server = app.listen(SERVER_PORT, SERVER_HOST, () => {
        console.log('wave-fighter-server запущен на', SERVER_HOST + ':' + SERVER_PORT)
    })
})

const exitHandler = (exitCode) => {
    // mysql error
    if(exitCode !== -1000) {
        mysqlConnection.end()
    }
    server.close()
}

process.on('exit', exitHandler)
process.on('SIGINT', exitHandler)
process.on('SIGUSR1', exitHandler)
process.on('SIGUSR2', exitHandler)
process.on('uncaughtException', exitHandler)