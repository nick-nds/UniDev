import type { PlasmoMessaging } from "@plasmohq/messaging"

const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
    const curlObj = req.body

    try {
        fetch(curlObj.url, {
            method: curlObj.method,
            headers: curlObj.header,
            credentials: 'include',
        }).then(resp => {
            if(resp.redirected) {
                res.send({
                    redirected: true,
                })
                return;
            }
            return resp.json()
        }).then(data => {
            res.send({
                data
            })
        })

    } catch (error) {
    }
}

export default handler

