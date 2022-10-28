import VueRouter from 'vue-router'
import Homepage from './pages/Homepage'
import Conversation from './pages/Conversation'
import Message from './pages/Message'

export default new VueRouter({
    routes: [
        {
            name: 'homepage',
            path: '/',
            component: Homepage
        },
        {
            name: 'conversations',
            path: '/conversations',
            component: Conversation
        },
        {
            name: 'message',
            path: '/messages/:id',
            component: Message,
            props: true
        }
    ]
})