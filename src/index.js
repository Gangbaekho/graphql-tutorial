import { GraphQLServer} from 'graphql-yoga'

// Type definitions (schema,datastructure)
const typeDefs = `
    type Query  {
      add(arg1:Float!,arg2:Float!):Float!
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
    add(parent,args,ctx,info){
        if(args.arg1 && args.arg2){
            return args.arg1 + args.arg2
            }
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

console.log('git branch test')