import { GraphQLServer} from 'graphql-yoga'
import uuidv4 from 'uuid/v4'

// Demo user data
const users = [
    {
        id:'1',
        name:'Andrew',
        email:'andrew@example.com',
        age:27
    },
    {
        id:'2',
        name:'Sarah',
        email:'sara@example.com'
    },
    {
        id:'3',
        name:'Jinsoo',
        email:'jinsoo@example.com',
        age:28
    }
]

// Demo post data
const posts = [
    {
     id:'100',
     title:'Leaning JPA',
     body:'Learning JPA for fun',
     published : false,
     author:'1'
    },
    {
        id:'101',
        title:'Leaning Hibernate',
        body:'Learning Hibernate for fun',
        published : false,
        author:'1'
    }
    ,
    {
        id:'102',
        title:'React is fun',
        body:'Why dont you leanrn progrmming skills',
        published : true,
        author:'2'
    }
]

// Demo comment data

const comments = [
    {
        id:'1001',
        text:'comment from 1001 id',
        author:'1',
        post:'100'
    },
    {
        id:'1002',
        text:'comment from 1002 id',
        author:'1',
        post:'100'
    },
    {
        id:'1003',
        text:'comment from 1003 id',
        author:'2',
        post:'101'
    },
    {
        id:'1004',
        text:'comment from 1004 id',
        author:'3',
        post:'102'
    }
]

// Type definitions (schema,datastructure)
const typeDefs = `
    type Query  {
      users(query:String):[User!]!
      post:[Post!]!
      me:User!
      comments:[Comment!]!
    }

    type Mutation {
        createUser(name:String!,email:String!,age:Int): User!
    }

    type User {
        id: ID!
        name:String!
        email:String!
        age:Int
        posts:[Post!]!
        comments:[Comment!]!
    }

    type Post {
        id:ID!
        title:String!
        body:String!
        published:Boolean!
        author:User!
        comments:[Comment!]!
    }

    type Comment {
        id:ID!
        text:String!
        author:User!
        post:Post!
    }
`
// Resolvers(function)
const resolvers = {
    Query:{
        me(parent,args,ctx,info){
            return {
                id:'myId',
                name:'jinsoo',
                age:28,
                email:'roorooro9933@gmail.com'
            }
        },
        users(parent,args,ctx,info){
            if(!args.query){
                return users
            }

            return users.filter((user)=>{
                return user.name.toUpperCase().includes(args.query.toUpperCase())
            })
        },
        post(parent,args,ctx,info){
            return posts
        },
        comments(parent,args,ctx,info){
            return comments
        }
    },
    Mutation:{
        createUser(parent,args,ctx,info){
            // 같은 이메일을 가진 사람이 있냐를 알 수 있는 메소드
            const emailTaken = users.some((user)=> user.email === args.email)

            if(emailTaken){
                throw new Error('Email taken.')
            }

            const user = {
                id:uuidv4(),
                name:args.name,
                email:args.email,
                age:args.age
            }

            users.push(user)

            return user
        }
    },
    Post:{
        // 모든 post들이 이 author method를 call 할 것이다.
        author(parent,args,ctx,info){
            return users.find((user)=>{
                return user.id === parent.author
            })
        },
        comments(parent,args,ctx,info){
            return comments.filter((comment)=>{
                return parent.post === post.id
            })
        }
    },
    User:{
        posts(parent,args,ctx,info){
            return posts.filter((post)=>{
                return post.author === parent.id
            })
        },
        // User안에 있는 comments는 이 return 값으로 해라 라는 뜻.
        comments(parent,args,ctx,info){
            return comments.filter((comment)=>{
                return comment.author === parent.id
            })
        }
    },
    Comment:{
        author(parent,args,ctx,info){
            return users.find((user)=>{
                return user.id === parent.author
            })
        },
        post(parent,args,ctx,info){
            return posts.find((post)=>{
                return post.id === comment.post
            })
        }
    }
}

const server = new GraphQLServer({
    typeDefs,
    resolvers
})

server.start(()=>{
    console.log('The server is up')
})


