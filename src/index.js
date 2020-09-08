import { GraphQLServer} from 'graphql-yoga'

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
        id:'101',
        title:'React is fun',
        body:'Why dont you leanrn progrmming skills',
        published : true,
        author:'2'
    }
    
]

// Type definitions (schema,datastructure)
const typeDefs = `
    type Query  {
      users(query:String):[User!]!
      post:[Post!]!
      me:User!
    }

    type User {
        id: ID!
        name:String!
        email:String!
        age:Int
    }

    type Post {
        id:ID!
        title:String!
        body:String!
        published:Boolean!
        author:User!
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
        }
    },
    Post:{
        // 모든 post들이 이 author method를 call 할 것이다.
        author(parent,args,ctx,info){
            return users.find((user)=>{
                return user.id === parent.author
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


