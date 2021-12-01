

const socket = io()

//elements
const $messageForm =document.querySelector('#message-form')
const $messageFormInput =document.querySelector('input')
const $messageFormButton = document.querySelector('button')
const $sendLocationButton = document.querySelector('#send-Location')
const $messages =document.querySelector('#messages')


//templates
const messageTemplate = document.querySelector('#message-template').innerHTML
const locationTemplate = document.querySelector('#location-template').innerHTML
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML
//options
 const {username,room }=Qs.parse(location.search,{ ignoreQueryPrefix : true} )

 const autoscroll = ()=>{
     //new message element
     const $newMessage = $messages.lastElementChild
     //Height of the new message 
     const newMessageStyles = getComputedStyle($newMessage)
     const newMessageMargin = parseInt(newMessageStyles.marginBottom)
     const newMessageHeight = $newMessage.offsetHeight + newMessageMargin

     //visble height
     const  visibleHeight =$messages.offsetHeight

     //Height of the message container
     const containerHeight = $messages.scrollHeight

     //Hw far I scrolled?
     const scrollOffset =$messages.scrollTop + visibleHeight

     if(containerHeight- newMessageHeight<= scrollOffset){
      $messages.scrollTop= $messages.scrollHeight
     }
 }


//const $sendLocationButton =document.querySelector('button')

// socket.on('countUpdated',(count)=>{
//     console.log('the count has been updated',count)
// })
// document.querySelector('#increment').addEventListener('click',()=>{
//     console.log('clicked')
//     socket.emit('increment')
// })
socket.on('locationMessage',(message)=>{
   
    const html = Mustache.render(locationTemplate,{
        username :message.username,
        url:message.url,
        createdAt: moment(message.createdAt).format('h:mm a')
    })
    $messages.insertAdjacentHTML('beforeend',html)
})
socket.on('message',(message)=>{
    console.log(message)
    const html = Mustache.render(messageTemplate,{
        username :message.username,
        message : message.text,
        createdAt : moment(message.createdAt).format('h:mm a')
    })
 $messages.insertAdjacentHTML('beforeend',html)
})

socket.on('roomData',({room,users})=>{
    const html = Mustache.render(sidebarTemplate,{
        room,users
    })
    document.querySelector('#sidebar').innerHTML =html
})
$messageForm.addEventListener('submit',(e)=>{
    e.preventDefault()

    $messageFormButton.setAttribute('disabled','disabled')

    const message = e.target.elements.message.value

    socket.emit('sendMessage',message,(error)=>{
        $messageFormButton.removeAttribute('disabled')
        $messageFormInput.value =''
        $messageFormInput.focus()
        if(error){
            console.log(error)
        }
        
    })
    console.log('this message was delivered')
})

$sendLocationButton.addEventListener('click',()=>{
    if(!navigator.geolocation){
        return alert ('GeoLocation not available')
    }
    $sendLocationButton.setAttribute('disabled','disabled')
    navigator.geolocation.getCurrentPosition((position)=>{
       console.log(position)
       socket.emit('sendLocation',{
           latitude : position.coords.latitude,
           longitude : position.coords.longitude
       },()=>{
           $sendLocationButton.removeAttribute('disabled')
           console.log('location was shared')

       })
    })
})
socket.emit('join',{username,room},(error)=>{
   if(error){
       alert(error)
       location.href = '/'
   }
})