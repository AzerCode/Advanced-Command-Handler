module.exports = () => {
    console.log(`-------------------------------`);
    console.log(`Ready on Immortal's World!`);
    console.log(`-------------------------------`);

    const express = require('express');

    const app = express();

    const port = 3000 || 3001;

    app.get("/", (req, res) => {
        res.status(200).send(`Main page`)
    })

    // app.get("/test/docs", (req, res) => {
    //     res.status(200).send(test_docs)
    // })

    app.get("/test/docs", (req, res) => {
        res.sendFile(__dirname + "../../HTML/index.html");
      });

    app.listen(port);
};