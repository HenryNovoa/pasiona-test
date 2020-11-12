const { AuthError, NotFoundError, ValueError, NotAllowedError } = require('../errors')

function routeHandler(callback, res) {
    try {
        callback()
            .catch(err => {
                const { message, extra } = err

                if (err instanceof AuthError) {
                    res.status(401)
                } else if (err instanceof NotAllowedError) {
                    res.status(403)
                } else if (err instanceof NotFoundError) {
                    res.status(404)
                } else {
                    res.status(500)
                }

                res.json({
                    error: message,
                    data: extra
                })
            })
    } catch (err) {
        const { error: message } = err

        if (err instanceof TypeError || err instanceof ValueError) {
            res.status(400)
        } else {
            res.status(500)
        }

        res.json({
            error: message
        })
    }
}

module.exports = routeHandler
