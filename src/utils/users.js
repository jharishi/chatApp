

const users = []

const addUser  =  ({id,username,room})=>{
// clean the data 
username = username.trim().toLowerCase()
room = room.trim().toLowerCase()

//validate the data
if(!username || !room ){
    return {
        error : 'username and room are required'

       }
}
 //check existing user
 const existingUser = users.find((user)=>{
     return user.room === room && user.username === username
 })
 if(existingUser){
     return {
         error :'username already in use'
     }
 }



//store user
const user = {id,username,room}
users.push(user)
 return {user}
}

const removeUser =(id)=>{
    const index = users.findIndex((user)=> user.id === id)
     if(index !== -1){
         return users.splice(index,1)[0]
     }
}
 const getUser = (id)=>{
     
const check =users.find((user)=>user.id === id)
    return check

}
const getUserInRoom =(room)=>{
  return users.filter((user)=>user.room === room )
}

module.exports ={
    addUser,
    removeUser,
    getUser,
    getUserInRoom
}
 