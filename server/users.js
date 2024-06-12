const {trimStr} = require("./utils");

let users = [];

const findUser = (user) => {
    const userName = trimStr(user.name);
    const userRoom = trimStr(user.room);

    return users.find(
        (u) => trimStr(u.name) === userName && trimStr(u.room) === userRoom
        );  
};

const addUser = () => {
    const isExist = findUser(user);
    
    !isExist && users.push(user);

    const currentUser = isExist || user; 

    return {isExist: !!isExist, user: currentUser};
};

module.exports = {addUser, findUser};