const jwt = require("jsonwebtoken");

const handleIndex = async (req, res) => {
    res.send('Hello Maneger');
}

const setToken = async (req, res) => {
    const user = req.body;
    const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "1h",
    });
    // console.log(token);

    res.send({ token });
}

module.exports = {
    handleIndex,
    setToken
}