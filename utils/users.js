const connectDB = require('../config/db')

const users = [];


// get rooms 
async function getRoom() {
  const rooms = await connectDB.query("Select *From groups");
  return rooms[0];
}

// Join user to chat
async function userJoin(id, username, room) {
  const users = await connectDB.query("Insert into users(username, socket_id) values(? ,? )", [username, id]);
  await connectDB.query("insert into group_users(group_id , user_id ) values(? ,? )", [room, users[0].insertId]);
  const user = { id, username, room };
  return user;
}

// Get current user
async function getCurrentUser(id) {
  const user = await connectDB.query(`Select u.socket_id as id, g.group_id as room, u.username from users u inner join 
  group_users gu on u.user_id = gu.user_id inner join 
  groups g on g.group_id = gu.group_id 
  where u.socket_id = ?
  limit 1`, [id]);
  return user[0][0];
}

// User leaves chat
function userLeave(id) {
  const index = users.findIndex(user => user.id === id);
  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
}

// Get room users
async function getRoomUsers(room) {
  const group_users = await connectDB.query(`Select u.socket_id as id, g.groupname as room, u.username from 
  group_users gu inner join 
  groups g on g.group_id = gu.group_id inner join
  users u on gu.user_id = u.user_id 
  where gu.group_id =  ?
  `, [room]);
  return group_users[0]
}

// put the chat in db 

// Get room users
async function putChatMessage({ id, msg, roomName }) {
  const group_id = await connectDB.query(`select group_id from groups g where groupname  = ?`, [roomName])  
  const putChatMessage = await connectDB.query(`Insert into messages ( socket_id , message, group_id )
  values ( ?, ?, ? )
  `, [id, msg, group_id[0][0].group_id]);

}

module.exports = {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers,
  getRoom,
  putChatMessage
};
