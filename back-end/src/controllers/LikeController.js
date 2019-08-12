const Dev = require('../models/Dev');

module.exports = {
    async store (req, res) {
        const {user} = req.headers
        const {devId} = req.params 

        const loggedDev = await Dev.findById(user)
        const targetDev = await Dev.findById(devId)

        if (!targetDev) {
            return res.status(400).json({ error : 'Dev not exists' })
        }

        if (targetDev.likes.includes(loggedDev._id)){
            const loggefSocket = req.connectedUser[user]
            const targetSocket = req.connectedUser[devId]

            if (loggefSocket) {
                req.io.to(loggefSocket).emit('match', targetDev)
            }

            if (targetDev) {
                req.io.to(targetSocket).emit('match', loggedDev)
            }
        }

        loggedDev.likes.push(targetDev._id)

        await loggedDev.save()

        return res.json(loggedDev)
    }
}