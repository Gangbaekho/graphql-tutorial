import { GraphQLServer} from 'graphql-yoga'

// Type definitions (schema,datastructure)
const typeDefs = `
    type Query  {
      add(numbers:[Float!]!):Float!
      grades:[Int!]!
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
        if(args.numbers.length === 0){
            return 0
        }
        // [1,5,10,2]
        // reduce에 대해서 알아야 하는건데, 첫번째는
        // accumulator = 1, currentValue = 5가 되고 그 다음에는
        // accumulator = 6, currentValue = 10이 된다는 것을 알면 된다.
        return args.numbers.reduce((accumulator,currentValue)=>{
            return accumulator + currentValue
        })
    },
    grades(parent,args,ctx,info){
        return [98,12,51]
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


