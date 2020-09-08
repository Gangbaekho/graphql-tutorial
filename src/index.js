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

// Type definitions (schema,datastructure)
const typeDefs = `
    type Query  {
      users(query:String):[User!]!
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


